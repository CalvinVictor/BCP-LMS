const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const Course = require('../models/course');

const generateCertificatePDF = async (certificateData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const { userName, courseId, rank, score, certificateId, issuedDate } = certificateData;

      // Fetch course details
      let courseName = 'Course';
      try {
        const course = await Course.findById(courseId);
        courseName = course ? (course.title || course.name || 'Course') : 'Course';
      } catch (error) {
        console.warn('Could not fetch course details:', error);
      }

      // Ensure directory exists
      const certificatesDir = path.join(__dirname, '../uploads/certificates');
      if (!fs.existsSync(certificatesDir)) {
        fs.mkdirSync(certificatesDir, { recursive: true });
      }

      const filename = `certificate_${certificateId}.pdf`;
      const filepath = path.join(certificatesDir, filename);

      doc.pipe(fs.createWriteStream(filepath));

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Background: clean white
      doc.rect(0, 0, pageWidth, pageHeight).fill('#ffffff');

      // Thin border
      doc.lineWidth(2)
         .strokeColor('#d1d5db') // light gray border
         .rect(40, 40, pageWidth - 80, pageHeight - 80)
         .stroke();

      // Header: LMS Academy logo placeholder (you can replace with actual image)
      // doc.image('path/to/logo.png', 50, 50, { width: 100 });

      // Certificate title
      doc.fillColor('#111827') // dark gray
         .font('Helvetica-Bold')
         .fontSize(36)
         .text('Certificate of Completion', 0, 90, { align: 'center' });

      // Subtitle
      doc.font('Helvetica')
         .fontSize(18)
         .fillColor('#374151') // medium gray
         .text('This is to certify that', 0, 140, { align: 'center' });

      // Recipient name
      doc.font('Helvetica-Bold')
         .fontSize(32)
         .fillColor('#111827')
         .text(userName, 0, 180, { align: 'center' });

      // Decorative underline below name
      const nameWidth = doc.widthOfString(userName);
      const nameStartX = (pageWidth - nameWidth) / 2;
      doc.moveTo(nameStartX, 220)
         .lineTo(nameStartX + nameWidth, 220)
         .lineWidth(1.5)
         .strokeColor('#2563eb') // blue
         .stroke();

      // Text about achievement
      doc.font('Helvetica')
         .fontSize(18)
         .fillColor('#374151')
         .text('has successfully completed the course', 0, 240, { align: 'center' });

      // Course name in bold
      doc.font('Helvetica-Bold')
         .fontSize(24)
         .fillColor('#1e40af') // darker blue
         .text(courseName, 0, 275, { align: 'center' });

      // Additional achievement details
      doc.font('Helvetica')
         .fontSize(16)
         .fillColor('#4b5563') // gray
         .text(`with a score of ${score} points and achieved the ${getRankText(rank)} position.`, 0, 310, { align: 'center' });

      // Date and certificate ID at bottom left and right
      const bottomY = pageHeight - 100;

      // Date box
      doc.font('Helvetica')
         .fontSize(12)
         .fillColor('#6b7280') // gray
         .text('Date of Issue:', 60, bottomY);

      doc.font('Helvetica-Bold')
         .fontSize(14)
         .fillColor('#111827')
         .text(moment(issuedDate).format('MMMM Do, YYYY'), 60, bottomY + 18);

      // Certificate ID box
      doc.font('Helvetica')
         .fontSize(12)
         .fillColor('#6b7280')
         .text('Certificate ID:', pageWidth - 220, bottomY);

      doc.font('Helvetica-Bold')
         .fontSize(14)
         .fillColor('#111827')
         .text(certificateId, pageWidth - 220, bottomY + 14);

      // Signature line and text bottom center
      const sigLineXStart = pageWidth / 2 - 100;
      const sigLineXEnd = pageWidth / 2 + 100;
      const sigLineY = bottomY + 10;

      doc.moveTo(sigLineXStart, sigLineY)
         .lineTo(sigLineXEnd, sigLineY)
         .lineWidth(1)
         .strokeColor('#9ca3af') // light gray
         .stroke();

      doc.font('Helvetica')
         .fontSize(12)
         .fillColor('#6b7280')
         .text('Director, LMS Academy', sigLineXStart, sigLineY + 15, { width: 200, align: 'center' });

      // Optional: subtle watermark text in background
      doc.font('Helvetica-Bold')
         .fontSize(120)
         .fillColor('#e0e7ff') // very light blue
         .opacity(0.1)
         .rotate(-45, { origin: [pageWidth / 2, pageHeight / 2] })
         .text('LMS', pageWidth / 2 - 150, pageHeight / 2 - 60, { align: 'center' })
         .opacity(1)
         .rotate(45, { origin: [pageWidth / 2, pageHeight / 2] }); // reset rotation

      doc.end();

      doc.on('end', () => {
        resolve(filepath);
      });

    } catch (error) {
      reject(error);
    }
  });
};

const getRankText = (rank) => {
  switch (rank) {
    case 1: return '1st';
    case 2: return '2nd';
    case 3: return '3rd';
    default: return `${rank}th`;
  }
};

module.exports = { generateCertificatePDF };
