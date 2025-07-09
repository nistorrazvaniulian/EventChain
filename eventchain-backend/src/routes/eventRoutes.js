const express = require('express');
const router = express.Router();
const {
  createEvent,
  getAllEvents,
  getEventTickets,
  updateEvent,
  deleteEvent,
  getEventById
} = require('../controllers/eventController');
const auth = require('../middleware/verifyManager');
const upload = require('../middleware/uploadMiddleware');

// ✅ Create cu imagine
router.post('/', auth, upload.single('image'), createEvent);

// ✅ Publică
router.get('/', getAllEvents);

// ✅ Privat pentru manager
router.get('/:eventId/tickets', auth, getEventTickets);

// ✅ Update cu suport pentru imagine nouă
router.put('/:eventId', auth, upload.single('image'), updateEvent);

router.get('/:eventId', auth, getEventById);

// ✅ Ștergere
router.delete('/:eventId', auth, deleteEvent);

module.exports = router;
