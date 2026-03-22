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

    if (!tokenPayload) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const isAdmin = tokenPayload.role === 'ADMIN';
        const filter: any = isAdmin ? {} : { userId: tokenPayload.sub };

        const policies = await Policy.find(filter).lean();
        const now = new Date();

        // Core KPIs
        const totalPolicies = policies.length;
        const activePolicies = policies.filter((p: any) => p.status === 'Active').length;
        const expiredPolicies = policies.filter((p: any) => p.status === 'Expired' || new Date(p.endDate) < now).length;
        const lapsedPolicies = policies.filter((p: any) => p.status === 'Lapsed').length;

        const totalCoverage = policies.reduce((sum: number, p: any) => sum + (p.coverageAmount || 0), 0);
        const totalPremium = policies.reduce((sum: number, p: any) => sum + (p.premiumAmount || 0), 0);

        // Policy type breakdown
        const typeBreakdown: Record<string, number> = {};
        policies.forEach((p: any) => {
            const t = p.policyType || 'other';
            typeBreakdown[t] = (typeBreakdown[t] || 0) + 1;
        });

        // Upcoming renewals (within next 30 days)
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const upcomingRenewals = policies.filter((p: any) => {
            const end = new Date(p.endDate);
            return end >= now && end <= thirtyDaysFromNow;
        }).length;

        // Recent policies (last 5)
        const recentPolicies = policies
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((p: any) => ({
                _id: p._id,
                policyNumber: p.policyNumber,
                provider: p.provider,
                policyType: p.policyType,
                coverageAmount: p.coverageAmount,
                premiumAmount: p.premiumAmount,
                status: p.status,
                endDate: p.endDate,
            }));

        // Monthly trend (policies created per month, last 6 months)
        const monthlyTrend: { month: string; count: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
            const count = policies.filter((p: any) => {
                const created = new Date(p.createdAt);
                return created >= d && created <= monthEnd;
            }).length;
            monthlyTrend.push({
                month: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
                count,
            });
        }

        // Admin-only stats
        let adminStats = null;
        if (isAdmin) {
            const totalUsers = await User.countDocuments();
            const totalCitizens = await User.countDocuments({ role: { $in: ['citizen', 'CITIZEN', 'USER'] } });

            // Top providers
            const providerMap: Record<string, number> = {};
            policies.forEach((p: any) => {
                providerMap[p.provider] = (providerMap[p.provider] || 0) + 1;
            });
            const topProviders = Object.entries(providerMap)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([provider, count]) => ({ provider, count }));

            adminStats = {
                totalUsers,
                totalCitizens,
                topProviders,
            };
        }

        return NextResponse.json({
            totalPolicies,
            activePolicies,
            expiredPolicies,
            lapsedPolicies,
            totalCoverage,
            totalPremium,
            typeBreakdown,
            upcomingRenewals,
            recentPolicies,
            monthlyTrend,
            adminStats,
            isAdmin,
        });
    } catch (error: any) {
        return NextResponse.json({ message: error.message || 'Server Error' }, { status: 500 });
    }
}
