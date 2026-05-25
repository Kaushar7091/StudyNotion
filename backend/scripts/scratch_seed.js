require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to Database successfully.');

    const categories = await Category.find({});
    console.log('Current categories in database:', categories);

    if (categories.length === 0) {
      console.log('No categories found. Seeding default categories...');
      const defaultCategories = [
        { name: 'Web Development', description: 'Learn HTML, CSS, JavaScript, React, Node.js, and more.' },
        { name: 'Data Science', description: 'Learn Python, Machine Learning, Data Analysis, and SQL.' },
        { name: 'Cybersecurity', description: 'Learn ethical hacking, network security, and cryptography.' },
        { name: 'Mobile App Development', description: 'Learn Flutter, React Native, Swift, and Android.' }
      ];

      await Category.insertMany(defaultCategories);
      console.log('Default categories seeded successfully!');
      console.log('New categories list:', await Category.find({}));
    } else {
      console.log('Database already has categories. No seeding required.');
    }

    await mongoose.disconnect();
    console.log('Disconnected from Database.');
  } catch (error) {
    console.error('Error during seeding:', error);
  }
}

seedCategories();
