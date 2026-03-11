const Driver = require('../models/Driver');

exports.getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find().select('-password');
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyDriver = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });
        driver.isVerified = true;
        await driver.save();
        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAvailability = async (req, res) => {
    try {
        if (req.user.id !== req.params.id) return res.status(403).json({ message: 'Not authorized' });
        const driver = await Driver.findById(req.params.id);
        driver.isAvailable = req.body.isAvailable;
        await driver.save();
        res.json(driver);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
