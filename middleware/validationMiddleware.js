const validateRegistration = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  
  // Check if all fields are provided
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide all required fields' 
    });
  }
  
  // Check if passwords match
  if (password !== confirmPassword) {
    return res.status(400).json({ 
      success: false,
      message: 'Passwords do not match' 
    });
  }
  
  // Check password length
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false,
      message: 'Password must be at least 6 characters long' 
    });
  }
  
  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide a valid email address' 
    });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  // Check if all fields are provided
  if (!email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Please provide both email and password' 
    });
  }
  
  next();
};

module.exports = {
  validateRegistration,
  validateLogin
};