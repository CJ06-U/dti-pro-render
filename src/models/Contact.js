const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  role: { type: String, default: 'General' }, // Doctor, Caretaker, Family
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Contact', contactSchema);
