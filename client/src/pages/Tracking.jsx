import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Button } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { io } from 'socket.io-client';
import { AuthContext } from '../context/AuthContext';

// Fix for default leaflet icons not showing correctly in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Tracking = () => {
    const { rideId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const socketRef = useRef();

    const [ride, setRide] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchRide = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/rides/${rideId}`, config);
                setRide(data);

                // Set initial driver location if they accepted (placeholder to pickup)
                if (data.status === 'accepted' || data.status === 'ongoing') {
                    // Start somewhere close to pickup if driver has no exact location yet
                    setDriverLocation({ lat: data.pickupLocation.lat + 0.01, lng: data.pickupLocation.lng + 0.01 });
                }
            } catch (err) {
                setError('Failed to fetch ride details');
            }
        };

        fetchRide();

        // Connect Socket
        socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
        socketRef.current.emit('joinRide', rideId);

        socketRef.current.on('locationUpdate', (data) => {
            setDriverLocation({
                lat: data.lat,
                lng: data.lng
            });
        });

        // Optional: listen for status changes
        // socketRef.current.on('statusUpdate', (newStatus) => ... )

        return () => {
            socketRef.current.disconnect();
        };
    }, [rideId, user, navigate]);

    if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
    if (!ride) return <Container className="mt-5">Loading...</Container>;

    const pickup = [ride.pickupLocation.lat, ride.pickupLocation.lng];
    const dropoff = [ride.dropLocation.lat, ride.dropLocation.lng];

    // Calculate center
    const center = [(pickup[0] + dropoff[0]) / 2, (pickup[1] + dropoff[1]) / 2];

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Ride Tracker - {ride.status.toUpperCase()}</h2>

            <Card className="shadow-sm mb-4">
                <Card.Body>
                    <div style={{ height: '400px', width: '100%' }}>
                        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; OpenStreetMap contributors'
                            />

                            {/* Pickup Marker */}
                            <Marker position={pickup}>
                                <Popup>Pickup: {ride.pickupLocation.address}</Popup>
                            </Marker>

                            {/* Dropoff Marker */}
                            <Marker position={dropoff}>
                                <Popup>Dropoff: {ride.dropLocation.address}</Popup>
                            </Marker>

                            {/* Driver Live Marker */}
                            {driverLocation && ride.status !== 'pending' && ride.status !== 'cancelled' && (
                                <Marker position={[driverLocation.lat, driverLocation.lng]}>
                                    <Popup>Your Driver is Here!</Popup>
                                </Marker>
                            )}
                        </MapContainer>
                    </div>
                </Card.Body>
            </Card>

            <Card className="shadow-sm">
                <Card.Body>
                    <h5>Ride Details</h5>
                    <p><strong>Driver:</strong> {ride.driverId ? ride.driverId.name : 'Searching...'}</p>
                    <p><strong>Cab Type:</strong> {ride.cabType}</p>
                    <p><strong>Estimated Fare:</strong> ₹{ride.estimatedFare}</p>

                    {ride.status === 'completed' && (
                        <Button variant="success" className="mt-2" onClick={() => navigate(`/payment/${ride._id}`)}>
                            Proceed to Payment
                        </Button>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Tracking;
