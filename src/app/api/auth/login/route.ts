import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/auth';
import { cookies } from 'next/headers';

// Simple in-memory rate limiting mechanism for login attempts (in a real app, use Redis)
const rateLimitCache = new Map<string, { count: number, resetTime: number }>();
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 60 * 1000 * 15; // 15 minutes

export async function POST(req: NextRequest) {
    try {
        // 1. Basic Rate Limiting Check (by IP or Email)
        // In edge runtimes, req.ip is deprecated in Next 15+. Fallback to headers or a placeholder.
        const ip = req.headers.get('x-forwarded-for') || 'unknown-ip';
        const body = await req.json();
        const { email, password } = body;

        const rateLimitKey = `${ip}:${email}`;
        const rateLimitData = rateLimitCache.get(rateLimitKey);

        if (rateLimitData && rateLimitData.count >= MAX_ATTEMPTS) {
            if (Date.now() < rateLimitData.resetTime) {
                return NextResponse.json(
                    { error: 'Too many login attempts. Please try again later.' },
                    { status: 429 }
                );
            } else {
                // Reset after duration expires
                rateLimitCache.delete(rateLimitKey);
            }
        }

        // 2. Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        await connectDB();

        // 3. Find user (select password explicitly because schema has select: false)
        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail }).select('+password');

        // Generic error to prevent email enumeration
        const genericAuthError = 'Invalid email or password';

        if (!user) {
            recordFailure(rateLimitKey);
            return NextResponse.json({ error: genericAuthError }, { status: 401 });
        }

        // 4. Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password!);

        if (!isPasswordValid) {
            recordFailure(rateLimitKey);
            return NextResponse.json({ error: genericAuthError }, { status: 401 });
        }

        // Success - clear rate limit
        rateLimitCache.delete(rateLimitKey);

        // 5. Generate secure JWT
        const token = signJwt({
            userId: user._id.toString(),
            role: user.role,
        });

        // 6. Set HTTP-Only Cookie to mitigate XSS
        const cookieStore = await cookies();
        cookieStore.set('auth_token', token, {
            httpOnly: true, // Prevents JavaScript access
            secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in prod
            sameSite: 'strict', // CSRF protection
            maxAge: 60 * 60 * 24 * 7, // 1 Week expiry
            path: '/',
        });

        // Do NOT send the token in the JSON response payload. Send user info instead.
        return NextResponse.json(
            {
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

function recordFailure(key: string) {
    const data = rateLimitCache.get(key);
    if (data) {
        rateLimitCache.set(key, { ...data, count: data.count + 1 });
    } else {
        rateLimitCache.set(key, { count: 1, resetTime: Date.now() + BLOCK_DURATION_MS });
    }
}
