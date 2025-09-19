// ==================== /backend/api/notifications.js ====================
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

export default async function handler(req, res) {
    setCorsHeaders(req, res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
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
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}