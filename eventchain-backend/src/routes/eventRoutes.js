const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEventTickets } = require('../controllers/eventController');
const auth = require('../middleware/verifyManager');

router.post('/', auth, createEvent);

router.get('/', getAllEvents);
router.get('/:eventId/tickets', auth, getEventTickets);

module.exports = router;
