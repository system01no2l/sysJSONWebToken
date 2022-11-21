const jwt = require('jsonwebtoken');
const _CONF = require('../config/index');
const Redis = require('../redis/index');
Redis.init();

/**
 * Verify token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const verifyToken = async (req, res, next) => {
    const token = req.headers['x-auth-token'];
    // Tùy vào nghiệp vụ của hệ thống mà có thể xử lí thêm việc add token nào đó vào blacklist
    // - Cùng một token những được đăng nhập ở 2 địa chỉ IP khác nhau.
    // - Cùng một token những đăng nhập ở 2 thiết bị khác nhau => trust device

    // Verify and check expried
    let payload;
    try {
        payload = jwt.verify(token, _CONF.SECRET);
        res.user = payload;
    } catch (error) {
        // TODO: Check expried
        if (error.name === 'TokenExpiredError') {
            return res.status(200).json({
                code: 401,
                message: error.message
            });
        }

        return res.status(200).send({
            code: 500,
            message: error
        })
    }

    // Check black list
    const inDenyList = await Redis.getKeyValue(`bl_${payload.id}`);
    if (inDenyList && Object.keys(inDenyList).length > 0) {
        return res.status(200).send({
            status: true,
            message: "JWT Rejected",
        });
    }
    next();
};

module.exports = {
    verifyToken
}