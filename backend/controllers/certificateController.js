const { generateCertificatePDF } = require('../utils/pdfGenerator');
const TestResult = require('../models/testResultModel');
const Course = require('../models/course');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

// @desc    Generate and download certificate for top 3 performers
// @route   POST /api/certificates/generate
// @access  Private
const generateCertificate = async (req, res) => {
  try {
    const { courseId, userId, rank, score } = req.body;
    
    console.log('📄 Certificate generation request:', { courseId, userId, rank, score });

    // Validate required fields
    if (!courseId || !userId || !rank || !score) {
      return res.status(400).json({ 
        message: 'Missing required fields: courseId, userId, rank, and score are required' 
      });
    }

    // Validate rank (only top 3 can get certificates)
    if (rank > 3 || rank < 1) {
      return res.status(400).json({ 
        message: 'Certificates are only available for top 3 performers (rank 1-3)' 
      });
    }

    // Verify the user actually achieved this rank/score
    const testResult = await TestResult.findOne({ 
      course: courseId, 
      student: userId 
    }).populate('student', 'username name');

    if (!testResult) {
      return res.status(404).json({ 
        message: 'No test result found for this user and course' 
      });
    }

    // Additional verification: Check if the provided score matches the database
    if (testResult.score !== score) {
      return res.status(400).json({ 
        message: 'Score mismatch. Provided score does not match database record.' 
      });
    }

    // Get user name from the test result or fetch separately if needed
    let userName = testResult.student?.username || testResult.student?.name;
    
    if (!userName) {
      // Fallback: fetch user details separately
      const user = await User.findById(userId).select('username name');
      userName = user?.username || user?.name || 'Student';
    }

    // Generate unique certificate ID
    const timestamp = Date.now();
    const userIdSuffix = userId.slice(-4);
    const certificateId = `CERT-${courseId.slice(-4)}-${userIdSuffix}-${timestamp}`;
    
    console.log('🔑 Generated certificate ID:', certificateId);

    // Prepare certificate data
    const certificateData = {
      userName: userName,
      courseId: courseId,
      rank: rank,
      score: score,
      certificateId: certificateId,
      issuedDate: new Date()
    };

    // Generate the PDF
    console.log('🎨 Generating PDF certificate...');
    const filepath = await generateCertificatePDF(certificateData);
    console.log('✅ Certificate generated at:', filepath);

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      throw new Error('Certificate file was not created');
    }

    // Get file stats for response
    const stats = fs.statSync(filepath);
    console.log(`📊 Certificate file size: ${stats.size} bytes`);

    // Instead of res.download, send JSON response for frontend to handle
    const filename = path.basename(filepath);
    
    res.status(200).json({
      success: true,
      message: 'Certificate generated successfully!',
      certificate: {
        certificateId,
        userId,
        userName,
        courseName: certificateData.courseName || 'Course',
        rank,
        score,
        issuedDate: certificateData.issuedDate,
        filename,
        downloadUrl: `/uploads/certificates/${filename}`,
        viewUrl: `/api/certificates/download/${certificateId}`
      }
    });

  } catch (error) {
    console.error('❌ Certificate generation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate certificate',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Download/view certificate PDF
// @route   GET /api/certificates/download/:certificateId
// @access  Public
const downloadCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    console.log('📥 Download request for certificate:', certificateId);
    
    // Find the certificate file
    const certificatesDir = path.join(__dirname, '../uploads/certificates');
    const filename = `certificate_${certificateId}.pdf`;
    const filepath = path.join(certificatesDir, filename);
    
    console.log('🔍 Looking for file at:', filepath);
    
    // Check if file exists
    if (!fs.existsSync(filepath)) {
      console.log('❌ Certificate file not found:', filepath);
      return res.status(404).json({ 
        success: false,
        message: 'Certificate not found' 
      });
    }
    
    console.log('✅ Certificate file found, sending...');
    
    // Set headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    // Send the file
    res.sendFile(filepath);
    
  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to download certificate: ' + error.message 
    });
  }
};

// @desc    Get certificate info/status for a user
// @route   GET /api/certificates/:courseId/:userId
// @access  Private
const getCertificateStatus = async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    // Get user's test result
    const testResult = await TestResult.findOne({ 
      course: courseId, 
      student: userId 
    }).populate('student', 'username name')
      .populate('course', 'title name');

    if (!testResult) {
      return res.status(404).json({ 
        message: 'No test result found',
        eligible: false
      });
    }

    // Get leaderboard to determine rank
    const leaderboard = await TestResult.find({ course: courseId })
      .sort({ score: -1, createdAt: 1 })
      .populate('student', 'username name');

    const userIndex = leaderboard.findIndex(entry => 
      entry.student._id.toString() === userId
    );

    const rank = userIndex + 1;
    const eligible = rank <= 3; // Only top 3 are eligible

    res.status(200).json({
      eligible,
      rank,
      score: testResult.score,
      totalParticipants: leaderboard.length,
      courseName: testResult.course?.title || testResult.course?.name || 'Course',
      userName: testResult.student?.username || testResult.student?.name || 'Student'
    });

  } catch (error) {
    console.error('❌ Error getting certificate status:', error);
    res.status(500).json({ message: 'Failed to get certificate status' });
  }
};

// @desc    List all certificates (admin function)
// @route   GET /api/certificates/list
// @access  Private/Admin
const listCertificates = async (req, res) => {
  try {
    const certificatesDir = path.join(__dirname, '../uploads/certificates');
    
    if (!fs.existsSync(certificatesDir)) {
      return res.status(200).json({ certificates: [] });
    }

    const files = fs.readdirSync(certificatesDir);
    const certificates = files
      .filter(file => file.endsWith('.pdf'))
      .map(file => {
        const filepath = path.join(certificatesDir, file);
        const stats = fs.statSync(filepath);
        
        return {
          filename: file,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime
        };
      });

    res.status(200).json({ 
      certificates,
      count: certificates.length 
    });

  } catch (error) {
    console.error('❌ Error listing certificates:', error);
    res.status(500).json({ message: 'Failed to list certificates' });
  }
};

// @desc    Delete certificate file (admin function)
// @route   DELETE /api/certificates/:filename
// @access  Private/Admin
const deleteCertificate = async (req, res) => {
  try {
    const { filename } = req.params;
    
    if (!filename.endsWith('.pdf')) {
      return res.status(400).json({ message: 'Invalid certificate filename' });
    }

    const filepath = path.join(__dirname, '../uploads/certificates', filename);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: 'Certificate file not found' });
    }

    fs.unlinkSync(filepath);
    console.log('🗑️ Certificate deleted:', filename);

    res.status(200).json({ message: 'Certificate deleted successfully' });

  } catch (error) {
    console.error('❌ Error deleting certificate:', error);
    res.status(500).json({ message: 'Failed to delete certificate' });
  }
};

// Placeholder functions for routes that need them
const getUserCertificates = (req, res) => {
  res.json({ success: true, certificates: [], count: 0 });
};

const getCertificateById = (req, res) => {
  res.json({ success: true, certificate: null });
};

const checkEligibility = (req, res) => {
  res.json({ success: true, hasEligibility: true });
};

module.exports = {
  generateCertificate,
  downloadCertificate,
  getCertificateStatus,
  listCertificates,
  deleteCertificate,
  getUserCertificates,
  getCertificateById,
  checkEligibility
};