const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user exists (either regular user or admin)
      const user = await User.findById(decoded.id);
      const admin = await Admin.findById(decoded.id);
      
      if (!user && !admin) {
        return res.status(401).json({ error: 'Not authorized, user not found' });
      }

      // Add user/admin info to request
      req.user = {
        id: decoded.id,
        isAdmin: !!admin
      };

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  } catch (error) {
    console.error('Protect middleware error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { protect };