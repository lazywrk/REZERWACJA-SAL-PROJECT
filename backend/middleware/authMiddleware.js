const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    try {
        const auth = req.headers.authorization;

        if (!auth || !auth.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Brak tokenu'
            });
        }

        const token = auth.split(' ')[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
}

module.exports = authMiddleware;