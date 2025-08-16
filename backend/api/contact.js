// api/contact.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://frankport.vercel.app'); // allow your frontend origin
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: +process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

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

        res.status(200).json({ success: true, message: 'Message sent successfully!' });
    } catch (err) {
        console.error('Email send error:', err);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
}
