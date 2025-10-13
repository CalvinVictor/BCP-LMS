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
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  avatar: { type: String, default: '' },

  // ✅ ADD THESE TWO FIELDS FOR PASSWORD RESET
  resetPasswordToken: String,
  resetPasswordExpire: Date,

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
