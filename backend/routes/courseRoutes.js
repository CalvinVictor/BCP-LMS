const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const { verifyToken, verifyInstructor } = require('../middleware/authMiddleware');

// @route   POST /api/courses
// @desc    Create a new course
router.post('/', [verifyToken, verifyInstructor], async (req, res) => {
  try {
    const { title, description, category, level, thumbnail, totalVideos } = req.body;
    const newCourse = new Course({
      title, description, category, level, thumbnail, totalVideos,
      instructor: req.user.id,
      status: 'Draft',
    });
    const course = await newCourse.save();
    res.status(201).json(course);
  } catch (err) {
    console.error("Error creating course:", err.message);
    res.status(500).json({ message: 'Server Error: Could not create course.' });
  }
});

// @route   GET /api/courses
// @desc    Get all PUBLISHED courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find({ status: 'Published' }).populate('instructor', 'username');
    res.json(courses);
  } catch (err) {
    console.error("Error fetching public courses:", err.message);
    res.status(500).json({ message: 'Server Error: Could not fetch courses.' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get a single course by its ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'username');
    if (!course || course.status !== 'Published') {
      return res.status(404).json({ message: 'Course not found or is not available.' });
    }
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/courses/:id/publish
// @desc    Publish a course
router.put('/:id/publish', [verifyToken, verifyInstructor], async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.instructor.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });
    
    course.status = "Published";
    await course.save();
    res.status(200).json({ message: "Course published successfully", course });
  } catch (err) {
    console.error("Error publishing course:", err);
    res.status(500).json({ message: "Failed to publish course" });
  }
});

// @route   POST /api/courses/:courseId/chapters  <- ✅ THIS LINE IS NOW CORRECT
// @desc    Add a new chapter to a course
router.post('/:courseId/chapters', [verifyToken, verifyInstructor], async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (course.instructor.toString() !== req.user.id) return res.status(403).json({ message: "Not authorized" });

    const newChapter = req.body;
    course.chapters.push(newChapter);
    await course.save();

    res.status(201).json({ message: "Chapter added successfully", course });
  } catch (err) {
    console.error("Error adding chapter:", err);
    res.status(500).json({ message: "Failed to add chapter" });
  }
});

// in backend/routes/courseRoutes.js

// ✅ REPLACE THE OLD /:courseId/quiz ROUTE WITH THIS NEW VERSION

// @route   GET /api/courses/:courseId/quiz
// @desc    Get all MCQs for a course to build a quiz
router.get('/:courseId/quiz', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    let allQuestions = [];
    course.chapters.forEach(chapter => {
      if (chapter.mcqs && chapter.mcqs.length > 0) {
        
        // This .map() function reformats the data to match the frontend
        const formattedMcqs = chapter.mcqs.map(mcq => ({
          questionText: mcq.question, // from 'question' to 'questionText'
          options: mcq.options,
          correctAnswer: mcq.correctAnswer,
        }));
        
        allQuestions = allQuestions.concat(formattedMcqs);
      }
    });

    if (allQuestions.length === 0) {
      return res.status(404).json({ message: 'No quiz questions found.' });
    }

    res.json({
      title: `Evaluation for ${course.title}`,
      questions: allQuestions,
    });

  } catch (error) {
    console.error('Error fetching quiz data:', error);
    res.status(500).json({ message: 'Server error while fetching quiz' });
  }
});

// @route   GET /api/courses/highly-rated
// @desc    Get top 3-4 courses with a rating of 4.5 or higher
// @access  Public
router.get('/highly-rated', async (req, res) => {
  try {
    const highlyRatedCourses = await Course.find({ 
        status: 'Published', 
        rating: { $gte: 4.5 } 
    })
    .sort({ rating: -1 }) // Sort by highest rating
    .limit(4) // Limit to the top 4
    .populate('instructor', 'username');

    res.json(highlyRatedCourses);
  } catch (err) {
    console.error("Error fetching highly rated courses:", err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;