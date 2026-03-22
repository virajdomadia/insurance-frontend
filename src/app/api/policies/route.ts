import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Policy from '@/models/Policy';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'mock_secret_key_for_testing_purposes_only';

// Helper to verify auth and return token payload
const verifyAuth = (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.split(' ')[1];
    try {
        return jwt.verify(token, JWT_SECRET) as any;
    } catch (e) {
        return null;
    }
};

export async function POST(req: NextRequest) {
    await connectDB();
    const tokenPayload = verifyAuth(req);

    if (!tokenPayload) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const {
            citizenEmailOrId, // from form, only used if Admin
            policyType,
            policyNumber,
            provider,
            premiumAmount,
            coverageAmount,
            startDate,
            endDate,
        } = body;

        let targetUserId = tokenPayload.sub;

        // If the user is an admin, they can specify an email to attach the policy to
        if (tokenPayload.role === 'ADMIN' && citizenEmailOrId) {
            // Find that user
            const targetUser = await User.findOne({ email: citizenEmailOrId });
            if (!targetUser) {
                return NextResponse.json({ message: 'Target citizen not found' }, { status: 404 });
            }
            targetUserId = targetUser._id;
        }

        const newPolicy = await Policy.create({
            userId: targetUserId,
            policyType,
            policyNumber,
            provider,
            premiumAmount: Number(premiumAmount),
            coverageAmount: Number(coverageAmount),
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: 'Active'
        });

        return NextResponse.json({ message: 'Policy added successfully', policy: newPolicy }, { status: 201 });
    } catch (error: any) {
        // Handle mongoose duplicate key error specifically
        if (error.code === 11000) {
           return NextResponse.json({ message: 'Policy number already exists' }, { status: 400 });
        }
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    await connectDB();
    const tokenPayload = verifyAuth(req);

    if (!tokenPayload) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // If user is Admin, they could potentially fetch all policies or query by email.
        // For standard users, explicitly lock down the query to limit to their ID.
        let filter: any = {};
        
        if (tokenPayload.role !== 'ADMIN') {
            filter.userId = tokenPayload.sub;
        }

        const policies = await Policy.find(filter).sort({ createdAt: -1 });

        return NextResponse.json({ policies }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}
