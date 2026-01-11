import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';

export async function POST(request:Request){
    try {
        console.log("=== Sign-up API called ===");
        
        await dbConnect()
        console.log("✓ Database connected");

        const body = await request.json()
        console.log("✓ Request parsed:", { username: body.username, email: body.email });

        const {username,email,password} = body
        
        // Validate input
        if (!username || !email || !password) {
            console.log("✗ Missing required fields");
            return Response.json({
                success: false,
                message: "Username, email, and password are required"
            }, {
                status: 400
            })
        }

        console.log("✓ Input validation passed");

        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        console.log("✓ Checked username uniqueness:", !existingUserVerifiedByUsername);

        if (existingUserVerifiedByUsername){
            console.log("✗ Username already taken");
            return Response.json({
                success: false,
                message: "Username is already taken"
            },{
                status: 400
            })
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("✓ Generated verification code");

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                console.log("✗ Email already verified");
                return Response.json(
                {
                    success: false,
                    message: 'User already exists with this email',
                },
                { status: 400 }
                );
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.username = username;
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
                console.log("✓ Updated existing unverified user:", email);
            }
        } 
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });

            const savedUser = await newUser.save();
            console.log("✓ New user created in DB:", savedUser._id);
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );
        
        if (!emailResponse.success) {
            console.log("⚠ Email sending failed but user was created. Error:", emailResponse.message);
        } else {
            console.log("✓ Verification email sent");
        }

        console.log("✓ Sign-up completed successfully");
        return Response.json(
        {
            success: true,
            message: 'User registered successfully. Please verify your account.',
        },
        { status: 201 }
        );

    } catch (error) {
        console.error("✗ Error registering user", error)
        return Response.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}