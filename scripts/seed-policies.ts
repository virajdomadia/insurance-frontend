import mongoose from 'mongoose';
import User from '../src/models/User';
import Policy, { PolicyStatus } from '../src/models/Policy';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://virajdomadia6:Viraj0610@cluster0.wti2c.mongodb.net/InsuranceApp?retryWrites=true&w=majority&appName=Cluster0';

async function seedPolicies() {
    try {
        console.log('🌱 Starting policy seed...');

        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find Admin user to assign policies to
        const admin = await User.findOne({ email: 'admin@insurance.com' });
        if (!admin) {
            console.error('❌ Admin user not found. Please run valid seed first.');
            process.exit(1);
        }

        console.log(`👤 Found Admin user: ${admin._id}`);

        // Create sample policies
        const policies = [
            {
                userId: admin._id,
                policyType: 'Health Insurance',
                coverage: 500000,
                premium: 12000,
                status: PolicyStatus.ACTIVE,
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            },
            {
                userId: admin._id,
                policyType: 'Life Insurance',
                coverage: 10000000,
                premium: 25000,
                status: PolicyStatus.ACTIVE,
                startDate: new Date(),
                endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 20)),
            },
            {
                userId: admin._id,
                policyType: 'Crop Insurance',
                coverage: 200000,
                premium: 5000,
                status: PolicyStatus.PENDING,
                startDate: new Date(),
                endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)),
            },
            {
                userId: admin._id,
                policyType: 'Vehicle Insurance',
                coverage: 800000,
                premium: 15000,
                status: PolicyStatus.EXPIRED,
                startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
                endDate: new Date(),
            }
        ];

        await Policy.insertMany(policies);
        console.log(`✅ Successfully added ${policies.length} policies.`);

        // Verify count
        const count = await Policy.countDocuments();
        console.log(`📊 Total Policies in DB: ${count}`);

        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB');
    } catch (error) {
        console.error('❌ Seed error:', error);
        process.exit(1);
    }
}

seedPolicies();
