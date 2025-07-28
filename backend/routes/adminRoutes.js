const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Course = require('../models/course');

// Only allow admins to access
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admins only.' });
  }
  next();
};

// 📊 Get dashboard stats
router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const instructors = await User.countDocuments({ role: 'instructor' });
    const students = await User.countDocuments({ role: 'student' });

    res.json({
      totalUsers,
      totalCourses,
      instructors,
      students,
    });
  } catch (error) {
    console.error('Error fetching stats:', error.message);
    res.status(500).send('Server Error');
  }
});

// 👥 Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 🧑‍🏫 GET /api/admin/instructors - Get all users with the instructor role
router.get('/instructors', verifyAdmin, async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' }).sort({ createdAt: -1 });
    res.json(instructors);
  } catch (error) {
    console.error('Error fetching instructors:', error.message);
    res.status(500).send('Server Error');
  }
});






router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching courses" });
  }
});

// ❌ Delete user
router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// 🔁 Toggle user status
router.put('/users/:id/toggle', verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();
    res.json({ message: 'User status updated', user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});


// ❌ Delete course
router.delete('/courses/:id', verifyAdmin, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// 📥 Create new course (Admin only)
router.post('/courses', verifyAdmin, async (req, res) => {
  try {
    const {
      title,
      instructor,
      category,
      status = "draft",
      rating,
      students = 0,
      duration,
      level
    } = req.body;

    if (!title || !instructor || !category || !duration || !level) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newCourse = new Course({
      title,
      instructor,
      category,
      status,
      rating,
      students,
      duration,
      level,
      createdAt: new Date(),
    });

    await newCourse.save();
    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create course" });
  }
});

// 🔁 Toggle course status
router.put('/courses/:id/toggle', verifyAdmin, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    course.status = course.status === 'active' ? 'draft' : 'active';
    await course.save();
    res.json({ message: 'Course status updated', course });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course status' });
  }
});

module.exports = router;
