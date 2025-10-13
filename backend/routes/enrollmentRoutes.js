const express = require('express');
const router = express.Router();
const Enrollment = require('../models/enrollment');
const Course = require('../models/course');
const { verifyToken } = require('../middleware/authMiddleware');

// @route   POST /api/enrollments/enroll
// @desc    Enroll the logged-in student in a course
router.post('/enroll', verifyToken, async (req, res) => {
  const { courseId } = req.body;
  const studentId = req.user.id;

  try {
    const existingEnrollment = await Enrollment.findOne({ course: courseId, student: studentId });
    if (existingEnrollment) {
      return res.status(400).json({ message: 'You are already enrolled in this course.' });
    }

    const newEnrollment = new Enrollment({ course: courseId, student: studentId });
    await newEnrollment.save();

    await Course.findByIdAndUpdate(courseId, { $inc: { students: 1 } });

    res.status(201).json({ message: 'Successfully enrolled!', enrollment: newEnrollment });
  } catch (err) {
    res.status(500).json({ message: 'Server Error during enrollment.' });
  }
});

// @route   GET /api/enrollments/my-courses
// @desc    Get all courses a student is enrolled in, with full details
// @access  Private
router.get('/my-courses', verifyToken, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id })
            // This is the crucial part. It finds the full course document for each enrollment.
            .populate({
                path: 'course',
                // This nested populate also gets the instructor's username for the course card
                populate: { 
                    path: 'instructor',
                    select: 'username'
                }
            });
        
        if (!enrollments) {
            return res.json([]); // Always return an array, even if it's empty
        }

        // Extract just the course data from the enrollment objects, filtering out any null courses
        const courses = enrollments.map(enrollment => enrollment.course).filter(course => course != null);
        
        res.json(courses);
    } catch (err) {
        console.error("Error fetching enrolled courses:", err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/enrollments/status/:courseId
// @desc    Check if the current user is enrolled in a specific course
router.get('/status/:courseId', verifyToken, async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ 
            student: req.user.id, 
            course: req.params.courseId 
        });
        
        if (enrollment) {
            res.json({ isEnrolled: true, progress: enrollment.progress });
        } else {
            res.json({ isEnrolled: false });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error checking status.' });
    }
});

module.exports = router;