function errorMiddleware(err, req, res, next) {
    console.error(err);

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token'
        });
    }

    if (err.code === 'EREQUEST') {
        return res.status(500).json({
            error: 'Database error'
        });
    }

    return res.status(
        err.status || 500
    ).json({
        error: err.message || 'Internal server error'
    });
}

module.exports = errorMiddleware;