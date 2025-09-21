
// /backend/api/admin.js - Single API file handling all admin endpoints

// Shared memory storage - all functions access the same data
let sharedNotifications = { messages: [], lastMessageId: 0 };

function setCorsHeaders(req, res) {
    const allowedOrigins = [
        'https://frankport.vercel.app',
        'http://localhost:5000',
        'http://127.0.0.1:5000', 
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ];
    
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
}

// Helper functions for notification storage
function readNotifications() {
    return sharedNotifications;
}

function writeNotifications(data) {
    sharedNotifications = data;
    return true;
}

// Route: GET /api/admin?action=notifications
function getNotifications(req, res) {
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
}

// Route: POST /api/admin?action=notifications&id=123&operation=read
function markNotificationRead(req, res) {
    try {
        const { id } = req.query;
        const messageId = parseInt(id);
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
}

// Route: POST /api/admin?action=login
function handleLogin(req, res) {
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
}

// Route: POST /api/admin?action=message
function postMessage(req, res) {
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
}

// Route: GET /api/admin?action=messages&token=xxx
function getMessages(req, res) {
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
}

// Route: DELETE /api/admin?action=message&id=123
function deleteMessage(req, res) {
    try {
        const { id } = req.query;
        const { token } = req.body;
        const messageId = parseInt(id);
        
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
}

// Main handler function - routes all requests
export default async function handler(req, res) {
    setCorsHeaders(req, res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { action, operation } = req.query;

    try {
        // Route: GET /api/admin?action=notifications
        if (req.method === 'GET' && action === 'notifications') {
            return getNotifications(req, res);
        }

        // Route: POST /api/admin?action=notifications&id=123&operation=read
        if (req.method === 'POST' && action === 'notifications' && operation === 'read') {
            return markNotificationRead(req, res);
        }

        // Route: POST /api/admin?action=login
        if (req.method === 'POST' && action === 'login') {
            return handleLogin(req, res);
        }

        // Route: POST /api/admin?action=message
        if (req.method === 'POST' && action === 'message') {
            return postMessage(req, res);
        }

        // Route: GET /api/admin?action=messages&token=xxx
        if (req.method === 'GET' && action === 'messages') {
            return getMessages(req, res);
        }

        // Route: DELETE /api/admin?action=message&id=123
        if (req.method === 'DELETE' && action === 'message') {
            return deleteMessage(req, res);
        }

        // No matching route
        res.status(404).json({
            success: false,
            message: 'Endpoint not found'
        });

    } catch (error) {
        console.error('Admin API Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}