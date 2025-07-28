const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const { verifyToken, verifyInstructor } = require('../middleware/authMiddleware');

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Instructor Only)
router.post('/', [verifyToken, verifyInstructor], async (req, res) => {
  try {
    const { title, description, category, price, level, duration } = req.body;

    const newCourse = new Course({
      title,
      description,
      category,
      price,
      level,
      duration,
      instructorId: req.user.id, // Link the course to the logged-in instructor
      status: 'draft', // Courses start as a draft by default
    });

    const course = await newCourse.save();
    res.status(201).json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   GET /api/courses
// @desc    Get all PUBLISHED courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Only find courses that have been marked as 'published'
    const courses = await Course.find({ status: 'published' });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;