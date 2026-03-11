import React, { useEffect, useState, useContext, useRef } from 'react';
import { Container, Card, Button, Badge, Alert } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { io } from 'socket.io-client';

const DriverDashboard = () => {
    const { user } = useContext(AuthContext);
    const [rides, setRides] = useState([]);
    const [activeRide, setActiveRide] = useState(null);
    const [pendingRides, setPendingRides] = useState([]);
    const [error, setError] = useState('');
    const socketRef = useRef();
    const intervalRef = useRef(); // To mimic GPS sensor updates

    useEffect(() => {
        if (user && user.role === 'driver') {
            fetchRides();
            fetchPendingRides();
            // Connect to socket just in case
            socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

            return () => {
                if (socketRef.current) socketRef.current.disconnect();
                if (intervalRef.current) clearInterval(intervalRef.current);
            };
        }
    }, [user]);

    const fetchPendingRides = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/rides/pending`, config);
            setPendingRides(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRides = async () => {
        try {
            // Ideally, driver sees "pending" rides near them. 
            // For now, let's just fetch all rides where driverId is null, or this driver
            // Wait, we API logic for this? Let's just fetch all unaccepted rides from a new endpoint
            // Wait, our backend doesn't have an endpoint for ALL pending rides, only driver rides...
            // So let's fetch this driver's accepted/ongoing rides first:
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/rides/driver/${user._id}`, config);

            // Check if there is an active ride
            const active = data.find(r => r.status === 'accepted' || r.status === 'ongoing');
            if (active) {
                setActiveRide(active);
                if (active.status === 'ongoing') startLocationBroadcast(active._id);
            }
            setRides(data);
        } catch (err) {
            setError('Failed to fetch rides');
        }
    };

    // --- Actions ---
    // Note: Since we don't have a "GET ALL PENDING" endpoint yet, you might need to test accepting explicitly via postman,
    // OR just display a mock button to accept a "test" ride. 

    const startRide = async (rideId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/rides/${rideId}/start`, {}, config);
            setActiveRide(data);
            startLocationBroadcast(rideId, data);
        } catch (err) {
            setError('Could not start ride');
        }
    };

    const acceptRide = async (rideId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/rides/${rideId}/accept`, {}, config);
            setActiveRide(data);
            fetchPendingRides();
        } catch (err) {
            setError('Could not accept ride');
        }
    };

    const completeRide = async (rideId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/rides/${rideId}/complete`, {}, config);
            setActiveRide(null);
            if (intervalRef.current) clearInterval(intervalRef.current);
            fetchRides();
            fetchPendingRides();
        } catch (err) {
            setError('Could not complete ride');
        }
    };

    const startLocationBroadcast = (rideId, rideData = activeRide) => {
        if (!socketRef.current || !rideData) return;

        let currentLat = rideData.pickupLocation.lat;
        let currentLng = rideData.pickupLocation.lng;

        // Simulate driving towards dropoff
        intervalRef.current = setInterval(() => {
            currentLat += 0.001; // Fake GPS movement
            currentLng += 0.001;

            socketRef.current.emit('driverLocationUpdate', {
                rideId,
                lat: currentLat,
                lng: currentLng
            });
        }, 5000); // Broadcast every 5s
    };

    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'driver') return <Navigate to="/dashboard" />;

    return (
        <Container className="mt-4">
            <h2>Driver Dashboard</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            {activeRide ? (
                <Card className="shadow-sm border-primary mt-4">
                    <Card.Body>
                        <Card.Title>Current Active Ride</Card.Title>
                        <p>Status: <Badge bg={activeRide.status === 'ongoing' ? 'success' : 'warning'}>{activeRide.status.toUpperCase()}</Badge></p>
                        <p><strong>Pickup:</strong> {activeRide.pickupLocation.address}</p>
                        <p><strong>Dropoff:</strong> {activeRide.dropLocation.address}</p>

                        {activeRide.status === 'accepted' && (
                            <Button variant="success" onClick={() => startRide(activeRide._id)}>Start Ride</Button>
                        )}
                        {activeRide.status === 'ongoing' && (
                            <div>
                                <Alert variant="info" className="mt-2">Location is currently broadcasting to user...</Alert>
                                <Button variant="danger" onClick={() => completeRide(activeRide._id)}>Complete Ride</Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            ) : (
                <div className="mt-4">
                    <h4>Available Pending Rides</h4>
                    {pendingRides.length === 0 ? <p>No active rides available at the moment. Look out for incoming requests!</p> : null}
                    {pendingRides.map(pr => (
                        <Card key={pr._id} className="mb-3 border-info shadow-sm">
                            <Card.Body>
                                <p><strong>Pickup:</strong> {pr.pickupLocation.address}</p>
                                <p><strong>Dropoff:</strong> {pr.dropLocation.address}</p>
                                <p><strong>Fare:</strong> ₹{pr.estimatedFare} | <strong>Distance:</strong> {pr.estimatedArrival} mins</p>
                                <Button variant="primary" onClick={() => acceptRide(pr._id)}>Accept Ride</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}

            <h4 className="mt-5">Your Driving History</h4>
            {rides.filter(r => r.status === 'completed' || r.status === 'cancelled').map(r => (
                <Card key={r._id} className="mb-2">
                    <Card.Body>
                        <div>Date: {new Date(r.createdAt).toLocaleDateString()}</div>
                        <div>Fare: ₹{r.actualFare || r.estimatedFare}</div>
                    </Card.Body>
                </Card>
            ))}
        </Container>
    );
};

export default DriverDashboard;
