const express = require('express');
const router = express.Router();
const {
  validateTicket,
  invalidateTicketByManager
} = require('../controllers/ticketController');
const auth = require('../middleware/verifyManager');

router.get('/blockchain/:ticketId/validate', auth, validateTicket);
router.post('/blockchain/:ticketId/invalidate', auth, invalidateTicketByManager);

module.exports = router;
