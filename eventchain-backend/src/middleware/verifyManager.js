const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const verifyManagerJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token lipsă sau invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, keys.jwtSecret);
    if (decoded.role !== 'manager') {
      return res.status(403).json({ error: 'Acces interzis - doar manageri' });
    }

    req.manager = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalid sau expirat' });
  }
};

module.exports = verifyManagerJWT;
