// routes/certificateRoutes.js
const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  downloadCertificate,
  getCertificateStatus,
  listCertificates,
  deleteCertificate,
  getUserCertificates,
  getCertificateById,
  checkEligibility
} = require('../controllers/certificateController');
const { verifyToken } = require('../middleware/authMiddleware');

// @route   POST /api/certificates/generate
// @desc    Generate certificate for top 3 performers
// @access  Private
router.post('/generate', verifyToken, generateCertificate);

// @route   GET /api/certificates/download/:certificateId
// @desc    Download/view certificate PDF
// @access  Public (for sharing)
router.get('/download/:certificateId', downloadCertificate);

// @route   GET /api/certificates/status/:courseId/:userId
// @desc    Get certificate status for a user
// @access  Private
router.get('/status/:courseId/:userId', verifyToken, getCertificateStatus);

// @route   GET /api/certificates/user/:userId
// @desc    Get all certificates for a user
// @access  Private
router.get('/user/:userId', verifyToken, getUserCertificates);

// @route   GET /api/certificates/list
// @desc    List all certificates (admin function)
// @access  Private/Admin
router.get('/list', verifyToken, listCertificates);

// @route   GET /api/certificates/:certificateId
// @desc    Get certificate by ID
// @access  Private
router.get('/:certificateId', verifyToken, getCertificateById);

// @route   DELETE /api/certificates/:filename
// @desc    Delete certificate file (admin function)
// @access  Private/Admin
router.delete('/:filename', verifyToken, deleteCertificate);

// @route   GET /api/certificates/check/:userId/:courseId
// @desc    Check if user is eligible for certificate
// @access  Private
router.get('/check/:userId/:courseId', verifyToken, checkEligibility);

module.exports = router;