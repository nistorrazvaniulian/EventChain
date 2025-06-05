const express = require('express');
const router = express.Router();

const {
    loginManager,
    createTestManager
} = require('../controllers/managerController');

router.post('/test', createTestManager);
router.post('/login', loginManager);

module.exports = router;