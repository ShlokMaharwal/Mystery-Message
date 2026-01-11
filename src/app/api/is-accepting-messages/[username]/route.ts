import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  await dbConnect();

  try {
    const user = await UserModel.findOne({ username }).select(
      'isAcceptingMessages'
    );

    if (!user) {
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: user.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking message acceptance status:', error);
    return Response.json(
      { success: false, message: 'Error checking message status' },
      { status: 500 }
    );
  }
}
