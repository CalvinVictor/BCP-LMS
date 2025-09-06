const express = require('express');
const router = express.Router();
const Certificate = require('../models/certificate');

// @route   GET /api/certificates/verify/:verificationCode
// @desc    Fetch a certificate's details for public verification
// @access  Public
router.get('/verify/:verificationCode', async (req, res) => {
    try {
        const { verificationCode } = req.params;

        const certificate = await Certificate.findOne({ verificationCode })
            .populate('student', 'username') // Get the student's name
            .populate('course', 'title');   // Get the course title

        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found or invalid.' });
        }

        // Send back the necessary data to display the certificate
        res.json(certificate);

    } catch (err) {
        console.error("Error verifying certificate:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;