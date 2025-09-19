// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Detect environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Contact endpoint (unchanged)
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
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta name="color-scheme" content="dark">
                    <meta name="supported-color-schemes" content="dark">
                </head>
                <body style="margin: 0; padding: 20px; background-color: #0d1117; color: #f0f6fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6;">
                    
                    <div style="max-width: 600px; margin: 0 auto; background-color: #161b22; border: 1px solid #30363d; border-radius: 6px; overflow: hidden;">
                        
                        <!-- Logo Header -->
                        <div style="background-color: #0d1117; padding: 32px 24px; text-align: center; border-bottom: 1px solid #30363d;">
                            <div style="display: inline-block;">
                                <img src="https://frankport.vercel.app/assets/FrankPort.png" alt="FrankPort" width="32" height="32" style="vertical-align: middle; margin-right: 12px; border-radius: 4px;" />
                                <span style="color: #f0f6fc; font-size: 24px; font-weight: 700; vertical-align: middle; letter-spacing: -0.5px;">FrankPort</span>
                            </div>
                        </div>
                        
                        <!-- Content Header -->
                        <div style="background-color: #161b22; padding: 20px 24px; border-bottom: 1px solid #30363d;">
                            <h1 style="margin: 0; color: #f0f6fc; font-size: 20px; font-weight: 600;">New Contact Form Submission</h1>
                            <p style="margin: 4px 0 0 0; color: #8b949e; font-size: 14px;">Received ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        
                        <!-- Content -->
                        <div style="padding: 24px;">
                            
                            <div style="margin-bottom: 20px;">
                                <strong style="color: #f0f6fc;">Name:</strong><br>
                                <span style="color: #e6edf3;">${name ? name.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'Not provided'}</span>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <strong style="color: #f0f6fc;">Email:</strong><br>
                                ${email ? `<a href="mailto:${email}" style="color: #58a6ff; text-decoration: none;">${email.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</a>` : '<span style="color: #e6edf3;">Not provided</span>'}
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <strong style="color: #f0f6fc;">Subject:</strong><br>
                                <span style="color: #e6edf3;">${subject ? subject.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'No subject'}</span>
                            </div>
                            
                            <div style="margin-bottom: 24px;">
                                <strong style="color: #f0f6fc;">Message:</strong><br>
                                <div style="background-color: #0d1117; border: 1px solid #30363d; border-radius: 4px; padding: 16px; margin-top: 8px;">
                                    <pre style="margin: 0; color: #e6edf3; white-space: pre-wrap; word-wrap: break-word; font-family: inherit; font-size: 14px;">${message ? message.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'No message content'}</pre>
                                </div>
                            </div>
                            
                            <!-- Security Notice -->
                            <div style="background-color: #1c2128; border: 1px solid #f85149; border-left: 3px solid #f85149; padding: 16px; border-radius: 4px;">
                                <strong style="color: #f85149;">⚠ Security Notice</strong><br>
                                <span style="color: #e6edf3; font-size: 14px;">This message was submitted via <a href="frankport.vercel.app" style="text-decoration: none;">FrankPort</a> contact form without OTP or Two-Step Authentication. No verification performed. Treat content from ${email ? email.replace(/</g, '&lt;').replace(/>/g, '&gt;') : 'sender'} with caution.</span>
                            </div>
                            
                        </div>
                        
                        <!-- Footer -->
                        <div style="background-color: #0d1117; padding: 20px 24px; border-top: 1px solid #30363d; text-align: center;">
                            <div style="margin-bottom: 12px;">
                                <img src="assets/FrankPort.png" alt="FrankPort" width="20" height="20" style="opacity: 0.6; border-radius: 3px;" />
                            </div>
                            <p style="margin: 0; color: #8b949e; font-size: 12px; line-height: 1.4;">
                                This email was sent by <strong style="color: #f0f6fc;">FrankPort</strong><br>
                                <span style="opacity: 0.7;">Contact form submission system</span>
                            </p>
                        </div>
                        
                    </div>
                    
                </body>
                </html>
        `
        });

        res.json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

// Feedback endpoint (unchanged - keeping your full implementation)
app.post('/api/feedback', async (req, res) => {
    const feedbackData = req.body;

    // Validate that some feedback was provided
    const hasFeedback = (
        feedbackData.overall_rating > 0 ||
        (feedbackData.rating_comment && feedbackData.rating_comment.trim() !== '') ||
        Object.keys(feedbackData.faq_ratings || {}).length > 0 ||
        feedbackData.suggestion_category !== '' ||
        (feedbackData.suggestion_text && feedbackData.suggestion_text.trim() !== '') ||
        (feedbackData.pain_points && feedbackData.pain_points.length > 0) ||
        (feedbackData.pain_point_details && feedbackData.pain_point_details.trim() !== '')
    );

    if (!hasFeedback) {
        return res.status(400).json({ success: false, error: 'No feedback provided' });
    }

    try {
        // Email transporter (reusing your existing config)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Send feedback email (keeping your full HTML template)
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.RECEIVER_EMAIL,
            subject: `Portfolio Feedback ${feedbackData.overall_rating ? `- ${feedbackData.overall_rating}/5 stars` : ''}`,
            html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta name="color-scheme" content="dark">
                <meta name="supported-color-schemes" content="dark">
            </head>
            <body style="margin: 0; padding: 20px; background-color: #0d1117; color: #f0f6fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6;">
                
                <div style="max-width: 600px; margin: 0 auto; background-color: #161b22; border: 1px solid #30363d; border-radius: 6px; overflow: hidden;">
                    
                    <!-- Logo Header -->
                    <div style="background-color: #0d1117; padding: 32px 24px; text-align: center; border-bottom: 1px solid #30363d;">
                        <div style="display: inline-block;">
                            <img src="https://frankport.vercel.app/assets/FrankPort.png" alt="FrankPort" width="32" height="32" style="vertical-align: middle; margin-right: 12px; border-radius: 4px;" />
                            <span style="color: #f0f6fc; font-size: 24px; font-weight: 700; vertical-align: middle; letter-spacing: -0.5px;">FrankPort</span>
                        </div>
                    </div>
                    
                    <!-- Content Header -->
                    <div style="background-color: #161b22; padding: 20px 24px; border-bottom: 1px solid #30363d;">
                        <h1 style="margin: 0; color: #f0f6fc; font-size: 20px; font-weight: 600;"> New Portfolio Feedback Received</h1>
                        <p style="margin: 4px 0 0 0; color: #8b949e; font-size: 14px;">Received ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 24px;">
                        
                        <!-- Overall Rating Section (Only show if rating provided) -->
                        ${feedbackData.overall_rating > 0 ? `
                        <div style="margin-bottom: 24px; background-color: #0d1117; border: 1px solid #30363d; border-left: 3px solid #f4d03f; padding: 16px; border-radius: 4px;">
                            <strong style="color: #f4d03f; font-size: 16px; display: block; margin-bottom: 8px;">⭐ Overall Rating</strong>
                            <div style="color: #e6edf3; margin-bottom: 8px;">
                                <span style="font-size: 24px;">${'⭐'.repeat(feedbackData.overall_rating)}</span>
                                <span style="margin-left: 8px; font-weight: 600;">${feedbackData.overall_rating}/5</span>
                            </div>
                            ${feedbackData.rating_comment ? `
                            <div style="background-color: #1c2128; border: 1px solid #30363d; border-radius: 4px; padding: 12px; margin-top: 8px;">
                                <strong style="color: #f0f6fc; font-size: 14px;">Comment:</strong><br>
                                <span style="color: #e6edf3; font-size: 14px;">${feedbackData.rating_comment.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>
                            </div>
                            ` : ''}
                        </div>
                        ` : ''}
                        
                        <!-- Timestamp -->
                        <div style="background-color: #1c2128; border: 1px solid #30363d; padding: 12px; border-radius: 4px; text-align: center; margin-top: 20px;">
                            <span style="color: #8b949e; font-size: 12px;">
                                📅 Submitted: ${new Date(feedbackData.timestamp || new Date()).toLocaleString()}
                            </span>
                        </div>
                        
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #0d1117; padding: 20px 24px; border-top: 1px solid #30363d; text-align: center;">
                        <div style="margin-bottom: 12px;">
                            <img src="https://frankport.vercel.app/assets/FrankPort.png" alt="FrankPort" width="20" height="20" style="opacity: 0.6; border-radius: 3px;" />
                        </div>
                        <p style="margin: 0; color: #8b949e; font-size: 12px; line-height: 1.4;">
                            This email was sent by <strong style="color: #f0f6fc;">FrankPort</strong><br>
                            <span style="opacity: 0.7;">Portfolio feedback system</span>
                        </p>
                    </div>
                    
                </div>
                
            </body>
            </html>
            `
        });

        res.json({ success: true, message: 'Feedback sent successfully!' });
    } catch (err) {
        console.error('Feedback Error:', err);
        res.status(500).json({ success: false, error: 'Failed to send feedback' });
    }
});

// ==================== HYBRID NOTIFICATION STORAGE ==================== //

// In-memory storage for production (Vercel)
let memoryNotifications = { messages: [], lastMessageId: 0 };

// File storage for development
const dataDir = path.join(__dirname, 'data');
const notificationsFile = path.join(dataDir, 'notifications.json');

// Initialize file storage for development
if (!isProduction) {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
}

function initNotificationsFile() {
    if (!isProduction && !fs.existsSync(notificationsFile)) {
        const initialData = {
            messages: [],
            lastMessageId: 0
        };
        fs.writeFileSync(notificationsFile, JSON.stringify(initialData, null, 2));
    }
}

// Hybrid read function
function readNotifications() {
    try {
        if (isProduction) {
            // Production: use in-memory storage
            return memoryNotifications;
        } else {
            // Development: use file storage
            if (!fs.existsSync(notificationsFile)) {
                initNotificationsFile();
            }
            const data = fs.readFileSync(notificationsFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading notifications:', error);
        return { messages: [], lastMessageId: 0 };
    }
}

// Hybrid write function
function writeNotifications(data) {
    try {
        if (isProduction) {
            // Production: write to memory
            memoryNotifications = data;
            return true;
        } else {
            // Development: write to file
            fs.writeFileSync(notificationsFile, JSON.stringify(data, null, 2));
            return true;
        }
    } catch (error) {
        console.error('Error writing notifications:', error);
        return false;
    }
}

// Initialize on startup
initNotificationsFile();

// ==================== API ENDPOINTS (unchanged) ==================== //

// Get all notifications
app.get('/api/notifications', (req, res) => {
    try {
        const data = readNotifications();
        res.json({
            success: true,
            messages: data.messages,
            count: data.messages.filter(msg => !msg.read).length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve notifications'
        });
    }
});

// Mark notification as read
app.post('/api/notifications/:id/read', (req, res) => {
    try {
        const messageId = parseInt(req.params.id);
        const data = readNotifications();
        
        const message = data.messages.find(msg => msg.id === messageId);
        if (message) {
            message.read = true;
            if (writeNotifications(data)) {
                res.json({ success: true, message: 'Notification marked as read' });
            } else {
                res.status(500).json({ success: false, message: 'Failed to update notification' });
            }
        } else {
            res.status(404).json({ success: false, message: 'Notification not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Admin authentication
app.post('/api/admin/login', (req, res) => {
    try {
        const { password, backupKey } = req.body;
        
        const adminPassword = process.env.ADMIN_PASSWORD || 'demo123';
        const adminBackupKey = process.env.ADMIN_BACKUP_KEY || 'BACKUP2025';
        
        if (password && password === adminPassword) {
            res.json({
                success: true,
                message: 'Authentication successful',
                token: 'admin_authenticated_' + Date.now()
            });
        } else if (backupKey && backupKey === adminBackupKey) {
            res.json({
                success: true,
                message: 'Backup authentication successful',
                token: 'admin_authenticated_' + Date.now()
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Post new message (admin only)
app.post('/api/admin/message', (req, res) => {
    try {
        const { title, content, token } = req.body;
        
        if (!token || !token.startsWith('admin_authenticated_')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }
        
        const data = readNotifications();
        const newMessage = {
            id: ++data.lastMessageId,
            title: title.trim(),
            content: content.trim(),
            timestamp: new Date().toISOString(),
            read: false,
            createdAt: Date.now()
        };
        
        data.messages.unshift(newMessage);
        
        if (writeNotifications(data)) {
            res.json({
                success: true,
                message: 'Message posted successfully',
                data: newMessage
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to save message'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Get messages for admin management
app.get('/api/admin/messages', (req, res) => {
    try {
        const { token } = req.query;
        
        if (!token || !token.startsWith('admin_authenticated_')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        
        const data = readNotifications();
        res.json({
            success: true,
            messages: data.messages
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve messages'
        });
    }
});

// Delete message (admin only)
app.delete('/api/admin/message/:id', (req, res) => {
    try {
        const { token } = req.body;
        const messageId = parseInt(req.params.id);
        
        if (!token || !token.startsWith('admin_authenticated_')) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }
        
        const data = readNotifications();
        const messageIndex = data.messages.findIndex(msg => msg.id === messageId);
        
        if (messageIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }
        
        data.messages.splice(messageIndex, 1);
        
        if (writeNotifications(data)) {
            res.json({
                success: true,
                message: 'Message deleted successfully'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to delete message'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// Serve frontend files (unchanged)
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🔧 Storage mode: ${isProduction ? 'Memory (Production)' : 'File (Development)'}`);
});