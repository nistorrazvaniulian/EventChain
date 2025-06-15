const express = require('express');
const router = express.Router();
const {
  validateTicket,
  invalidateTicket,
  //invalidateTicketsForEventIfExpired
} = require('../controllers/ticketController');
const auth = require('../middleware/verifyManager');

router.get('/blockchain/:ticketId/validate', auth, validateTicket);
router.post('/blockchain/:ticketId/invalidate', auth, invalidateTicket);
//router.post('/blockchain/invalidate-expired', auth, invalidateTicketsForEventIfExpired);

module.exports = router;
