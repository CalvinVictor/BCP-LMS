const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const User = require('../models/user');
// You'll need a middleware to verify the user is an instructor
const { verifyToken, verifyInstructor } = require('../middleware/authMiddleware');

// GET /api/instructor/courses
// Fetches courses created by the logged-in instructor
router.get('/courses', verifyToken, verifyInstructor, async (req, res) => {
  try {
    // Assumes your Course model has a field to store the instructor's ID
    const courses = await Course.find({ instructorId: req.user.id }).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// GET /api/instructor/stats
// Fetches dashboard stats for the logged-in instructor
router.get('/stats', verifyToken, verifyInstructor, async (req, res) => {
  try {
    const courses = await Course.find({ instructorId: req.user.id });
    
    const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
    const averageRating = courses.length > 0 
      ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)
      : 0;

    res.json({
      totalStudents,
      averageRating,
      monthlyEarnings: 12450 // Placeholder, real earnings logic would be more complex
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

module.exports = router;