// backend/routes/instructorRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();



const {
  verifyToken,
  verifyInstructor,
} = require("../middleware/authMiddleware");
const courseController = require("../controllers/courseController");

/* ---------------------- Instructor Routes ---------------------- */

// @route   POST /api/instructor/create-course
// @desc    Instructor creates a new course
router.post(
  "/create-course",
  verifyToken,
  verifyInstructor,
  courseController.createCourse
);

// @route   GET /api/instructor/my-courses
// @desc    Get all courses created by this instructor
router.get(
  "/my-courses",
  verifyToken,
  verifyInstructor,
  courseController.getMyCourses
);

// @route   POST /api/instructor/:courseId/add-chapter
// @desc    Add a new chapter with video upload
// Expects form-data: { title, description?, video (file) }
router.post(
  "/:courseId/add-chapter",
  verifyToken,
  verifyInstructor,
  courseController.uploadVideo,        // ✅ Multer middleware for video upload
  courseController.addChapterWithVideo // ✅ Saves chapter + relative video path
);

// Delete a chapter
// Delete a chapter
router.delete(
  "/:courseId/chapters/:chapterId",
  verifyToken,
  verifyInstructor,
  courseController.deleteChapter
);





// @route   GET /api/instructor/stats
// @desc    Get instructor dashboard statistics
router.get("/stats", verifyToken, verifyInstructor, async (req, res) => {
  try {
    const Course = require("../models/course");
    const courses = await Course.find({ instructor: req.user.id });

    // total students (if 'students' is an array of enrolled users, adjust accordingly)
    const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);

    // average rating
    const avgRating =
      courses.length > 0
        ? (
            courses.reduce((sum, c) => sum + (c.rating || 0), 0) / courses.length
          ).toFixed(1)
        : 0;

    res.json({
      totalStudents,
      averageRating: avgRating,
      monthlyEarnings: 12450, // 💡 Placeholder - replace later with real earnings logic
    });
  } catch (error) {
    console.error("Error in /stats route:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
