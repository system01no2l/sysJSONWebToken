// Chứa dánh sách confir jwt
const config = Object.freeze({
    SECRET:"SECRET_TOKEN", // Mã bí mật của token => process.env.SECRET
    SECRET_REFRESH: "SECRET_REFRESH_TOKEN", // Mã bí mật của refresh token => process.env.SECRET_REFRESH
    tokenLife: '60s', // Thời gian sống của token
    refreshTokenLife: '360s', // Thời gian sống của refresh token
})

module.exports = config;