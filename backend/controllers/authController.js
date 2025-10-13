const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // Ensure you have this utility file

// Initialize the Google Auth Client with your ID from the .env file
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --- Register Controller ---
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or email already exists." });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            username, email, password: hashedPassword, role: role || 'student',
        });
        const payload = { id: user._id, role: user.role, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ token, user: payload });
    } catch (err) {
        console.error("REGISTRATION ERROR:", err);
        res.status(500).json({ message: "Server error during registration." });
    }
};

// --- Login Controller ---
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }
        const payload = { id: user._id, role: user.role, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: payload });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: "Server error during login." });
    }
};

// --- Google Login Controller ---
exports.googleLogin = async (req, res) => {
    const { credential, role } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture } = ticket.getPayload();
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                username: name,
                email,
                password: await bcrypt.hash(crypto.randomBytes(20).toString('hex'), 12),
                role: role || 'student',
                avatar: picture,
            });
        }
        const payload = { id: user._id, role: user.role, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: payload });
    } catch (err) {
        console.error("GOOGLE LOGIN ERROR:", err);
        res.status(500).json({ message: "Google Sign-In failed. Please try again." });
    }
};

// --- Forgot Password Controller ---
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save({ validateBeforeSave: false });

        // This should be your frontend's reset password URL
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`; 
        const message = `
            <h1>You have requested a password reset</h1>
            <p>Please click this link to reset your password:</p>
            <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
            <p>This link will expire in 10 minutes.</p>
        `;
        await sendEmail({
            email: user.email,
            subject: 'SJU Courses - Password Reset Request',
            message,
        });
        res.status(200).json({ message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (err) {
        console.error("FORGOT PASSWORD ERROR:", err);
        // Clear any potentially saved token on error
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }
        res.status(500).json({ message: "An error occurred. Please try again." });
    }
};

// --- Reset Password Controller ---
exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }
        user.password = await bcrypt.hash(req.body.password, 12);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ message: 'Password reset successful!' });
    } catch (err) {
        console.error("RESET PASSWORD ERROR:", err);
        res.status(500).json({ message: 'Server error. Please try again.' });
    }
};