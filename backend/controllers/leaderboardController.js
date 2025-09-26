const TestResult = require('../models/testResultModel.js');

// @desc    Get ALL scores for a course (not just top 3)
exports.getLeaderboard = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    console.log('🏆 Fetching leaderboard for course:', courseId);
    
    // Get ALL test results, not just top 3
    const allScores = await TestResult.find({ course: courseId })
      .sort({ score: -1, createdAt: 1 }) // Sort by score descending, then by completion time
      .populate('student', 'username name') // Get both username and name
      .lean(); // Use lean() for better performance
    
    console.log(`📊 Found ${allScores.length} test results for course ${courseId}`);
    
    // Add rank to each result
    const leaderboardWithRanks = allScores.map((result, index) => ({
      ...result,
      rank: index + 1,
      // Ensure we have a user identifier
      userId: result.student?._id || result.student,
      userName: result.student?.username || result.student?.name || 'Unknown User'
    }));
    
    res.status(200).json(leaderboardWithRanks);
    
  } catch (error) {
    console.error('❌ Leaderboard fetch error:', error);
    res.status(500).json({ 
      message: "Failed to fetch leaderboard",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get only top 3 scores for a course (for specific use cases)
exports.getTop3Leaderboard = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const top3Scores = await TestResult.find({ course: courseId })
      .sort({ score: -1, createdAt: 1 })
      .limit(3)
      .populate('student', 'username name');
    
    const top3WithRanks = top3Scores.map((result, index) => ({
      ...result.toObject(),
      rank: index + 1,
      userId: result.student?._id || result.student,
      userName: result.student?.username || result.student?.name || 'Unknown User'
    }));
    
    res.status(200).json(top3WithRanks);
    
  } catch (error) {
    console.error('❌ Top 3 leaderboard fetch error:', error);
    res.status(500).json({ message: "Failed to fetch top 3 leaderboard" });
  }
};

// @desc    Submit a test result
exports.submitTestResult = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { score, timeTaken } = req.body;
    const studentId = req.user.id;

    console.log('📝 Submitting test result:', { courseId, studentId, score, timeTaken });

    // Validate input
    if (score === undefined || score === null) {
      return res.status(400).json({ message: "Score is required" });
    }

    // Define the query to find existing document
    const query = {
      course: courseId,
      student: studentId,
    };

    // Define the update data
    const updateData = {
      $set: {
        score: score,
        timeTaken: timeTaken || 0,
        completedAt: new Date()
      },
    };

    // Set options
    const options = {
      new: true,
      upsert: true,
    };

    // Execute the update
    const result = await TestResult.findOneAndUpdate(query, updateData, options)
      .populate('student', 'username name');

    console.log('✅ Test result saved:', result);

    res.status(200).json({ 
      message: "Quiz result saved!", 
      result: result,
      rank: null // We could calculate rank here if needed
    });

  } catch (error) {
    console.error("❌ Error saving test result:", error);
    res.status(500).json({ message: "Failed to save test result" });
  }
};

// @desc    Get user's rank and stats for a specific course
exports.getUserRank = async (req, res) => {
  try {
    const { courseId, userId } = req.params;
    
    // Get all results for the course to calculate rank
    const allResults = await TestResult.find({ course: courseId })
      .sort({ score: -1, createdAt: 1 })
      .populate('student', 'username name');
    
    // Find user's position
    const userIndex = allResults.findIndex(result => 
      result.student._id.toString() === userId
    );
    
    if (userIndex === -1) {
      return res.status(404).json({ message: "User result not found" });
    }
    
    const userResult = allResults[userIndex];
    const rank = userIndex + 1;
    const totalParticipants = allResults.length;
    
    res.status(200).json({
      rank,
      score: userResult.score,
      timeTaken: userResult.timeTaken,
      totalParticipants,
      isTop3: rank <= 3,
      completedAt: userResult.completedAt
    });
    
  } catch (error) {
    console.error('❌ Error getting user rank:', error);
    res.status(500).json({ message: "Failed to get user rank" });
  }
};