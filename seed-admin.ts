
import mongoose from 'mongoose';
import User, { UserRole } from './src/models/User';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

async function seedAdmin() {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI missing');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const email = 'admin@example.com';
        const existing = await User.findOne({ email });
        if (existing) {
            console.log('Admin user already exists');
        } else {
            const passwordHash = await bcrypt.hash('admin123', 10);
            await User.create({
                email,
                passwordHash,
                role: UserRole.ADMIN,
                name: 'Admin User',
                isActive: true
            });
            console.log('Admin user created');
        }
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

seedAdmin();
