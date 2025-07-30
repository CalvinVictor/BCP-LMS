require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- Route Imports ---
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
// --- Middleware Import (Corrected) ---
// Import the specific verifyToken function using destructuring
const { verifyToken } = require('./middleware/authMiddleware');

const app = express();

// --- Main Middleware ---
app.use(cors());
app.use(express.json());

// --- Route Definitions ---
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/enrollments', enrollmentRoutes);
// Use the 'verifyToken' function to protect all admin routes
app.use('/api/admin', verifyToken, adminRoutes);

// Example protected route using the 'verifyToken' function
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({
    message: `Hello ${req.user.role}, your token is valid.`,
    user: req.user,
  });
});

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));