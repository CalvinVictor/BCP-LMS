const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // For generating a unique verification code

const certificateSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  verificationCode: {
    type: String,
    default: () => uuidv4(), // Generate a unique code for each certificate
    unique: true,
  },
});

module.exports = mongoose.model('Certificate', certificateSchema);