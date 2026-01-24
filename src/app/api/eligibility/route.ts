import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { age, income, bplStatus } = body;

        // Validation
        if (age === undefined || income === undefined || bplStatus === undefined) {
            return NextResponse.json(
                { error: 'Bad Request', message: 'age, income, and bplStatus are required' },
                { status: 400 }
            );
        }

        // Eligibility criteria
        const eligiblePolicies = [];

        // BPL Card Holders - Eligible for government schemes
        if (bplStatus) {
            eligiblePolicies.push({
                name: 'Ayushman Bharat (PM-JAY)',
                coverage: 500000,
                premium: 0,
                description: 'Free health insurance for BPL families',
            });
            eligiblePolicies.push({
                name: 'Pradhan Mantri Suraksha Bima Yojana',
                coverage: 200000,
                premium: 12,
                description: 'Accident insurance for BPL families',
            });
        }

        // Low income - Eligible for subsidized schemes
        if (income < 100000) {
            eligiblePolicies.push({
                name: 'Aam Aadmi Bima Yojana',
                coverage: 30000,
                premium: 200,
                description: 'Life insurance for low-income families',
            });
        }

        // Senior citizens
        if (age >= 60) {
            eligiblePolicies.push({
                name: 'Senior Citizen Health Insurance',
                coverage: 300000,
                premium: 5000,
                description: 'Health insurance for senior citizens',
            });
        }

        // General eligibility
        if (age >= 18 && age <= 65) {
            eligiblePolicies.push({
                name: 'Basic Health Insurance',
                coverage: 200000,
                premium: 3000,
                description: 'Basic health coverage for all adults',
            });
        }

        // Children
        if (age < 18) {
            eligiblePolicies.push({
                name: 'Child Health Insurance',
                coverage: 100000,
                premium: 1000,
                description: 'Health coverage for children',
            });
        }

        return NextResponse.json(
            {
                eligible: eligiblePolicies.length > 0,
                policies: eligiblePolicies,
                criteria: {
                    age,
                    income,
                    bplStatus,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Check eligibility error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to check eligibility' },
            { status: 500 }
        );
    }
}
