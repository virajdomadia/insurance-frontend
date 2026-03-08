import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, password } = body;

        // 1. Basic validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        await connectDB();

        // 2. Normalize email
        const normalizedEmail = email.toLowerCase().trim();

        // 3. Check if user already exists
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            // Return a generic/obscured error if needed, but for registration explicit might be okay
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 409 } // Conflict
            );
        }

        // 4. Hash password securely
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 5. Create user (Default role: citizen)
        const newUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
        });

        // We do not issue a JWT here immediately to enforce a login step (optional)
        // Or we could auto-login, but for strict security forcing a login is cleaner.

        return NextResponse.json(
            { success: true, message: 'Registration successful' },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration Error:', error);
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json({ error: messages.join(', ') }, { status: 400 });
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
