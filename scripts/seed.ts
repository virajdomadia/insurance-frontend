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
        const ngoPassword = await hashPassword('ngo123');
        const citizenPassword = await hashPassword('citizen123');

        const admin = await User.create({
            email: 'admin@insurance.com',
            passwordHash: adminPassword,
            role: UserRole.ADMIN,
            isActive: true,
        });

        const ngo = await User.create({
            email: 'ngo@example.com',
            passwordHash: ngoPassword,
            role: UserRole.NGO,
            isActive: true,
        });

        const citizen = await User.create({
            email: 'citizen@example.com',
            passwordHash: citizenPassword,
            role: UserRole.CITIZEN,
            isActive: true,
        });

        console.log('👥 Created users:');
        console.log('   Admin: admin@insurance.com / admin123');
        console.log('   NGO: ngo@example.com / ngo123');
        console.log('   Citizen: citizen@example.com / citizen123');

        // Create beneficiaries
        const beneficiary1 = await Beneficiary.create({
            name: 'Rajesh Kumar',
            age: 45,
            income: 50000,
            bplStatus: true,
            ngoId: ngo._id.toString(),
        });

        const beneficiary2 = await Beneficiary.create({
            name: 'Priya Sharma',
            age: 32,
            income: 75000,
            bplStatus: false,
            ngoId: ngo._id.toString(),
        });

        const beneficiary3 = await Beneficiary.create({
            name: 'Amit Patel',
            age: 65,
            income: 30000,
            bplStatus: true,
            ngoId: ngo._id.toString(),
        });

        console.log('👤 Created 3 beneficiaries');

        // Create policies
        await Policy.create({
            userId: citizen._id.toString(),
            policyType: 'Ayushman Bharat',
            coverage: 500000,
            premium: 0,
            status: PolicyStatus.ACTIVE,
            startDate: new Date('2024-01-01'),
            endDate: new Date('2025-12-31'),
        });

        await Policy.create({
            userId: citizen._id.toString(),
            policyType: 'Basic Health Insurance',
            coverage: 200000,
            premium: 3000,
            status: PolicyStatus.ACTIVE,
            startDate: new Date('2024-06-01'),
            endDate: new Date('2025-05-31'),
        });

        console.log('📋 Created 2 policies');

        // Create claims
        await Claim.create({
            beneficiaryId: beneficiary1._id.toString(),
            userId: ngo._id.toString(),
            policyType: 'Ayushman Bharat',
            amount: 25000,
            status: ClaimStatus.PENDING,
            description: 'Medical treatment for heart condition',
            documents: [],
        });

        await Claim.create({
            beneficiaryId: beneficiary2._id.toString(),
            userId: ngo._id.toString(),
            policyType: 'Basic Health Insurance',
            amount: 15000,
            status: ClaimStatus.APPROVED,
            description: 'Surgery expenses',
            documents: [],
        });

        await Claim.create({
            userId: citizen._id.toString(),
            policyType: 'Basic Health Insurance',
            amount: 10000,
            status: ClaimStatus.PROCESSING,
            description: 'Hospitalization expenses',
            documents: [],
        });

        console.log('💰 Created 3 claims');

        console.log('✅ Database seeded successfully!');
        console.log('\n📝 Login credentials:');
        console.log('   Admin: admin@insurance.com / admin123');
        console.log('   NGO: ngo@example.com / ngo123');
        console.log('   Citizen: citizen@example.com / citizen123');

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seed();
