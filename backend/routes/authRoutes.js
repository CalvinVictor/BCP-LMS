const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', register);
router.post('/login', login);

// Protected Route Example
router.get('/protected', authenticate, (req, res) => {
  res.json({
    message: `Hello ${req.user.role}, your ID is ${req.user.userId}`,
  });
});

module.exports = router;
