const express = require('express');
const router = express.Router();
const { verifyToken, verifyInstructor } = require('../middleware/authMiddleware');
const courseController = require('../controllers/courseController');

// @route   POST /api/instructor/create-course
// @desc    Instructor creates a new course
router.post('/create-course', verifyToken, verifyInstructor, courseController.createCourse);

// @route   GET /api/instructor/my-courses
// @desc    Get all courses created by this instructor
router.get('/my-courses', verifyToken, verifyInstructor, courseController.getMyCourses);

// @route   GET /api/instructor/stats
// @desc    Get instructor dashboard statistics
router.get('/stats', verifyToken, verifyInstructor, async (req, res) => {
  try {
    const Course = require('../models/course');
    const courses = await Course.find({ instructor: req.user.id });

    const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
    const avgRating = courses.length > 0
      ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1)
      : 0;

    res.json({
      totalStudents,
      averageRating: avgRating,
      monthlyEarnings: 12450 // Hardcoded for now
    });
  } catch (error) {
    console.error("Error in /stats route:", error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
