const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {
  googleLogin
} = require('../controllers/userController');

router.post('/google-login', googleLogin);

router.get('/protected', auth, (req, res) => {
  res.json({
    message: 'Acces autorizat',
    user: req.user
  });
});

module.exports = router;