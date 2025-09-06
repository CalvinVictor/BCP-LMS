const TestResult = require('../models/testResultModel.js');

// @desc    Get top 3 scores for a course
exports.getLeaderboard = async (req, res) => {
  try {
    const { courseId } = req.params;
    const topScores = await TestResult.find({ course: courseId })
      .sort({ score: -1 })
      .limit(3)
      .populate('student', 'username');
    res.status(200).json(topScores);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Submit a test result
// @desc    Submit a test result
// in /controllers/leaderboardController.js

exports.submitTestResult = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { score, timeTaken } = req.body;
    const studentId = req.user.id; // Corrected to use .id

    // 1. Define the query to find the existing document
    // We are looking for a result that matches BOTH the course and the student.
    const query = {
      course: courseId,
      student: studentId,
    };

    // 2. Define the new data to be saved or updated
    // We use the $set operator to update the score and time.
    const updateData = {
      $set: {
        score: score,
        timeTaken: timeTaken || 0,
      },
    };

    // 3. Set the options for the operation
    const options = {
      new: true,      // Return the new, updated document
      upsert: true,   // This is the magic! It creates a new document if one doesn't exist.
    };

    // 4. Execute the findOneAndUpdate command
    const result = await TestResult.findOneAndUpdate(query, updateData, options);

    res.status(200).json({ message: "Quiz result saved!", result: result });

  } catch (error) {
    console.error("ERROR SAVING TEST RESULT:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
