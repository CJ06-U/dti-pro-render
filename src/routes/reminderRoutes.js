const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

router.post('/', async (req, res) => {
  try {
    const { userId, title, description, date, time } = req.body;
    const newReminder = new Reminder({ userId, title, description, date, time });
    await newReminder.save();
    res.status(201).json(newReminder);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.params.userId }).sort({ date: 1, time: 1 });
    res.json(reminders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
