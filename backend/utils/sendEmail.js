// in backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' or your email provider
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: `LMS Learning <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
    // text: options.message, // You can also send a plain text version
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;