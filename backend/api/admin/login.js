// ==================== /backend/api/admin/login.js ====================
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

export default async function handler(req, res) {
    setCorsHeaders(req, res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
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
    } else {
        res.status(405).json({ success: false, message: 'Method not allowed' });
    }
}