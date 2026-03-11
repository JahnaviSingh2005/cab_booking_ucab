const calcDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degree) => degree * (Math.PI / 180);

    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

const calculateFare = (distance, cabType) => {
    // Base fare rates
    // Economy: ₹10/km + ₹50 base
    // Comfort: ₹15/km + ₹80 base
    // Premium: ₹20/km + ₹120 base

    let base = 50;
    let ratePerKm = 10;

    if (cabType === 'Comfort') {
        base = 80;
        ratePerKm = 15;
    } else if (cabType === 'Premium') {
        base = 120;
        ratePerKm = 20;
    }

    return Math.round(base + (distance * ratePerKm));
};

module.exports = { calcDistance, calculateFare };
