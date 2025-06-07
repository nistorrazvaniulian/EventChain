const express = require('express');
const router = express.Router();
const auth = require('../middleware/verifyUser');
const verifyUser = require('../middleware/verifyUser');
const { getMyTickets } = require('../controllers/userController');

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

router.get('/my-tickets', verifyUser, getMyTickets);

module.exports = router;