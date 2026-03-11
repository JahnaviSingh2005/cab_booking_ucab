const Payment = require('../models/Payment');
const Ride = require('../models/Ride');

// @desc    Process payment
// @route   POST /api/payments/pay
// @access  Private
exports.processPayment = async (req, res) => {
    try {
        const { rideId, method, donation = 0, refreshments = 0 } = req.body;

        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        if (ride.status !== 'completed') {
            return res.status(400).json({ message: 'Ride must be completed to process payment' });
        }

        // Calculate final amount
        const finalAmount = (ride.actualFare || ride.estimatedFare) + donation + refreshments;

        // Mock payment processing success
        const payment = await Payment.create({
            rideId: ride._id,
            userId: req.user.id,
            amount: finalAmount,
            method,
            status: 'success',
            receiptUrl: `/receipts/${ride._id}-${Date.now()}.pdf` // Mock url
        });

        res.status(201).json({
            message: 'Payment successful',
            payment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get receipt
// @route   GET /api/payments/receipt/:rideId
// @access  Private
exports.getReceipt = async (req, res) => {
    try {
        const payment = await Payment.findOne({ rideId: req.params.rideId })
            .populate({ path: 'rideId', populate: { path: 'driverId user' } });

        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user payment history
// @route   GET /api/payments/history/:userId
// @access  Private
exports.getPaymentHistory = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const payments = await Payment.find({ userId: req.params.userId }).sort({ createdAt: -1 }).populate('rideId');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
