const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents } = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.post('/', auth, createEvent);

router.get('/', getAllEvents);

module.exports = router;
