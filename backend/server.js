// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Contact endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    try {
        // Email transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Send mail
        await transporter.sendMail({
            from: `"${name}" <${email}>`,
            to: process.env.RECEIVER_EMAIL,
            subject,
            html: `
                <h3>New Contact Message</h3>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Subject:</b> ${subject}</p>
                <p><b>Message:</b><br>${message}</p>
            `
        });

        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
