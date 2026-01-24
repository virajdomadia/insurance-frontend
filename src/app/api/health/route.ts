import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
    try {
        await connectDB();

        return NextResponse.json(
            {
                status: 'ok',
                message: 'API is healthy',
                database: 'connected',
                timestamp: new Date().toISOString(),
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Health check error:', error);
        return NextResponse.json(
            {
                status: 'error',
                message: 'Database connection failed',
                database: 'disconnected',
                timestamp: new Date().toISOString(),
            },
            { status: 500 }
        );
    }
}
