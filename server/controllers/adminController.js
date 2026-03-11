const User = require('../models/User');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const Payment = require('../models/Payment');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalDrivers = await Driver.countDocuments();
        const totalRides = await Ride.countDocuments();

        const payments = await Payment.find({ status: 'success' });
        const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

        res.json({
            totalUsers,
            totalDrivers,
            totalRides,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all rides
// @route   GET /api/admin/rides
// @access  Private (Admin only)
exports.getAllRides = async (req, res) => {
    try {
        const rides = await Ride.find().sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .populate('driverId', 'name email vehicleNumber');
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get unverified drivers
// @route   GET /api/admin/drivers/unverified
// @access  Private (Admin only)
exports.getUnverifiedDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find({ isVerified: false });
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
