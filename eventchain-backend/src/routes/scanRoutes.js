const express = require('express');
const router = express.Router();
const {
  invalidateTicketByManager,
  validateTicket
} = require('../controllers/ticketController');
const verifyManager = require('../middleware/verifyManager');

router.get('/:ticketId/status', verifyManager, validateTicket);
router.post('/:ticketId/invalidate', verifyManager, invalidateTicketByManager);

module.exports = router;
