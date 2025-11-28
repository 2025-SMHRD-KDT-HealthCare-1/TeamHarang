const express = require('express');

const jwt = require("jsonwebtoken");
const secretKey = "MY_SECRET_KEY"; // 추후 .env 로 이동 추천

// 토큰 생성 함수
function generateToken(user) {
    return jwt.sign(
        {
            user_id: user.user_id,
            user_name: user.user_name,
            roles: user.roles
        },
        secretKey,
        { expiresIn: "1h" }
    );
}

module.exports = { generateToken, secretKey };