
import mongoose from 'mongoose';
import connectDB from './src/lib/mongodb';
import User from './src/models/User';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function checkUser() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const email = 'admin@example.com';
        // case insensitive search to match route logic
        const user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            console.log('✅ User found:', user.email, 'Role:', user.role);
        } else {
            console.log('❌ User NOT found:', email);
        }
    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkUser();
