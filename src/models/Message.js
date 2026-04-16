const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // The user's UID owning the chat
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: true },
  text: { type: String, required: true },
  isFromUser: { type: Boolean, default: true }, // True if user sent it, false if 'contact' sent it
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
