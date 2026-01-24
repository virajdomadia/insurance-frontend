import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Check if environment variables are loaded
        const mongoUri = process.env.MONGODB_URI;
        const jwtSecret = process.env.JWT_SECRET;

        return NextResponse.json(
            {
                status: 'ok',
                message: 'API is working',
                env: {
                    mongoUriExists: !!mongoUri,
                    jwtSecretExists: !!jwtSecret,
                    nodeEnv: process.env.NODE_ENV,
                },
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Test error:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: error.message || 'Unknown error',
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}
