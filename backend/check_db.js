import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const users = await User.find({}).sort({ createdAt: -1 }).limit(5);
        console.log('Latest 5 users:');
        users.forEach(u => {
            console.log(`Email: ${u.email}, Verified: ${u.verified}, Token: ${u.verificationToken ? 'exists' : 'null'}, TokenExpires: ${u.verificationTokenExpires}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
