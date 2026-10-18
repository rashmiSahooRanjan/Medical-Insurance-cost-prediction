const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'arogya_secret_key_2026');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      // In case user was deleted or mock
      req.user = { _id: decoded.id, name: decoded.name || 'User', email: decoded.email || 'user@example.com' };
    }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
};

const optionalProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'arogya_secret_key_2026');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Continue as guest
    }
  }
  next();
};

module.exports = { protect, optionalProtect };
