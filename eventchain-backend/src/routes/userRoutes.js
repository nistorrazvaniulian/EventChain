const express = require('express');
const router = express.Router();

const {
  createTestUser,
  googleLogin
} = require('../controllers/userController');

router.post('/test', createTestUser);
router.post('/google-login', googleLogin);

module.exports = router;