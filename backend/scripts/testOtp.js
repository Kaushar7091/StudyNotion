require('dotenv').config();
const mongoose = require('mongoose');
const OTP = require('../models/OTP');

async function testOtp() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to DB');
        
        console.log('Creating OTP...');
        const otpBody = await OTP.create({
            email: 'test@example.com',
            otp: '123456'
        });
        console.log('OTP created:', otpBody);
        
        await mongoose.disconnect();
    } catch(err) {
        console.error('Error:', err);
    }
}

testOtp();
