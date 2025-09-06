const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student',
  },
  // --- NEW PROFILE FIELDS ---
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  bio: { type: String, default: 'LMS learner passionate about acquiring new skills.' },
  avatar: { type: String, default: '' }, // URL to profile picture
}, { timestamps: true }); // Adds createdAt (joinDate) and updatedAt

module.exports = mongoose.model('User', userSchema);