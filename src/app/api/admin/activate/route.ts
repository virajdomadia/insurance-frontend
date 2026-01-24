import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/middleware/auth';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Verify admin access
        const authResult = requireAdmin(request);
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const body = await request.json();
        const { userId, isActive } = body;

        if (!userId || typeof isActive !== 'boolean') {
            return NextResponse.json(
                { error: 'Bad Request', message: 'userId and isActive (boolean) are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'Not Found', message: 'User not found' }, { status: 404 });
        }

        // Update active status
        user.isActive = isActive;
        await user.save();

        return NextResponse.json(
            {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Activate user error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to update user status' },
            { status: 500 }
        );
    }
}
