const express = require('express');
const router = express.Router();
const { buyTicket,
  getTicketFromBlockchain,
  checkOwnershipOnBlockchain,
   } = require('../controllers/ticketController');
const auth = require('../middleware/verifyUser');

router.post('/:eventId/buy', auth, buyTicket);
router.get('/blockchain/:ticketId', auth, getTicketFromBlockchain);
router.get('/ownership/:ticketId', auth, checkOwnershipOnBlockchain);

module.exports = router;
