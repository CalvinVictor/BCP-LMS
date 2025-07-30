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
      instructor: req.user.id, // ✅ Correct field
      status: 'Draft',          // ✅ Match schema
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
    const courses = await Course.find({ status: 'Published' });
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ✅ Publish course
router.put('/:id/publish', verifyToken, verifyInstructor, async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.instructor.toString() !== req.user.id)
      return res.status(403).json({ error: "Not authorized to publish this course" });

    course.status = "Published";
    await course.save();

    res.status(200).json({ message: "Course published successfully", course });
  } catch (err) {
    console.error("Error publishing course:", err);
    res.status(500).json({ error: "Failed to publish course" });
  }
});

// ✅ Add chapter with MCQs
router.post('/:courseId/add-chapter', verifyToken, verifyInstructor, async (req, res) => {
  try {
    const { title, description, videoURL, materials, mcqs } = req.body;
    const course = await Course.findById(req.params.courseId);

    if (!course) return res.status(404).json({ error: "Course not found" });
    if (course.instructor.toString() !== req.user.id)
      return res.status(403).json({ error: "Not authorized to add chapters to this course" });

    course.chapters.push({ title, description, videoURL, materials, mcqs });
    await course.save();

    res.status(201).json({ message: "Chapter added successfully", course });
  } catch (err) {
    console.error("Error adding chapter:", err);
    res.status(500).json({ error: "Failed to add chapter" });
  }
});

module.exports = router;
