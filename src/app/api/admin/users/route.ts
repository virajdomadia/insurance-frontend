import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { requireAdmin } from '@/middleware/auth';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Verify admin access
        const authResult = requireAdmin(request);
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        // Get all users
        const users = await User.find({}).select('-passwordHash').sort({ createdAt: -1 });

        const formattedUsers = users.map((user) => ({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
        }));

        return NextResponse.json(formattedUsers, { status: 200 });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: 'Failed to fetch users' }, { status: 500 });
    }
}
