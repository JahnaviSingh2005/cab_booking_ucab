const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllRides, getUnverifiedDrivers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/dashboard', protect, authorize('admin'), getDashboardStats);
router.get('/rides', protect, authorize('admin'), getAllRides);
router.get('/drivers/unverified', protect, authorize('admin'), getUnverifiedDrivers);

module.exports = router;
