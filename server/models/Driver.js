const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DriverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    vehicleType: { type: String, required: true }, // Economy, Comfort, Premium
    vehicleNumber: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: false },
    currentLocation: {
        lat: { type: Number, default: 0 },
        lng: { type: Number, default: 0 }
    },
    role: { type: String, default: 'driver' }
}, { timestamps: true });

DriverSchema.index({ 'currentLocation': '2dsphere' });

DriverSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

DriverSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Driver', DriverSchema);
