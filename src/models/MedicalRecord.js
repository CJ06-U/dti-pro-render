const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Prescription', 'Lab Report', 'Scan', 'Other'], required: true },
  fileUrl: { type: String, required: true }, 
  description: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
