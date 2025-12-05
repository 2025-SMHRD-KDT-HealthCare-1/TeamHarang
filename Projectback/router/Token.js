const jwt = require('jsonwebtoken');
const ACCESS_SECRET = process.env.ACCESS_SECRET || 'ACCESS_SECRET';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'REFRESH_SECRET';

function generateTokens(user) {
  const payload = { user_id: Number(user.user_id), user_name: user.user_name, roles: user.roles };
  return {
    accessToken: jwt.sign(payload, ACCESS_SECRET, { expiresIn: '3h' }),
    refreshToken: jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' }),
  };
}

function verifyAccessToken(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, ACCESS_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

function verifyRefreshToken(refreshToken) {
  return jwt.verify(refreshToken, REFRESH_SECRET);
}

module.exports = { generateTokens, verifyAccessToken, verifyRefreshToken };