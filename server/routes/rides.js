const express = require('express');
const router = express.Router();
const {
    estimateFare,
    bookRide,
    getPendingRides,
    getUserRides,
    getDriverRides,
    getRideById,
    acceptRide,
    startRide,
    completeRide,
    cancelRide
} = require('../controllers/rideController');
const { protect } = require('../middleware/auth');

router.get('/estimate', protect, estimateFare); // or keep it unprotected if guest estimates are allowed
router.post('/book', protect, bookRide);
router.get('/pending', protect, getPendingRides);
router.get('/user/:userId', protect, getUserRides);
router.get('/driver/:driverId', protect, getDriverRides);
router.get('/:id', protect, getRideById);
router.put('/:id/accept', protect, acceptRide);
router.put('/:id/start', protect, startRide);
router.put('/:id/complete', protect, completeRide);
router.put('/:id/cancel', protect, cancelRide);

module.exports = router;
