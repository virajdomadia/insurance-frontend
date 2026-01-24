import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Claim from '@/models/Claim';
import { requireAuth, requireAdmin } from '@/middleware/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        // Verify authentication
        const authResult = requireAuth(request);
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { id } = await params;

        const claim = await Claim.findById(id).populate('beneficiaryId', 'name age');

        if (!claim) {
            return NextResponse.json({ error: 'Not Found', message: 'Claim not found' }, { status: 404 });
        }

        return NextResponse.json(
            {
                id: claim._id.toString(),
                beneficiaryId: claim.beneficiaryId,
                userId: claim.userId,
                policyType: claim.policyType,
                amount: claim.amount,
                status: claim.status,
                description: claim.description,
                documents: claim.documents,
                createdAt: claim.createdAt,
                updatedAt: claim.updatedAt,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get claim error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: 'Failed to fetch claim' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        // Only admin can update claim status
        const authResult = requireAdmin(request);
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { id } = await params;
        const body = await request.json();

        const claim = await Claim.findByIdAndUpdate(id, body, { new: true, runValidators: true });

        if (!claim) {
            return NextResponse.json({ error: 'Not Found', message: 'Claim not found' }, { status: 404 });
        }

        return NextResponse.json(
            {
                id: claim._id.toString(),
                beneficiaryId: claim.beneficiaryId,
                userId: claim.userId,
                policyType: claim.policyType,
                amount: claim.amount,
                status: claim.status,
                description: claim.description,
                documents: claim.documents,
                createdAt: claim.createdAt,
                updatedAt: claim.updatedAt,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Update claim error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: 'Failed to update claim' }, { status: 500 });
    }
}
