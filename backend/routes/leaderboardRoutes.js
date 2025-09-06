const express = require('express');
const router = express.Router();
// ✅ Import the new function
const { getLeaderboard, submitTestResult } = require('../controllers/leaderboardController.js');
// ✅ Import your authentication middleware
const  { verifyToken }= require('../middleware/authMiddleware.js');

// This route will handle requests for a specific course's leaderboard
router.get('/:courseId', getLeaderboard);

router.post('/submit/:courseId', verifyToken, submitTestResult);

module.exports = router;