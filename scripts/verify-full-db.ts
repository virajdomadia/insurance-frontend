
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Import models
// Note: We need to use dynamic imports or require because the models might rely on 'mongoose' 
// being connected or configured globally in some patterns, though here we'll just test standard mongoose usage.
// Assuming models extract from the standard 'src/models'
import User from '../src/models/User';
import Policy from '../src/models/Policy';
import Claim from '../src/models/Claim';
import Beneficiary from '../src/models/Beneficiary';
import EligibilityCheck from '../src/models/EligibilityCheck';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

async function verifyDB() {
    console.log('🔍 Starting Database Verification...');
    console.log(`📡 Connecting to MongoDB...`);

    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('✅ MongoDB Connected Successfully!');

        if (mongoose.connection.db) {
            const collections = await mongoose.connection.db.collections();
            console.log(`📂 Found ${collections.length} collections in the database.`);
            collections.forEach(c => console.log(`   - ${c.collectionName}`));
        }

        // 1. Verify Users
        console.log('\n👤 Verifying Users Collection...');
        const userCount = await User.countDocuments();
        console.log(`   Found ${userCount} users.`);
        if (userCount > 0) {
            const sampleUser = await User.findOne();
            console.log('   Sample User:', JSON.stringify(sampleUser, null, 2));
        } else {
            console.warn('   ⚠️ No users found. You might need to seed the database.');
        }

        // 2. Verify Policies
        console.log('\n📜 Verifying Policies Collection...');
        const policyCount = await Policy.countDocuments();
        console.log(`   Found ${policyCount} policies.`);

        // 3. Verify Claims
        console.log('\n🏥 Verifying Claims Collection...');
        const claimCount = await Claim.countDocuments();
        console.log(`   Found ${claimCount} claims.`);

        // 4. Verify Beneficiaries
        console.log('\n👨‍👩‍👧 Verifying Beneficiaries Collection...');
        const beneficiaryCount = await Beneficiary.countDocuments();
        console.log(`   Found ${beneficiaryCount} beneficiaries.`);

        console.log('\n✅ Database Verification Complete. System appears healthy.');

    } catch (error) {
        console.error('❌ Database Verification Failed:', error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log('👋 Disconnected from MongoDB.');
    }
}

verifyDB();
