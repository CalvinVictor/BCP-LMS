const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Correctly import the specific middleware function you need
const { verifyToken } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Route Example
// Use the 'verifyToken' function directly
router.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: `Hello ${req.user.role}, your ID is ${req.user.id}`,
  });
});

module.exports = router;