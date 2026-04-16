const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/medical_app';

const seedUser = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Delete existing users to avoid duplication
    await User.deleteMany({ phoneNumber: { $in: ['970456241', '970456123', 'guest123'] } });

    const salt = await bcrypt.genSalt(10);
    const pass123Hashed = await bcrypt.hash('pass123', salt);
    const guest123Hashed = await bcrypt.hash('guest123', salt);

    // Seed Host Account
    const hostUser = new User({
      name: 'Host Account',
      age: 40,
      phoneNumber: '970456123',
      caretakerPhoneNumber: '9000000000',
      password: pass123Hashed,
      role: 'patient'
    });
    await hostUser.save();
    console.log('Host Account seeded successfully!');

    // Seed Guest Account
    const guestUser = new User({
      name: 'Guest User',
      age: 25,
      phoneNumber: 'guest123',
      caretakerPhoneNumber: '0000000000',
      password: guest123Hashed,
      role: 'patient'
    });
    await guestUser.save();
    console.log('Guest Account seeded successfully!');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding user:', err);
    process.exit(1);
  }
};

seedUser();
