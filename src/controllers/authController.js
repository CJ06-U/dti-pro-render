const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, phoneNumber, password, age, caretakerPhoneNumber, role } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ phoneNumber });
    if (user) return res.status(400).json({ error: 'User already exists' });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    user = new User({ 
      name, 
      phoneNumber, 
      password: hashedPassword, 
      age, 
      caretakerPhoneNumber, 
      role 
    });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    
    // Check user
    const user = await User.findOne({ phoneNumber });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Match password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    // Create JWT
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'your_super_secret_jwt_key', 
      { expiresIn: '7d' }
    );
    
    res.json({ token, user: { id: user._id, name: user.name, phoneNumber: user.phoneNumber, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
