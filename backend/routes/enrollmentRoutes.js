const express = require('express');
const router = express.Router();
const Enrollment = require('../models/enrollment');
const Course = require('../models/course');
const { verifyToken } = require('../middleware/authMiddleware'); // Students must be logged in

// @route   POST /api/enrollments/enroll
// @desc    Enroll the logged-in student in a specific course
// @access  Private
router.post('/enroll', verifyToken, async (req, res) => {
  const { courseId } = req.body;
  const studentId = req.user.id; // We get this from the verifyToken middleware

  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required.' });
  }

  try {
    // 1. Check if the student is already enrolled
    const existingEnrollment = await Enrollment.findOne({ course: courseId, student: studentId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }

    // 2. Create the new enrollment record
    const newEnrollment = new Enrollment({
      course: courseId,
      student: studentId,
    });
    await newEnrollment.save();

    // 3. Optional: Increment the student count on the Course model for stats
    await Course.findByIdAndUpdate(courseId, { $inc: { students: 1 } });

    res.status(201).json({ message: 'Successfully enrolled!', enrollment: newEnrollment });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/enrollments/my-courses
// @desc    Get all courses a student is enrolled in
// @access  Private
router.get('/my-courses', verifyToken, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id })
            .populate('course'); // This is key! It replaces the course ID with the full course document
        
        // Return just the course objects for easier use on the frontend
        const courses = enrollments.map(e => e.course);
        res.json(courses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
