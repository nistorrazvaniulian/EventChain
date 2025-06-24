const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/paymentController');
const auth = require('../middleware/verifyUser');

// ✅ Creare sesiune de plată – doar pentru useri autentificați
router.post('/create-checkout-session', auth, createCheckoutSession);

module.exports = router;
