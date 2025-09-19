// ==================== /backend/api/notifications/[id]/read.js ====================
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

function readNotifications() {
    try {
        if (!fs.existsSync(notificationsFile)) {
            return { messages: [], lastMessageId: 0 };
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
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}
