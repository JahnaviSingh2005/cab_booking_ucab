const express = require('express');
const router = express.Router();
const { processPayment, getReceipt, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/pay', protect, processPayment);
router.get('/receipt/:rideId', protect, getReceipt);
router.get('/history/:userId', protect, getPaymentHistory);

module.exports = router;
