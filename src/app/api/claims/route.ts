import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Claim, { ClaimStatus } from '@/models/Claim';
import { requireAuth } from '@/middleware/auth';
import { UserRole } from '@/models/User';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Verify authentication
        const authResult = requireAuth(request);
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { user } = authResult;

        // If citizen, only show their claims
        let query = {};
        if (user.role === UserRole.CITIZEN) {
            query = { userId: user.sub };
        }

        const claims = await Claim.find(query).sort({ createdAt: -1 }).populate('beneficiaryId', 'name age');

        const formattedClaims = claims.map((c) => ({
            id: c._id.toString(),
            beneficiaryId: c.beneficiaryId,
            userId: c.userId,
            policyType: c.policyType,
            amount: c.amount,
            status: c.status,
            description: c.description,
            documents: c.documents,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
        }));

        return NextResponse.json(formattedClaims, { status: 200 });
    } catch (error) {
        console.error('Get claims error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: 'Failed to fetch claims' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Verify authentication
        const authResult = requireAuth(request);
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { user } = authResult;
        const body = await request.json();
        const { beneficiaryId, policyType, amount, description, documents } = body;

        // Validation
        if (!policyType || amount === undefined) {
            return NextResponse.json(
                { error: 'Bad Request', message: 'policyType and amount are required' },
                { status: 400 }
            );
        }

        // Create claim
        const claim = await Claim.create({
            beneficiaryId: beneficiaryId || undefined,
            userId: user.sub,
            policyType,
            amount,
            status: ClaimStatus.PENDING,
            description,
            documents: documents || [],
        });

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
            { status: 201 }
        );
    } catch (error) {
        console.error('Create claim error:', error);
        return NextResponse.json({ error: 'Internal Server Error', message: 'Failed to create claim' }, { status: 500 });
    }
}
