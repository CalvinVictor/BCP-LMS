// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// --- Route Imports ---
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');
const instructorRoutes = require('./routes/instructorRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const learningRoutes = require('./routes/learningRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes.js');
const userRoutes = require('./routes/userRoutes');
const certificateRoutes = require('./routes/certificateRoutes');

// --- Middleware Import (Corrected) ---
// Import the specific verifyToken function using destructuring
const { verifyToken } = require('./middleware/authMiddleware');

const app = express();

// --- Main Middleware ---
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded videos as static files
// Any file in /uploads/videos will be accessible at http://localhost:5000/uploads/videos/<filename>
// Add CORS headers for video files
app.use("/uploads/videos", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Range");
    next();
});

app.use(
    "/uploads/videos",
    express.static(path.join(__dirname, "uploads/videos"))
);

// --- Route Definitions ---
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/instructor', instructorRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/certificates', certificateRoutes);

// Use the 'verifyToken' function to protect all admin routes
app.use('/api/admin', verifyToken, adminRoutes);

// Example protected route
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: `Hello ${req.user.role}, your token is valid.`,
    user: req.user,
  });
});

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));