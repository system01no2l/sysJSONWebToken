const express = require('express');
const router = express.Router();
const _CONF = require('../config/index');
const jwt = require('jsonwebtoken');
const userModel = require('../model/user');
const path = require('path');

const refreshTokens = {} ; //=> Chứa danh sách refreshTokens

/* GET home page. */
router.get('/', function (req, res, next) {
    return res.sendFile(path.resolve('index.html'));
});

// Router login
router.post('/login', function (req, res, next) {
    const { username, password } = req.body;
    if (username === userModel.username && password === userModel.password) {
        // payload
        const user =  {
            id: 'xxxxx',
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
        refreshTokens[refresh_Tokens] = response;
        
        // response client
        return res.json(response);
    }
    return res.status(200).send({
        status: false,
        message: 'Login failed!!!'
    })
})

// Router refresh tokens
router.post('/refresh-token', function(req, res, next) {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(403).send({
            status: false,
            message: 'Refresh token not exists',
        })
    }
    // Check if the refresh token
    if (refreshToken && refreshTokens[refreshToken]) {
        // payload
        const user = {
            id: 'xxxxx',
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
        // TODO: Update token and refresh token
        refreshTokens[refreshToken] = response;

        return res.json(response);
    }
    // TODO: Login system
    return res.status(401).send({
        status: false,
        message: 'Please login system',
    })
})

module.exports = router;