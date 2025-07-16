const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  instructor: String,
  students: Number,
  status: { type: String, enum: ['active', 'draft'], default: 'draft' },
  category: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', courseSchema);
