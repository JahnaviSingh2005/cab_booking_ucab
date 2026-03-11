const express = require('express');
const router = express.Router();
const { registerUser, registerDriver, login, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/driver/register', registerDriver);
router.post('/login', login);
router.get('/profile', protect, getProfile);

module.exports = router;
