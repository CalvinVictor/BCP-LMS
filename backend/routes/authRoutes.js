const express = require('express');
const router = express.Router();

// ✅ This correctly imports all the functions from your authController
const {
    register,
    login,
    googleLogin,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

// Import the middleware for protecting routes
const { verifyToken } = require('../middleware/authMiddleware');

// --- Public Authentication Routes ---

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Log in a user
router.post('/login', login);

// @route   POST /api/auth/google
// @desc    Handle Google Sign-In
router.post('/google', googleLogin);

// @route   POST /api/auth/forgot-password
// @desc    Request a password reset email
router.post('/forgot-password', forgotPassword);

// @route   POST /api/auth/reset-password/:token
// @desc    Submit a new password with a valid token
router.post('/reset-password/:token', resetPassword);


// --- Example Protected Route ---

// @route   GET /api/auth/protected
// @desc    An example route that only logged-in users can access
router.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: `Hello ${req.user.username}, your token is valid and you are authorized.`,
    user: req.user,
  });
});

module.exports = router;