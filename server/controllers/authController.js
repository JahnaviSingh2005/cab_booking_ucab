const User = require('../models/User');
const Driver = require('../models/Driver');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: role || 'user'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register a new driver
// @route   POST /api/auth/driver/register
// @access  Public
exports.registerDriver = async (req, res) => {
    try {
        const { name, email, password, phone, licenseNumber, vehicleType, vehicleNumber } = req.body;

        let driverExists = await Driver.findOne({ email });
        if (driverExists) {
            return res.status(400).json({ message: 'Driver already exists' });
        }

        const driver = await Driver.create({
            name,
            email,
            password,
            phone,
            licenseNumber,
            vehicleType,
            vehicleNumber,
            role: 'driver'
        });

        if (driver) {
            res.status(201).json({
                _id: driver._id,
                name: driver.name,
                email: driver.email,
                role: driver.role,
                token: generateToken(driver._id, driver.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid driver data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user/driver & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password, type } = req.body; // type can be 'user' or 'driver' (or we just check both)

        let account = await User.findOne({ email });
        let isDriver = false;

        if (!account) {
            account = await Driver.findOne({ email });
            isDriver = true;
        }

        if (!account) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await account.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            _id: account._id,
            name: account.name,
            email: account.email,
            role: account.role,
            isVerified: isDriver ? account.isVerified : undefined,
            token: generateToken(account._id, account.role),
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user/driver profile
// @route   GET /api/auth/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        let account;
        if (req.user.role === 'driver') {
            account = await Driver.findById(req.user.id).select('-password');
        } else {
            account = await User.findById(req.user.id).select('-password');
        }

        if (account) {
            res.json(account);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
