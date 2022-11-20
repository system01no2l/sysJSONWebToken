// Chứa dánh sách confir jwt
const config = Object.freeze({
    SECRET:"SECRET_TOKEN", // Mã bí mật của token
    SECRET_REFRESH: "SECRET_REFRESH_TOKEN", // Mã bí mật của refresh token
    tokenLife: '1m', // Thời gian sống của token
    refreshTokenLife: 120 * 1000, // Thời gian sống của refresh token
})

module.exports = config;