const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const { calcDistance, calculateFare } = require('../utils/calcDistance');

// @desc    Estimate Fare
// @route   GET /api/rides/estimate
// @access  Private
exports.estimateFare = async (req, res) => {
    try {
        const { pickupLat, pickupLng, dropLat, dropLng, cabType } = req.query;

        if (!pickupLat || !pickupLng || !dropLat || !dropLng || !cabType) {
            return res.status(400).json({ message: 'Missing parameters for estimation' });
        }

        const distance = calcDistance(
            parseFloat(pickupLat),
            parseFloat(pickupLng),
            parseFloat(dropLat),
            parseFloat(dropLng)
        );

        let finalFare = calculateFare(distance, cabType);

        // Calculate estimated arrival (assume 30 km/h average -> 0.5 km/min)
        const estimatedArrival = Math.round(distance / 0.5) || 1; // at least 1 min

        res.json({
            distance: parseFloat(distance.toFixed(2)),
            estimatedFare: finalFare,
            estimatedArrival,
            cabType
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Book a ride
// @route   POST /api/rides/book
// @access  Private (User only)
exports.bookRide = async (req, res) => {
    try {
        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Only users can book a ride' });
        }

        const { pickupLocation, dropLocation, cabType, estimatedFare, estimatedArrival } = req.body;

        const ride = await Ride.create({
            userId: req.user.id,
            pickupLocation,
            dropLocation,
            cabType,
            estimatedFare,
            estimatedArrival,
            status: 'pending'
        });

        res.status(201).json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all pending rides
// @route   GET /api/rides/pending
// @access  Private (Driver only)
exports.getPendingRides = async (req, res) => {
    try {
        if (req.user.role !== 'driver') return res.status(403).json({ message: 'Only drivers can see pending rides' });

        const rides = await Ride.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user rides
// @route   GET /api/rides/user/:userId
// @access  Private
exports.getUserRides = async (req, res) => {
    try {
        const rides = await Ride.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get driver rides
// @route   GET /api/rides/driver/:driverId
// @access  Private
exports.getDriverRides = async (req, res) => {
    try {
        const rides = await Ride.find({ driverId: req.params.driverId }).sort({ createdAt: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get ride by ID
// @route   GET /api/rides/:id
// @access  Private
exports.getRideById = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id)
            .populate('userId', 'name phone email')
            .populate('driverId', 'name phone vehicleNumber vehicleType');

        if (!ride) return res.status(404).json({ message: 'Ride not found' });
        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Driver accepts a ride
// @route   PUT /api/rides/:id/accept
// @access  Private (Driver only)
exports.acceptRide = async (req, res) => {
    try {
        if (req.user.role !== 'driver') return res.status(403).json({ message: 'Only drivers can accept' });

        const ride = await Ride.findById(req.params.id);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        if (ride.status !== 'pending') {
            return res.status(400).json({ message: 'Ride is no longer available' });
        }

        ride.driverId = req.user.id;
        ride.status = 'accepted';
        await ride.save();

        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Driver starts the ride
// @route   PUT /api/rides/:id/start
// @access  Private (Driver only)
exports.startRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        if (ride.driverId.toString() !== req.user.id) return res.status(403).json({ message: 'Not your ride' });

        ride.status = 'ongoing';
        ride.startTime = Date.now();
        await ride.save();

        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Driver completes the ride
// @route   PUT /api/rides/:id/complete
// @access  Private (Driver only)
exports.completeRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        if (ride.driverId.toString() !== req.user.id) return res.status(403).json({ message: 'Not your ride' });

        ride.status = 'completed';
        ride.endTime = Date.now();
        ride.actualFare = req.body.actualFare || ride.estimatedFare; // Default to estimated if none provided
        await ride.save();

        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel a ride
// @route   PUT /api/rides/:id/cancel
// @access  Private
exports.cancelRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);
        if (!ride) return res.status(404).json({ message: 'Ride not found' });

        // Both driver and user can cancel under some conditions
        ride.status = 'cancelled';
        await ride.save();

        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
