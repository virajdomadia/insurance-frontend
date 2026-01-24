import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Verify authentication
        const authResult = requireAuth(request);
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { user: tokenUser } = authResult;

        // Fetch full user details
        const user = await User.findById(tokenUser.userId || tokenUser.sub).select('-passwordHash');

        if (!user) {
            return NextResponse.json({ error: 'Not Found', message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to fetch user profile' },
            { status: 500 }
        );
    }
}
