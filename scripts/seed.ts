import mongoose from 'mongoose';
import { hashPassword } from '../src/lib/auth';
import User, { UserRole } from '../src/models/User';
import Beneficiary from '../src/models/Beneficiary';
import Claim, { ClaimStatus } from '../src/models/Claim';
import Policy, { PolicyStatus } from '../src/models/Policy';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://virajdomadia6:Viraj0610@cluster0.wti2c.mongodb.net/InsuranceApp?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
    try {
        console.log('🌱 Starting database seed...');

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Beneficiary.deleteMany({});
        await Claim.deleteMany({});
        await Policy.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create users
        const adminPassword = await hashPassword('admin123');

        const admin = await User.create({
            email: 'admin@insurance.com',
            passwordHash: adminPassword,
            role: UserRole.ADMIN,
            isActive: true,
        });

        console.log('👥 Created Admin user:');
        console.log('   Admin: admin@insurance.com / admin123');

        console.log('✅ Database cleaned and initialized with Admin user only.');
        console.log('\n📝 Login credentials:');
        console.log('   Admin: admin@insurance.com / admin123');

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
