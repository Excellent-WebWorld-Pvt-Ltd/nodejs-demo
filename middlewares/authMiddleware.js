const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session.admin) return next();
    res.redirect('/admin/login');
  },
  ensureVendorAuthenticated: (req, res, next) => {
    if (req.session.vendor) return next();
    res.redirect('/vendor/login');
  },
  verifyToken: async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ status: false, message: req.t('Token required') });

  // Check if token is blacklisted
  const blacklisted = await TokenBlacklist.findOne({ where: { token } });
  if (blacklisted) {
    return res.status(401).json({ status: false, message: req.t('Token has been expired') });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ status: false, message: req.t('Invalid token') });
    req.user = user;
    next();
  });
}
};