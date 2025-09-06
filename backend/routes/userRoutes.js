const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Enrollment = require('../models/enrollment');
const { verifyToken } = require('../middleware/authMiddleware');

// @route   GET /api/users/profile
// @desc    Get the complete profile of the currently logged-in user
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // Fetch learning stats
    const enrollments = await Enrollment.find({ student: req.user.id });
    const coursesCompleted = enrollments.filter(e => e.progress === 100).length;
    
    // Combine profile and stats into one response
    const profileData = {
      ...user.toObject(),
      coursesCompleted: coursesCompleted,
      certificatesEarned: coursesCompleted, // Assuming one certificate per completed course
      currentStreak: 15, // Placeholder for more complex logic
      totalHours: 248,   // Placeholder for more complex logic
    };

    res.json(profileData);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update the profile of the currently logged-in user
router.put('/profile', verifyToken, async (req, res) => {
  const { username, email, phone, location, bio } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update fields if they are provided in the request
    user.username = username || user.username;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.location = location || user.location;
    user.bio = bio || user.bio;

    const updatedUser = await user.save();
    
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json({ message: 'Profile updated successfully!', user: userResponse });
  } catch (err) {
    if (err.code === 11000) {
        return res.status(400).json({ message: 'Email or username already in use.' });
    }
    console.error("Error updating profile:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/users/my-completed-courses
// @desc    Get all courses a student has completed
router.get('/my-completed-courses', verifyToken, async (req, res) => {
    try {
        const completedEnrollments = await Enrollment.find({ 
            student: req.user.id, 
            progress: 100 
        }).populate({
            path: 'course',
            select: 'title thumbnail category' // Select only the fields needed for the modal
        });
        
        const courses = completedEnrollments.map(e => e.course).filter(c => c != null);
        res.json(courses);
    } catch (err) {
        console.error("Error fetching completed courses:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
