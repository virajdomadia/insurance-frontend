import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import connectDB from '@/lib/mongodb';
import User, { UserRole } from '@/models/User';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'mock_secret_key_for_testing_purposes_only';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'mock_refresh_secret_key_for_testing_purposes_only';

export async function POST(req: NextRequest, props: { params: Promise<{ route: string[] }> }) {
    await connectDB();
    const { route: routeArray } = await props.params;
    const route = routeArray[0];
    const body = await req.json().catch(() => ({}));

    if (route === 'register') {
        const { email, password, name } = body;
        
        if (!email || !password) {
            return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
        }

        if (body.role && body.role === 'ADMIN') {
            return NextResponse.json({ message: 'Admin registration is not allowed' }, { status: 403 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name || 'User',
            email,
            password: hashedPassword,
            role: UserRole.CITIZEN,
        });

        return NextResponse.json({ 
            message: 'Registration successful', 
            user: { email: newUser.email, role: 'USER', name: newUser.name } 
        }, { status: 201 });
    }

    if (route === 'login') {
        const { email, password } = body;
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Frontend expects 'USER' or 'ADMIN'
        const roleToReturn = user.role.toUpperCase() === 'CITIZEN' ? 'USER' : user.role.toUpperCase();

        const accessToken = jwt.sign(
            { sub: user._id, email: user.email, role: roleToReturn, name: user.name },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { sub: user._id },
            REFRESH_SECRET,
            { expiresIn: '7d' }
        );

        const response = NextResponse.json({
            accessToken,
            user: { id: user._id, email: user.email, role: roleToReturn, name: user.name }
        });

        response.cookies.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60,
            path: '/',
        });

        return response;
    }

    if (route === 'refresh') {
        const refreshToken = req.cookies.get('refreshToken')?.value;

        if (!refreshToken) {
            return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
        }

        try {
            const payload = jwt.verify(refreshToken, REFRESH_SECRET) as any;
            const user = await User.findById(payload.sub);

            if (!user) {
                return NextResponse.json({ message: 'User not found' }, { status: 401 });
            }

            const roleToReturn = user.role.toUpperCase() === 'CITIZEN' ? 'USER' : user.role.toUpperCase();

            const accessToken = jwt.sign(
                { sub: user._id, email: user.email, role: roleToReturn, name: user.name },
                JWT_SECRET,
                { expiresIn: '15m' }
            );

            return NextResponse.json({ accessToken });
        } catch (e) {
            return NextResponse.json({ message: 'Invalid refresh token' }, { status: 401 });
        }
    }

    if (route === 'logout') {
        const response = NextResponse.json({ message: 'Logged out' });
        response.cookies.set('refreshToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
            path: '/',
        });
        return response;
    }

    if (route === 'forgot-password') {
        const { email } = body;
        const user = await User.findOne({ email });
        // Always return 200 security best practice
        return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Not found' }, { status: 404 });
}
