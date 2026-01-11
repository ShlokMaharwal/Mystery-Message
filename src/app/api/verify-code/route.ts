import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export async function POST(request: Request) {
    try {
        console.log('=== Verify code API called ===');
        
        await dbConnect();
        console.log('✓ Database connected');

        const { username, code } = await request.json();
        console.log('Request received:', { username, code });
        
        const decodedUsername = decodeURIComponent(username);
        console.log('Decoded username:', decodedUsername);
        
        // Try finding user with both original and decoded username
        let user = await UserModel.findOne({ username: decodedUsername });
        
        if (!user) {
            console.log('✗ User not found with username:', decodedUsername);
            console.log('Searching for any users in database...');
            const allUsers = await UserModel.find({}).select('username email isVerified');
            console.log('Users in database:', allUsers.length > 0 ? allUsers : 'None');
            
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        console.log('✓ User found:', user.email);
        console.log('Stored verify code:', user.verifyCode);
        console.log('Provided code:', code);
        console.log('Code expiry:', user.verifyCodeExpiry);
        console.log('Current time:', new Date());

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        console.log('Code valid:', isCodeValid);
        console.log('Code not expired:', isCodeNotExpired);

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            console.log('✓ User verified successfully');

            return Response.json(
                { success: true, message: 'Account verified successfully' },
                { status: 200 }
            );
        } else if (!isCodeNotExpired) {
            console.log('✗ Code expired');
            return Response.json(
                {
                    success: false,
                    message:
                        'Verification code has expired. Please sign up again to get a new code.',
                },
                { status: 400 }
            );
        } else {
            console.log('✗ Incorrect code');
            return Response.json(
                { success: false, message: 'Incorrect verification code' },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('✗ Error verifying user:', error);
        return Response.json(
            { success: false, message: error instanceof Error ? error.message : 'Error verifying user' },
            { status: 500 }
        );
    }
}