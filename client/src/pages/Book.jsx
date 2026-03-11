import React, { useState, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CAB_TYPES = [
    { id: 'Economy', icon: '🚗', name: 'Economy', desc: 'Affordable, everyday rides', multiplier: 1 },
    { id: 'Comfort', icon: '🚙', name: 'Comfort', desc: 'Newer cars with extra space', multiplier: 1.5 },
    { id: 'Premium', icon: '🏎️', name: 'Premium', desc: 'Luxury vehicles & top drivers', multiplier: 2 },
];

const Book = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [pickupLat, setPickupLat] = useState('28.7041');
    const [pickupLng, setPickupLng] = useState('77.1025');
    const [dropLat, setDropLat] = useState('28.5355');
    const [dropLng, setDropLng] = useState('77.3910');
    const [pickupAddr, setPickupAddr] = useState('');
    const [dropAddr, setDropAddr] = useState('');
    const [cabType, setCabType] = useState('Economy');
    const [estimate, setEstimate] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);

    const handleEstimate = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setEstimate(null);

        try {
            let pLat = pickupLat, pLng = pickupLng;
            if (pickupAddr) {
                const pRes = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickupAddr)}`);
                if (pRes.data?.length > 0) { pLat = pRes.data[0].lat; pLng = pRes.data[0].lon; setPickupLat(pLat); setPickupLng(pLng); }
                else throw new Error('Could not find pickup location. Be more specific.');
            }

            let dLat = dropLat, dLng = dropLng;
            if (dropAddr) {
                const dRes = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropAddr)}`);
                if (dRes.data?.length > 0) { dLat = dRes.data[0].lat; dLng = dRes.data[0].lon; setDropLat(dLat); setDropLng(dLng); }
                else throw new Error('Could not find drop-off location. Be more specific.');
            }

            const config = { headers: { Authorization: `Bearer ${user?.token}` }, params: { pickupLat: pLat, pickupLng: pLng, dropLat: dLat, dropLng: dLng, cabType } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/rides/estimate`, config);
            setEstimate(data);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error calculating estimate');
        }
        setLoading(false);
    };

    const handleBook = async () => {
        if (!estimate) return;
        setBooking(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = {
                pickupLocation: { address: pickupAddr || 'Pickup', lat: parseFloat(pickupLat), lng: parseFloat(pickupLng) },
                dropLocation: { address: dropAddr || 'Drop-off', lat: parseFloat(dropLat), lng: parseFloat(dropLng) },
                cabType, estimatedFare: estimate.estimatedFare, estimatedArrival: estimate.estimatedArrival
            };
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/rides/book`, payload, config);
            navigate(`/tracking/${data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        }
        setBooking(false);
    };

    return (
        <div style={{ background: '#f6f6f6', minHeight: 'calc(100vh - 68px)', padding: '32px 0 60px' }}>
            <Container>
                <div className="page-header">
                    <h1 className="page-title">Book a ride</h1>
                    <p className="page-subtitle">Enter your destination and select a ride type</p>
                </div>

                <Row>
                    {/* Left: Booking Form */}
                    <Col lg={5} className="mb-4">
                        <div className="uber-card">
                            <form onSubmit={handleEstimate}>
                                <div className="uber-card-body">
                                    {error && <div className="uber-alert uber-alert-danger">{error}</div>}

                                    {/* Location Inputs */}
                                    <div style={{ background: '#f6f6f6', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#000', marginRight: '12px', flexShrink: 0 }} />
                                            <input
                                                className="uber-form-control"
                                                type="text"
                                                placeholder="Pickup location (e.g. Connaught Place, Delhi)"
                                                value={pickupAddr}
                                                onChange={e => setPickupAddr(e.target.value)}
                                                style={{ border: 'none', background: 'transparent', padding: '8px 0', fontWeight: 500 }}
                                                required
                                            />
                                        </div>
                                        <div style={{ height: '1px', background: '#ddd', margin: '8px 0 8px 22px' }} />
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#06C167', marginRight: '12px', flexShrink: 0 }} />
                                            <input
                                                className="uber-form-control"
                                                type="text"
                                                placeholder="Drop-off location (e.g. Sector 18, Noida)"
                                                value={dropAddr}
                                                onChange={e => setDropAddr(e.target.value)}
                                                style={{ border: 'none', background: 'transparent', padding: '8px 0', fontWeight: 500 }}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Cab Type Selector */}
                                    <div className="uber-form-group">
                                        <label className="uber-form-label">Choose ride type</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {CAB_TYPES.map(cab => (
                                                <div
                                                    key={cab.id}
                                                    onClick={() => setCabType(cab.id)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '16px',
                                                        padding: '14px 16px', borderRadius: '12px', cursor: 'pointer',
                                                        border: cabType === cab.id ? '2px solid #000' : '1.5px solid #ebebeb',
                                                        background: cabType === cab.id ? '#f6f6f6' : '#fff',
                                                        transition: 'all 0.15s',
                                                        boxShadow: cabType === cab.id ? '0 0 0 3px rgba(0,0,0,0.06)' : 'none'
                                                    }}
                                                >
                                                    <span style={{ fontSize: '26px' }}>{cab.icon}</span>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 700, fontSize: '14px' }}>{cab.name}</div>
                                                        <div style={{ fontSize: '12px', color: '#545454' }}>{cab.desc}</div>
                                                    </div>
                                                    {cabType === cab.id && <span style={{ color: '#06C167', fontWeight: 700, fontSize: '18px' }}>✓</span>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button type="submit" disabled={loading} style={{
                                        width: '100%', padding: '15px', background: '#000', color: '#fff', border: 'none',
                                        borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', marginTop: '8px',
                                        opacity: loading ? 0.7 : 1
                                    }}>
                                        {loading ? 'Calculating route...' : 'See prices →'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Col>

                    {/* Right: Estimate Result */}
                    <Col lg={7}>
                        {!estimate && !loading && (
                            <div style={{ background: '#000', borderRadius: '16px', padding: '40px', color: 'white', textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ fontSize: '56px', marginBottom: '16px' }}>🗺️</div>
                                <h3 style={{ fontWeight: 800, fontSize: '22px', marginBottom: '8px' }}>Enter your destination</h3>
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>We'll show you the route, fare, and ETA</p>
                            </div>
                        )}

                        {loading && (
                            <div style={{ background: '#fff', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '1px solid #ebebeb' }}>
                                <div style={{ fontSize: '40px', marginBottom: '16px', animation: 'spin 1s linear infinite' }}>⏳</div>
                                <p style={{ fontWeight: 600, fontSize: '16px' }}>Finding best routes & prices...</p>
                            </div>
                        )}

                        {estimate && (
                            <div className="estimate-result">
                                <div className="estimate-header">
                                    <div style={{ fontSize: '13px', fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{cabType} · Estimated fare</div>
                                    <div className="estimate-fare">₹{estimate.estimatedFare}</div>
                                    <div style={{ fontSize: '14px', opacity: 0.6, marginTop: '4px' }}>
                                        {pickupAddr || 'Pickup'} → {dropAddr || 'Drop-off'}
                                    </div>
                                </div>
                                <div className="estimate-body">
                                    <div className="estimate-row">
                                        <span className="estimate-row-label">📍 Distance</span>
                                        <span className="estimate-row-value">{estimate.distance} km</span>
                                    </div>
                                    <div className="estimate-row">
                                        <span className="estimate-row-label">⏱️ Estimated arrival</span>
                                        <span className="estimate-row-value">{estimate.estimatedArrival} mins away</span>
                                    </div>
                                    <div className="estimate-row">
                                        <span className="estimate-row-label">🚗 Ride type</span>
                                        <span className="estimate-row-value">{estimate.cabType}</span>
                                    </div>

                                    <button onClick={handleBook} disabled={booking} style={{
                                        width: '100%', padding: '16px', background: '#06C167', color: '#fff', border: 'none',
                                        borderRadius: '8px', fontSize: '16px', fontWeight: 700, cursor: 'pointer',
                                        marginTop: '16px', transition: 'all 0.2s', opacity: booking ? 0.7 : 1
                                    }}>
                                        {booking ? 'Booking...' : `Confirm ${cabType} · ₹${estimate.estimatedFare}`}
                                    </button>
                                    <p style={{ textAlign: 'center', fontSize: '12px', color: '#545454', marginTop: '12px' }}>
                                        Price may vary based on actual route and traffic
                                    </p>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Book;
