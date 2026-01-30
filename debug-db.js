const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('❌ MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

console.log('Testing connection to:', uri.replace(/:([^:@]{1,})@/, ':****@')); // Hide password

async function testConnection() {
    try {
        await mongoose.connect(uri);
        console.log('✅ MongoDB connected successfully!');
        // List collections to ensure we can read
        const collections = await mongoose.connection.db.collections();
        console.log('Collections:', collections.map(c => c.collectionName));
        await mongoose.disconnect();
    } catch (error) {
        console.error('❌ Connection failed:', error);
    }
}

testConnection();
