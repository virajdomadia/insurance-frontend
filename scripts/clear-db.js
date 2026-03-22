const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const URI = process.env.MONGODB_URI;

if (!URI) {
    console.error('Error: MONGODB_URI not found in env files.');
    process.exit(1);
}

async function clearDB() {
    try {
        await mongoose.connect(URI);
        console.log('Connected to MongoDB @', URI.split('@')[1] || URI);
        
        const db = mongoose.connection.db;
        
        try { await db.collection('users').deleteMany({}); console.log('Cleared users'); } catch(e){}
        try { await db.collection('policies').deleteMany({}); console.log('Cleared policies'); } catch(e){}
        
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        await db.collection('users').insertOne({
            name: 'System Admin',
            email: 'admin@apnapolicy.com',
            password: hashedPassword,
            role: 'ADMIN',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('Successfully re-created Admin user: admin@apnapolicy.com');
        
        console.log('Database cleared successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

clearDB();
