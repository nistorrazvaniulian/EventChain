const express = require('express');
const router = express.Router();
const { createEvent, getAllEvents, getEventTickets, updateEvent, deleteEvent } = require('../controllers/eventController');
const auth = require('../middleware/verifyManager');

router.post('/', auth, createEvent);

router.get('/', getAllEvents);
router.get('/:eventId/tickets', auth, getEventTickets);

router.put('/:eventId', auth, updateEvent);

router.delete('/:eventId', auth, deleteEvent);

module.exports = router;
