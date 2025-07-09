const express = require('express');
const router = express.Router();
const auth = require('../middleware/verifyManager');

const {
    loginManager,
    createTestManager
} = require('../controllers/managerController');

const { getEventsByManager } = require('../controllers/eventController');

router.post('/test', createTestManager);
router.post('/login', loginManager);

router.get('/protected', auth, (req, res) => {
  res.json({
    message: 'Acces autorizat pentru manager',
    user: req.user
  });
});

router.get('/events', auth, getEventsByManager);

module.exports = router;