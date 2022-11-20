const jwt = require('jsonwebtoken');
const _CONF = require('../config/index');

/**
 * Verify token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const verifyToken = (req, res, next) => {
    const token = req.headers['x-auth-token'];
    // Verify and check expried
    try {
        const payload = jwt.verify(token, _CONF.SECRET);
        res.user = payload;
        next();
    } catch (error) {
        // TODO: Check expried
        if (error.name === 'TokenExpiredError') {
            return res.status(200).json({
                code: 401,
                msg: error.message
            });
        }

        return res.status(200).send({
            code: 500,
            message: error
        })
    }
    next();
};

module.exports = {
    verifyToken
}