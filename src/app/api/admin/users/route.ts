import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/mongodb';
import Policy from '@/models/Policy';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'mock_secret_key_for_testing_purposes_only';

const verifyAuth = (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
        return jwt.verify(authHeader.split(' ')[1], JWT_SECRET) as any;
    } catch { return null; }
};

export async function GET(req: NextRequest) {
    await connectDB();
    const tokenPayload = verifyAuth(req);

    if (!tokenPayload || tokenPayload.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    try {
        // Fetch all users (we can exclude passwords for security)
        const users = await User.find({}, { password: 0 }).lean() as any[];
        
        // Fetch all policies
        const policies = await Policy.find({}).lean();

        // Group policies by user
        const usersWithPolicies = users.map(user => {
            const userPolicies = policies.filter(p => p.userId.toString() === user._id.toString());
            return {
                ...user,
                policies: userPolicies,
                totalCoverage: userPolicies.reduce((sum, p) => sum + (p.coverageAmount || 0), 0),
                totalPremium: userPolicies.reduce((sum, p) => sum + (p.premiumAmount || 0), 0)
            };
        });

        // Optionally, sort by role (Admins first) or by name/email
        usersWithPolicies.sort((a, b) => {
            if (a.role === 'ADMIN' && b.role !== 'ADMIN') return -1;
            if (a.role !== 'ADMIN' && b.role === 'ADMIN') return 1;
            return a.email.localeCompare(b.email);
        });

        return NextResponse.json({ users: usersWithPolicies }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}
