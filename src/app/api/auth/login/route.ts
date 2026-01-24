import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import { comparePassword, generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, password } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Bad Request', message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized', message: 'Invalid credentials' }, { status: 401 });
        }

        // Check if user is active
        if (!user.isActive) {
            return NextResponse.json({ error: 'Forbidden', message: 'User account is deactivated' }, { status: 403 });
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.passwordHash);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Unauthorized', message: 'Invalid credentials' }, { status: 401 });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id.toString(), user.role);
        const refreshTokenValue = generateRefreshToken();
        const expiresAt = getRefreshTokenExpiry();

        // Save refresh token to database
        await RefreshToken.create({
            token: refreshTokenValue,
            userId: user._id.toString(),
            expiresAt,
        });

        // Set refresh token as HttpOnly cookie
        const cookie = serialize('refreshToken', refreshTokenValue, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 14 * 24 * 60 * 60, // 14 days
            path: '/',
        });

        const response = NextResponse.json({ accessToken }, { status: 200 });
        response.headers.set('Set-Cookie', cookie);

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: 'Login failed' }, { status: 500 });
    }
}
