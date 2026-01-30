import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User, { UserRole } from '@/models/User';
import Beneficiary from '@/models/Beneficiary';
import Claim, { ClaimStatus } from '@/models/Claim';
import Policy from '@/models/Policy';
import { requireAdmin } from '@/middleware/auth';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Verify admin access
        const authResult = requireAdmin(request);
        if ('error' in authResult) {
            return NextResponse.json({ error: authResult.error }, { status: authResult.status });
        }

        // Get statistics
        const totalUsers = await User.countDocuments();
        const totalCitizens = await User.countDocuments({ role: UserRole.CITIZEN });
        const totalNGOs = await User.countDocuments({ role: UserRole.NGO });
        const totalBeneficiaries = await Beneficiary.countDocuments();
        const totalClaims = await Claim.countDocuments();
        const pendingClaims = await Claim.countDocuments({ status: ClaimStatus.PENDING });
        const approvedClaims = await Claim.countDocuments({ status: ClaimStatus.APPROVED });
        const rejectedClaims = await Claim.countDocuments({ status: ClaimStatus.REJECTED });
        const totalPolicies = await Policy.countDocuments();

        // Calculate total claim amount
        // Calculate total claim amount
        const claimAggregation = await Claim.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                },
            },
        ]);

        const totalClaimAmount = claimAggregation.length > 0 ? claimAggregation[0].totalAmount : 0;

        // Aggregation: Coverage by District (Beneficiaries)
        const coverageByDistrictRaw = await Beneficiary.aggregate([
            {
                $group: {
                    _id: '$district',
                    families: { $sum: 1 },
                },
            },
            { $sort: { families: -1 } },
            { $limit: 5 } // Top 5 districts
        ]);

        const coverageByDistrict = coverageByDistrictRaw.map(item => ({
            district: item._id || 'Unknown',
            families: item.families
        }));

        // Aggregation: Claims Trend (Monthly)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start of the month

        const claimsTrendRaw = await Claim.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    claims: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Format claims trend for frontend (Month Name)
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const claimsTrend = claimsTrendRaw.map(item => ({
            month: monthNames[item._id.month - 1],
            claims: item.claims
        }));

        return NextResponse.json(
            {
                users: {
                    total: totalUsers,
                    citizens: totalCitizens,
                    ngos: totalNGOs,
                },
                beneficiaries: totalBeneficiaries,
                claims: {
                    total: totalClaims,
                    pending: pendingClaims,
                    approved: approvedClaims,
                    rejected: rejectedClaims,
                    totalAmount: totalClaimAmount,
                },
                policies: totalPolicies,
                coverage: coverageByDistrict,
                trends: claimsTrend,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get admin stats error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}
