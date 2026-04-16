const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

router.post('/', async (req, res) => {
  try {
    const { userId, name, phone, role } = req.body;
    const newContact = new Contact({ userId, name, phone, role });
    await newContact.save();
    res.status(201).json(newContact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
