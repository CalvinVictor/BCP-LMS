const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const Enrollment = require('../models/enrollment');
const { verifyToken } = require('../middleware/authMiddleware');

// @route   GET /api/learning/course/:courseId
// @desc    Get full course content FOR ENROLLED STUDENTS ONLY
// @access  Private
router.get('/course/:courseId', verifyToken, async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.params;

    // 1. Security Check: Verify the student is actually enrolled in this course.
    const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrollment) {
      return res.status(403).json({ message: "Access denied. You are not enrolled in this course." });
    }

    // 2. If enrolled, fetch the full course details, including all chapters and MCQs.
    const course = await Course.findById(courseId).populate('instructor', 'username');
    if (!course) {
        return res.status(404).json({ message: "Course not found." });
    }

    // 3. Send back the full course object along with the student's progress.
    res.json({ course, enrollment });

  } catch (err) {
    console.error("Error fetching course content for learning:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/learning/progress/complete-chapter
// @desc    Mark a chapter as completed for a student
// @access  Private
router.post('/progress/complete-chapter', verifyToken, async (req, res) => {
    const { courseId, chapterId } = req.body;
    const studentId = req.user.id;

    try {
        // 1. Find the specific enrollment record for this student and course.
        const enrollment = await Enrollment.findOne({ student: studentId, course: courseId });
        if (!enrollment) {
            return res.status(403).json({ message: "You are not enrolled in this course." });
        }

        // 2. Add the chapter's ID to the list of completed chapters, ensuring no duplicates.
        if (!enrollment.completedChapters.includes(chapterId)) {
            enrollment.completedChapters.push(chapterId);
        }

        // 3. Recalculate the overall course progress.
        const course = await Course.findById(courseId);
        const totalChapters = course.chapters.length;
        const completedCount = enrollment.completedChapters.length;
        
        enrollment.progress = Math.round((completedCount / totalChapters) * 100);

        await enrollment.save();

        res.json({ message: "Progress updated successfully!", enrollment });

    } catch (err) {
        console.error("Error updating progress:", err);
        res.status(500).json({ message: "Server Error" });
    }

    // @route   POST /api/learning/progress/complete-course
// @desc    Mark a course as 100% completed for a student
// @access  Private
router.post('/progress/complete-course', verifyToken, async (req, res) => {
    const { courseId } = req.body;
    const studentId = req.user.id;

    try {
        // Find the enrollment and update its progress to 100
        const enrollment = await Enrollment.findOneAndUpdate(
            { student: studentId, course: courseId },
            { progress: 100 },
            { new: true } // This option returns the updated document
        );

        if (!enrollment) {
            return res.status(404).json({ message: "Enrollment not found." });
        }

        res.json({ message: "Course marked as complete!", enrollment });

    } catch (err) {
        console.error("Error completing course:", err);
        res.status(500).json({ message: "Server Error" });
    }
});
});

module.exports = router;