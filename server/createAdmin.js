const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');

        // Check if admin already exists
        const exists = await User.findOne({ email: 'admin@ucab.com' });
        if (exists) {
            console.log('Admin already exists!');
            console.log('Email: admin@ucab.com');
            console.log('Password: admin@123');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('admin@123', 10);
        await User.create({
            name: 'Ucab Admin',
            email: 'admin@ucab.com',
            password: hashedPassword,
            phone: '9999999999',
            role: 'admin'
        });

        console.log('============================');
        console.log(' Admin account created!');
        console.log('============================');
        console.log(' Email   : admin@ucab.com');
        console.log(' Password: admin@123');
        console.log('============================');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

createAdmin();
