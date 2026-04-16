const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { parser } = require('../services/cloudinary');

// @route POST /api/records/upload
// @desc Upload a new medical record (PDF/Image) using Cloudinary
router.post('/upload', parser.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { userId, type, description } = req.body;
    
    // Cloudinary automatically returns the secure URL in req.file.path
    const fileUrl = req.file.path;

    const newRecord = new MedicalRecord({
      userId,
      type: type || 'Other',
      description,
      fileUrl
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('Record upload error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET /api/records/:userId
// @desc Get all records for a user
router.get('/:userId', async (req, res) => {
  try {
    const records = await MedicalRecord.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
