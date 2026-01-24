import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import RefreshToken from '@/models/RefreshToken';
import { generateAccessToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Get refresh token from cookie
        const cookieStore = await cookies();
        const refreshTokenValue = cookieStore.get('refreshToken')?.value;

        if (!refreshTokenValue) {
            return NextResponse.json({ error: 'Unauthorized', message: 'No refresh token provided' }, { status: 401 });
        }

        // Find refresh token in database
        const refreshToken = await RefreshToken.findOne({ token: refreshTokenValue });

        if (!refreshToken) {
            return NextResponse.json({ error: 'Unauthorized', message: 'Invalid refresh token' }, { status: 401 });
        }

        // Check if token is expired
        if (new Date() > refreshToken.expiresAt) {
            await RefreshToken.deleteOne({ _id: refreshToken._id });
            return NextResponse.json({ error: 'Unauthorized', message: 'Refresh token expired' }, { status: 401 });
        }

        // Find user
        const user = await User.findById(refreshToken.userId);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized', message: 'User not found' }, { status: 401 });
        }

        // Check if user is active
        if (!user.isActive) {
            return NextResponse.json({ error: 'Unauthorized', message: 'User account is deactivated' }, { status: 401 });
        }

        // Generate new access token
        const accessToken = generateAccessToken(user._id.toString(), user.role);

        return NextResponse.json({ accessToken }, { status: 200 });
    } catch (error) {
        console.error('Refresh token error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: 'Token refresh failed' }, { status: 500 });
    }
}
