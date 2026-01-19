import UserModel from '@/model/User';
import dbConnect from '@/lib/dbConnect';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username: rawUsername } = await params;
  const username = decodeURIComponent(rawUsername || '');
  await dbConnect();

  try {
    console.log('is-accepting-messages: received username:', { rawUsername, username });

    const user = await UserModel.findOne({ username: { $regex: `^${username}$`, $options: 'i' } }).select(
      'isAcceptingMessages'
    );

    console.log('is-accepting-messages: found user?', !!user);

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
