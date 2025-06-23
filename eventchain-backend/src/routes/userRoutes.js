const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser');
const { getMyTickets, googleOAuthCallback } = require('../controllers/userController');

// 🔒 Rută protejată
router.get('/protected', verifyUser, (req, res) => {
  res.json({
    message: 'Acces autorizat',
    user: req.user
  });
});

// 🎟️ Biletele utilizatorului
router.get('/my-tickets', verifyUser, getMyTickets);

// 🔁 Google OAuth 2.0 (authorization_code flow)
router.get('/google/callback', googleOAuthCallback);

module.exports = router;
