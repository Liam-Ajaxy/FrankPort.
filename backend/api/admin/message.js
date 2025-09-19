// ==================== /backend/api/admin/message.js ====================
import fs from 'fs';
import path from 'path';

const dataDir = '/tmp';
const notificationsFile = path.join(dataDir, 'notifications.json');

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

function initNotificationsFile() {
    if (!fs.existsSync(notificationsFile)) {
        const initialData = {
            messages: [],
            lastMessageId: 0
        };
        fs.writeFileSync(notificationsFile, JSON.stringify(initialData, null, 2));
    }
}

function readNotifications() {
    try {
        if (!fs.existsSync(notificationsFile)) {
            initNotificationsFile();
        }
        const data = fs.readFileSync(notificationsFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading notifications:', error);
        return { messages: [], lastMessageId: 0 };
    }
}

function writeNotifications(data) {
    try {
        fs.writeFileSync(notificationsFile, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing notifications:', error);
        return false;
    }
}

export default async function handler(req, res) {
    setCorsHeaders(req, res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
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
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
