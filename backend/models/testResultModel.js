const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Course',
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    score: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number, 
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TestResult = mongoose.model('TestResult', testResultSchema);

module.exports = TestResult;