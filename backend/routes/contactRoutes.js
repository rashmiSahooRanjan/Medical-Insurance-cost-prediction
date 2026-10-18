const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

const mockMessages = [];

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and message' });
    }

    try {
      const saved = await ContactMessage.create({
        name,
        email,
        phone: phone || '',
        subject: subject || 'General Query',
        message,
      });
      return res.status(201).json({
        success: true,
        message: 'Your inquiry has been received! Our healthcare advisor will contact you within 2 business hours.',
        data: saved,
      });
    } catch (dbErr) {
      const mock = { id: 'msg_' + Date.now(), name, email, phone, subject, message, createdAt: new Date() };
      mockMessages.push(mock);
      return res.status(201).json({
        success: true,
        message: 'Your inquiry has been received! Our healthcare advisor will contact you within 2 business hours (Saved).',
        data: mock,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/contact
router.get('/', async (req, res) => {
  try {
    const list = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json({ success: true, count: list.length, messages: list });
  } catch (err) {
    return res.json({ success: true, count: mockMessages.length, messages: mockMessages });
  }
});

module.exports = router;
