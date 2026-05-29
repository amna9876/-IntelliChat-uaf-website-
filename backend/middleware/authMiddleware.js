const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Authentication token required.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        const msg = err.name === 'TokenExpiredError' ? 'Session expired. Please login again.' : 'Invalid token.';
        return res.status(401).json({ success: false, message: msg });
    }
};
