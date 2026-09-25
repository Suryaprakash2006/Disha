const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') return next();
  return res.status(403).json({ success: false, message: 'Admin access required' });
};

module.exports = { protect, adminOnly };
