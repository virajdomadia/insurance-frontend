import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Beneficiary from '@/models/Beneficiary';
import { requireAuth, requireNGOOrAdmin } from '@/middleware/auth';
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

        // If NGO, only show their beneficiaries
        let query = {};
        if (user.role === UserRole.NGO) {
            query = { ngoId: user.sub };
        }

        const beneficiaries = await Beneficiary.find(query).sort({ createdAt: -1 });

        const formattedBeneficiaries = beneficiaries.map((b) => ({
            id: b._id.toString(),
            name: b.name,
            age: b.age,
            income: b.income,
            bplStatus: b.bplStatus,
            ngoId: b.ngoId,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt,
        }));

        return NextResponse.json(formattedBeneficiaries, { status: 200 });
    } catch (error) {
        console.error('Get beneficiaries error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to fetch beneficiaries' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        // Verify NGO or Admin access
        const authResult = requireNGOOrAdmin(request);
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { user } = authResult;
        const body = await request.json();
        const { name, age, income, bplStatus } = body;

        // Validation
        if (!name || age === undefined || income === undefined || bplStatus === undefined) {
            return NextResponse.json(
                { error: 'Bad Request', message: 'name, age, income, and bplStatus are required' },
                { status: 400 }
            );
        }

        // Create beneficiary
        const beneficiary = await Beneficiary.create({
            name,
            age,
            income,
            bplStatus,
            ngoId: user.role === UserRole.NGO ? user.sub : undefined,
        });

        return NextResponse.json(
            {
                id: beneficiary._id.toString(),
                name: beneficiary.name,
                age: beneficiary.age,
                income: beneficiary.income,
                bplStatus: beneficiary.bplStatus,
                ngoId: beneficiary.ngoId,
                createdAt: beneficiary.createdAt,
                updatedAt: beneficiary.updatedAt,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create beneficiary error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to create beneficiary' },
            { status: 500 }
        );
    }
}
