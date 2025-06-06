const express = require('express');
const router = express.Router();
const { buyTicket } = require('../controllers/ticketController');
const auth = require('../middleware/auth');

router.post('/:eventId/buy', auth, buyTicket);

module.exports = router;
