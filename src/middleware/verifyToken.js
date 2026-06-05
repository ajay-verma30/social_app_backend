const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ 
                success: false, 
                message: "Access Denied. No token provided." 
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
        
    } catch(err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Access Token Expired",
                isExpired: true 
            });
        }

        console.error("Token Verification Error:", err.message);
        return res.status(403).json({ 
            success: false, 
            message: "Invalid Token" 
        });    
    }
}

module.exports = verifyToken;