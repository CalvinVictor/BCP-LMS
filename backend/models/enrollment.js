const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', // Links to your Course model
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Links to your User model
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  progress: {
    type: Number,
    default: 0, // Progress as a percentage from 0 to 100
  },
});

// This is a compound index. It ensures that the same student cannot enroll
// in the same course more than once, preventing duplicate data.
enrollmentSchema.index({ course: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
