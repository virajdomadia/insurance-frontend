import mongoose from 'mongoose';

// Hardcoded for testing only - derived from .env.local view
const uri = "mongodb+srv://virajdomadia6:Viraj0610@cluster0.wti2c.mongodb.net/InsuranceApp?retryWrites=true&w=majority&appName=Cluster0";

console.log('Testing connection...');

async function testConnection() {
    try {
        await mongoose.connect(uri);
        console.log('✅ MongoDB connected successfully!');
        const collections = await mongoose.connection.db?.collections();
        console.log('Collections:', collections?.map(c => c.collectionName));
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Connection failed:', error);
    }
}

testConnection();
