const express = require('express');
const router = express.Router();
const { getDrivers, verifyDriver, updateAvailability } = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getDrivers);
router.put('/:id/verify', protect, authorize('admin'), verifyDriver);
router.put('/:id/availability', protect, updateAvailability);

module.exports = router;
