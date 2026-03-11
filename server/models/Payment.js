const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true, enum: ['card', 'wallet', 'upi'] },
    status: { type: String, default: 'pending', enum: ['pending', 'success', 'failed'] },
    receiptUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
