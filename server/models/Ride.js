const mongoose = require('mongoose');

const RideSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    pickupLocation: {
        address: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    dropLocation: {
        address: { type: String, required: true },
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    cabType: { type: String, required: true }, // Economy, Comfort, Premium
    status: { type: String, default: 'pending', enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'] },
    estimatedFare: { type: Number, required: true },
    actualFare: { type: Number },
    estimatedArrival: { type: Number }, // in minutes
    startTime: { type: Date },
    endTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Ride', RideSchema);
