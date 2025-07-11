require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const authenticate = require('./middleware/authMiddleware'); // ⬅️ Import middleware

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// ➕ Add your protected route here:
app.get('/api/protected', authenticate, (req, res) => {
  res.json({
    message: `Hello ${req.user.role}, your token is valid.`,
    user: req.user,
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
