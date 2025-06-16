const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

/**
 * Send an email
 * @param {Object} mailOptions
 * @param {string} mailOptions.to - Recipient email
 * @param {string} mailOptions.subject - Email subject
 * @param {string} mailOptions.text - Plain text body
 * @param {string} [mailOptions.html] - HTML body (optional)
 */
const sendEmail =  ({ to, subject, text, html }) => {
    /*try {
        const info =  transporter.sendMail({
            from: `"Eww" <${process.env.SMTP_USER}>`, // Sender address
            to,
            subject,
            text,
            html
        });
        console.log('Email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }*/
};

module.exports = { sendEmail };
