const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET || 'arogya_secret_key_2026',
    { expiresIn: '30d' }
  );
};

// In-memory mock store fallback if MongoDB Atlas is not yet connected
const mockUsers = new Map();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, age, gender, city } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        phone: phone || '',
        age: age ? Number(age) : 28,
        gender: gender || 'Male',
        city: city || 'Mumbai',
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          age: user.age,
          gender: user.gender,
          city: user.city,
          role: user.role,
        },
      });
    } catch (dbError) {
      // Fallback in-memory mode if MongoDB Atlas is disconnected
      console.warn('Handling registration with in-memory fallback:', dbError.message);
      if (mockUsers.has(email.toLowerCase())) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists (demo mode)' });
      }

      const mockUser = {
        _id: 'usr_' + Date.now(),
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        age: age ? Number(age) : 28,
        gender: gender || 'Male',
        city: city || 'Mumbai',
        role: 'user',
      };
      mockUsers.set(email.toLowerCase(), { ...mockUser, password });

      const token = generateToken(mockUser);
      return res.status(201).json({
        success: true,
        token,
        user: mockUser,
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    try {
      const user = await User.findOne({ email: email.toLowerCase() });

      if (user && (await user.matchPassword(password))) {
        const token = generateToken(user);
        return res.json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            age: user.age,
            gender: user.gender,
            city: user.city,
            role: user.role,
          },
        });
      }
    } catch (dbError) {
      console.warn('Handling login with in-memory fallback:', dbError.message);
      const mock = mockUsers.get(email.toLowerCase());
      if (mock && mock.password === password) {
        const token = generateToken(mock);
        return res.json({
          success: true,
          token,
          user: mock,
        });
      }
    }

    // Demo user quick login support for convenience
    if (email.toLowerCase() === 'demo@arogyakavaj.com' && password === 'demo123') {
      const demoUser = {
        _id: 'usr_demo_100',
        name: 'Rahul Sharma',
        email: 'demo@arogyakavaj.com',
        phone: '+91 98765 43210',
        age: 32,
        gender: 'Male',
        city: 'Mumbai',
        role: 'user',
      };
      const token = generateToken(demoUser);
      return res.json({
        success: true,
        token,
        user: demoUser,
      });
    }

    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, age, gender, bloodGroup, city, state } = req.body;
    try {
      const user = await User.findById(req.user._id);
      if (user) {
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (age) user.age = Number(age);
        if (gender) user.gender = gender;
        if (bloodGroup) user.bloodGroup = bloodGroup;
        if (city) user.city = city;
        if (state) user.state = state;

        await user.save();
        return res.json({ success: true, user });
      }
    } catch (dbErr) {
      // Mock update
      return res.json({
        success: true,
        user: { ...req.user, name, phone, age, gender, city, state },
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
