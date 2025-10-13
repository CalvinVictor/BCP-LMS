const nodemailer = require('nodemailer');

// This function configures and sends an email.
const sendEmail = async (options) => {
    // 1. Create a transporter object using your email service credentials
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // Use 'true' for port 465, 'false' for others like 587
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // 2. Define the email options
    const mailOptions = {
        from: `SJU Courses <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message, // We'll send an HTML-formatted email
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
