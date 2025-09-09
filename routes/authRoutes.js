// routes/authRoutes.js
const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
} = require('../controllers/authController');
const { loginAdmin } = require('../controllers/adminController'); // ✅
const { protect } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/logins', validateLogin, loginUser);

// Admin login route
router.post('/admin-login', validateLogin, loginAdmin);

router.get('/me', protect, getMe);

module.exports = router;
