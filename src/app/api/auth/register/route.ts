import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User, { UserRole } from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { email, password, name, role } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Bad Request', message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Bad Request', message: 'Invalid email format' }, { status: 400 });
        }

        // Password validation
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Bad Request', message: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Role validation
        const validRoles = [UserRole.CITIZEN, UserRole.NGO];
        const userRole = role && validRoles.includes(role) ? role : UserRole.CITIZEN;

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json({ error: 'Forbidden', message: 'Email already registered' }, { status: 403 });
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const user = await User.create({
            email: email.toLowerCase(),
            name,
            passwordHash,
            role: userRole,
            isActive: true,
        });

        // Return user (without password hash)
        return NextResponse.json(
            {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                role: user.role,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: 'Registration failed' }, { status: 500 });
    }
}
