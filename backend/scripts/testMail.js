require('dotenv').config();
const mailSender = require('../utils/mailSender');

async function testMail() {
    try {
        console.log('Sending mail...');
        const response = await mailSender('test@example.com', 'Test Email', '<p>Test body</p>');
        console.log('Response:', response);
    } catch(err) {
        console.error('Error:', err);
    }
}

testMail();
