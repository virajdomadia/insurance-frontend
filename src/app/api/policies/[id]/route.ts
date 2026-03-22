import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectToDatabase from '@/lib/mongodb';
import Policy from '@/models/Policy';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Helper to authenticate request
async function authenticate(req: Request) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { error: 'Missing or invalid authorization header', status: 401 };
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return { user: decoded };
} catch (error) {
        return { error: 'Invalid or expired token', status: 401 };
    }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await authenticate(req);
        if (auth.error) {
            return NextResponse.json({ message: auth.error }, { status: auth.status });
        }

        const tokenPayload = auth.user;
        const resolvedParams = await params;
        const policyId = resolvedParams.id;

        if (!mongoose.Types.ObjectId.isValid(policyId)) {
            return NextResponse.json({ message: 'Invalid Policy ID' }, { status: 400 });
        }

        await connectToDatabase();

        const policy = await Policy.findById(policyId);
        if (!policy) {
            return NextResponse.json({ message: 'Policy not found' }, { status: 404 });
        }

        // Authorization Check
        if (policy.userId.toString() !== tokenPayload.sub && tokenPayload.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Unauthorized access' }, { status: 403 });
        }

        return NextResponse.json({ policy }, { status: 200 });
    } catch (error: any) {
        console.error('Fetch policy error:', error);
        return NextResponse.json(
            { message: 'Failed to fetch policy', error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await authenticate(req);
        if (auth.error) {
            return NextResponse.json({ message: auth.error }, { status: auth.status });
        }

        const tokenPayload = auth.user;
        const resolvedParams = await params;
        const policyId = resolvedParams.id;

        if (!mongoose.Types.ObjectId.isValid(policyId)) {
            return NextResponse.json({ message: 'Invalid Policy ID' }, { status: 400 });
        }

        await connectToDatabase();

        const policy = await Policy.findById(policyId);
        if (!policy) {
            return NextResponse.json({ message: 'Policy not found' }, { status: 404 });
        }

        // Authorization Check
        if (policy.userId.toString() !== tokenPayload.sub && tokenPayload.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Unauthorized to edit this policy' }, { status: 403 });
        }

        // Update fields if provided
        const body = await req.json();
        
        if (body.policyType) policy.policyType = body.policyType;
        if (body.policyNumber) policy.policyNumber = body.policyNumber;
        if (body.provider) policy.provider = body.provider;
        if (body.premiumAmount !== undefined) policy.premiumAmount = Number(body.premiumAmount);
        if (body.coverageAmount !== undefined) policy.coverageAmount = Number(body.coverageAmount);
        if (body.startDate) policy.startDate = new Date(body.startDate);
        if (body.endDate) policy.endDate = new Date(body.endDate);

        await policy.save();

        return NextResponse.json({ message: 'Policy updated successfully', policy }, { status: 200 });
    } catch (error: any) {
        console.error('Update policy error:', error);
        return NextResponse.json(
            { message: 'Failed to update policy', error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const auth = await authenticate(req);
        if (auth.error) {
            return NextResponse.json({ message: auth.error }, { status: auth.status });
        }

        const tokenPayload = auth.user;
        const resolvedParams = await params;
        const policyId = resolvedParams.id;

        if (!mongoose.Types.ObjectId.isValid(policyId)) {
            return NextResponse.json({ message: 'Invalid Policy ID' }, { status: 400 });
        }

        await connectToDatabase();

        const policy = await Policy.findById(policyId);
        if (!policy) {
            return NextResponse.json({ message: 'Policy not found' }, { status: 404 });
        }

        // Authorization Check
        if (policy.userId.toString() !== tokenPayload.sub && tokenPayload.role !== 'ADMIN') {
            return NextResponse.json({ message: 'Unauthorized to delete this policy' }, { status: 403 });
        }

        await Policy.findByIdAndDelete(policyId);

        return NextResponse.json({ message: 'Policy deleted successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Delete policy error:', error);
        return NextResponse.json(
            { message: 'Failed to delete policy', error: error.message },
            { status: 500 }
        );
    }
}
