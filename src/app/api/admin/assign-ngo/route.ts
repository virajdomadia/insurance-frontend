import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User, { UserRole } from '@/models/User';
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
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: 'Bad Request', message: 'userId is required' }, { status: 400 });
        }

        // Find user
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: 'Not Found', message: 'User not found' }, { status: 404 });
        }

        // Update role to NGO
        user.role = UserRole.NGO;
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
        console.error('Assign NGO error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: 'Failed to assign NGO role' }, { status: 500 });
    }
}
