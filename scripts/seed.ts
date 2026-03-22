import mongoose from 'mongoose';
import User, { UserRole } from '../src/models/User';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/dummy";

async function main() {
    console.log('Connecting to database...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    console.log('Clearing database... (removing all users)');
    await User.deleteMany({});
    console.log('Database cleared.');

    console.log('Seeding initial admin user...');
    
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    await User.create({
        name: 'Platform Admin',
        email: 'admin@apnapolicy.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
        isVerified: true
    });
    
    console.log('Seeded admin user: admin@apnapolicy.com / Admin@123');

    console.log('Seed completed successfully.');
    await mongoose.disconnect();
}

main().catch(console.error);
