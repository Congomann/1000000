import nodemailer from 'nodemailer';

// Create a transporter using environment variables or a stub for dev
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'test_user',
        pass: process.env.SMTP_PASS || 'test_pass',
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    if (process.env.NODE_ENV === 'test' || !process.env.SMTP_HOST) {
        console.log(`[Email Stub] To: ${to}, Subject: ${subject}`);
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: '"NHFG CRM" <no-reply@nhfg.com>',
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
