const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

const { sendNotification } = require('../services/firebaseMessaging');

// @route POST /api/appointments
// @desc Create a new appointment
router.post('/', async (req, res) => {
  try {
    const { 
      patientId, 
      doctorId, 
      doctorName, 
      date, 
      time, 
      place, 
      recordReference, 
      description,
      deviceToken // Assume device token is sent from frontend
    } = req.body;

    const newAppointment = new Appointment({
      patientId,
      doctorId,
      doctorName,
      date,
      time,
      place,
      recordReference,
      description
    });

    const appointment = await newAppointment.save();

    if (deviceToken) {
      await sendNotification(
        deviceToken, 
        'Appointment Confirmed!', 
        `Your appointment with ${doctorName} on ${new Date(date).toLocaleDateString()} at ${time} is confirmed.`
      ).catch(e => console.error('Failed to notify:', e));
    }

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route GET /api/appointments/:userId
// @desc Get appointments for a user
router.get('/:userId', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.params.userId }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
