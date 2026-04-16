const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/', async (req, res) => {
  try {
    const { userId, contactId, text, isFromUser } = req.body;
    const newMessage = new Message({ userId, contactId, text, isFromUser });
    await newMessage.save();
    
    // Auto-reply simulation to make chatting functional for demo
    if (isFromUser) {
      setTimeout(async () => {
        const reply = new Message({
          userId,
          contactId,
          text: 'Got it! I will get back to you shortly.',
          isFromUser: false
        });
        await reply.save();
      }, 1500);
    }
    
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:userId/:contactId', async (req, res) => {
  try {
    const messages = await Message.find({ 
      userId: req.params.userId, 
      contactId: req.params.contactId 
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
