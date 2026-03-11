const express = require('express');
const router = express.Router();
const { getUserById, updateUserProfile, getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUserProfile);

module.exports = router;
