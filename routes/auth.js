require('dotenv').config();

const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const { authorization } = req.headers;

    try {
        const decodedToken = jwt.verify(authorization, process.env.SECRET);
        req.auth = decodedToken;
    } catch(e) {
        const authError = new Error('invalid token');
        authError.status = 401;
        return next(authError);
    }

    next();
}

const isAdmin = (req, res, next) => {
    if (!req.auth || req.auth.role !== 'admin') {
        const authError = new Error('not-authorized');
        authError.status = 403;
        return next(authError);
    }

    next();
}


module.exports = {
    isAdmin,
    isAuthenticated
};