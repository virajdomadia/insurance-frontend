import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Policy from '@/models/Policy';
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

        const user = authResult.user;
        let query = {};

        // Role-based filtering
        if (user.role === UserRole.CITIZEN) {
            // Citizens only see their own policies
            query = { userId: user.userId };
        } else if (user.role === UserRole.NGO) {
            // NGOs see policies related to their beneficiaries? 
            // For now, let's say NGOs can't see policies directly unless we link them better.
            // Or maybe they see all? Let's restrict to own or just return empty for now if no specific logic.
            // Actually, NGOs might want to see policies of people they helped.
            // But policies are linked to User.
            // Let's keep it simple: CITIZEN sees own, ADMIN sees all.
            query = {};
        }

        // If admin, show all (query remains empty)

        const policies = await Policy.find(query).sort({ createdAt: -1 });

        return NextResponse.json(policies, { status: 200 });
    } catch (error) {
        console.error('Get policies error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to fetch policies' },
            { status: 500 }
        );
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

        const user = authResult.user;
        const body = await request.json();

        // Validate required fields
        const { policyType, coverage, premium, startDate, endDate } = body;

        if (!policyType || !coverage || !premium || !startDate || !endDate) {
            return NextResponse.json(
                { error: 'Validation Error', message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create policy
        // If admin, can create for anyone (userId in body). 
        // If citizen, create for self.

        let targetUserId = user.userId;
        if (user.role === UserRole.ADMIN && body.userId) {
            targetUserId = body.userId;
        }

        const policy = await Policy.create({
            userId: targetUserId,
            policyType,
            coverage,
            premium,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            status: 'PENDING', // Default status
        });

        return NextResponse.json(policy, { status: 201 });
    } catch (error) {
        console.error('Create policy error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to create policy' },
            { status: 500 }
        );
    }
}
