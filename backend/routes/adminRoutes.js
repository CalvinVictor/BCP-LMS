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

// 👥 Get all users
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
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

// 📚 Get all courses
router.get('/courses', verifyAdmin, async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
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
