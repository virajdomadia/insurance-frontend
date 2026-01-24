import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import RefreshToken from '@/models/RefreshToken';
import { requireAuth } from '@/middleware/auth';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Verify access token
        const authResult = requireAuth(request);
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        // Get refresh token from cookie
        const cookieStore = await cookies();
        const refreshTokenValue = cookieStore.get('refreshToken')?.value;

        // Delete refresh token from database if it exists
        if (refreshTokenValue) {
            await RefreshToken.deleteOne({ token: refreshTokenValue });
        }

        // Clear refresh token cookie
        const cookie = serialize('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        });

        const response = NextResponse.json({ ok: true }, { status: 200 });
        response.headers.set('Set-Cookie', cookie);

        return response;
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: 'Logout failed' }, { status: 500 });
    }
}
