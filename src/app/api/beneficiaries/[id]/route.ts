import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Beneficiary from '@/models/Beneficiary';
import { requireAuth } from '@/middleware/auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        // Verify authentication
        const authResult = requireAuth(request);
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { id } = await params;

        const beneficiary = await Beneficiary.findById(id);

        if (!beneficiary) {
            return NextResponse.json({ error: 'Not Found', message: 'Beneficiary not found' }, { status: 404 });
        }

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
            { status: 200 }
        );
    } catch (error) {
        console.error('Get beneficiary error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to fetch beneficiary' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        // Verify authentication
        const authResult = requireAuth(request);
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { id } = await params;
        const body = await request.json();

        const beneficiary = await Beneficiary.findByIdAndUpdate(id, body, { new: true, runValidators: true });

        if (!beneficiary) {
            return NextResponse.json({ error: 'Not Found', message: 'Beneficiary not found' }, { status: 404 });
        }

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
            { status: 200 }
        );
    } catch (error) {
        console.error('Update beneficiary error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to update beneficiary' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        // Verify authentication
        const authResult = requireAuth(request);
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        const { id } = await params;

        const beneficiary = await Beneficiary.findByIdAndDelete(id);

        if (!beneficiary) {
            return NextResponse.json({ error: 'Not Found', message: 'Beneficiary not found' }, { status: 404 });
        }

        return NextResponse.json({ ok: true, message: 'Beneficiary deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete beneficiary error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to delete beneficiary' },
            { status: 500 }
        );
    }
}
