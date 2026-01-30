
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is missing from .env.local');
    process.exit(1);
}

console.log(`Connecting to ${MONGODB_URI}...`);

mongoose.connect(MONGODB_URI, { bufferCommands: false })
    .then(() => {
        console.log('✅ Connected to MongoDB successfully!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    });
