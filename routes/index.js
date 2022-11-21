const express = require('express');
const router = express.Router();
const _CONF = require('../config/index');
const jwt = require('jsonwebtoken');
const userModel = require('../model/user');
const path = require('path');
const Redis = require('../redis/index');
Redis.init();


/* GET home page. */
router.get('/', function (req, res, next) {
    return res.sendFile(path.resolve('index.html'));
});

// Router login
router.post('/login', async function (req, res, next) {
    const { username, password } = req.body;
    if (username === userModel.username && password === userModel.password) {
        // payload
        const user =  {
            id: '21102508',
            username: username,
            role: 'admin',
        };
        // Tạo token và refreshTokens
        const token = jwt.sign(user, _CONF.SECRET, { expiresIn: _CONF.tokenLife });
        const refresh_Tokens = jwt.sign(user, _CONF.SECRET_REFRESH, { expiresIn: _CONF.refreshTokenLife });
        
        const response  = {
            status: true,
            token,
            refreshToken: refresh_Tokens,

        }
        // Update the refresh token and token
        await Redis.setKeyValue(user.id, JSON.stringify(response));

        
        // response client
        return res.json(response);
    }
    return res.status(200).send({
        status: false,
        message: 'Login failed!!!'
    })
})

// Router refresh tokens
router.post('/refresh-token', async function(req, res, next) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(403).send({
            status: false,
            message: 'Refresh token not exists',
        })
    }
    try {
        const payload = jwt.verify(refreshToken, _CONF.SECRET_REFRESH);
        const redis_data = await Redis.getKeyValue(payload.id || 'xxxxx');

        // Check if the refresh token
        if (redis_data && redis_data.refreshToken === refreshToken) {
            // payload
            const user = {
                id: '21102508',
                username: 'admin',
                role: 'admin',
            }
            const refreshToken = jwt.sign(user, _CONF.SECRET_REFRESH, { expiresIn: _CONF.refreshTokenLife });
            const token = jwt.sign(user, _CONF.SECRET, { expiresIn: _CONF.tokenLife});

            const response = {
                status: true,
                token,
                refreshToken
            }
            return res.json(response);
        }
    } catch (error) {
        
    }
    // TODO: Login system
    return res.status(401).send({
        status: false,
        message: 'Please login system',
    })
})

router.post('/logout', async function(req, res, next) {
    const token = req.body.token;
    const refreshToken = req.body.refreshToken;
    try {
        const _token = jwt.verify(token, _CONF.SECRET);
        const _refreshToken = jwt.verify(refreshToken, _CONF.SECRET_REFRESH);

        // Có thể lưu vào Redis ở trạng thái token hết hạn hoặc blacklist
        await Redis.setKeyValue(`bl_${_token.id}`, JSON.stringify({
            status: false,
            token,
            refreshToken
        }));
        return res.json({ status: true, message: 'ok'});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error });
    }
});


module.exports = router;