const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: '',
  },
  subject: {
    type: String,
    default: 'General Inquiry',
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['New', 'In Review', 'Resolved'],
    default: 'New',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
