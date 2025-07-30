const mongoose = require('mongoose');

// ✅ Schema for MCQs inside each chapter
const mcqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true }
});

// ✅ Schema for individual chapters
const chapterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  videoURL: String, // for now store video URL (later we can handle file uploads)
  materials: [String], // array of material URLs
  mcqs: [mcqSchema] // array of MCQs
});

// ✅ Main Course schema
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: String,
  level: String,
  thumbnail: String,
  totalVideos: Number,
  completedVideos: Number,
  students: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chapters: [chapterSchema] // ✅ Added chapters array
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);


