const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token || !token.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, no token provided' 
      });
    }
    
    const jwtToken = token.split(' ')[1];
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, invalid token' 
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Server error during authentication' 
    });
  }
};

// Admin authorization middleware
const authorizeAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, admin not found' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error during authorization' 
    });
  }
};

// User authorization middleware
const authorizeUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, user not found' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Server error during authorization' 
    });
  }
};

// Token generation helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

module.exports = {
  authenticateToken,
  authorizeAdmin,
  authorizeUser,
  generateToken
};