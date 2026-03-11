import React, { useEffect, useState, useContext } from 'react';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const History = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) { navigate('/login'); return; }
        const fetchHistory = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/rides/user/${user._id}`, config);
                setHistory(data);
            } catch (err) {
                setError('Failed to fetch booking history');
            }
            setLoading(false);
        };
        fetchHistory();
    }, [user, navigate]);

    const getStatusClass = (status) => {
        if (status === 'completed') return 'status-completed';
        if (status === 'cancelled') return 'status-cancelled';
        if (status === 'ongoing') return 'status-ongoing';
        if (status === 'accepted') return 'status-accepted';
        return 'status-pending';
    };

    const getCabIcon = (type) => {
        if (type === 'Premium') return '🏎️';
        if (type === 'Comfort') return '🚙';
        return '🚗';
    };

    return (
        <div style={{ background: '#f6f6f6', minHeight: 'calc(100vh - 68px)', padding: '32px 0 60px' }}>
            <Container>
                <div className="page-header">
                    <h1 className="page-title">Your trips</h1>
                    <p className="page-subtitle">All your past and upcoming rides</p>
                </div>

                {error && <div className="uber-alert uber-alert-danger">{error}</div>}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '80px', color: '#545454' }}>Loading trips...</div>
                ) : history.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '16px', border: '1px solid #ebebeb' }}>
                        <div style={{ fontSize: '56px', marginBottom: '16px' }}>🚖</div>
                        <h3 style={{ fontWeight: 800, fontSize: '20px', marginBottom: '8px' }}>No trips yet</h3>
                        <p style={{ color: '#545454', marginBottom: '24px' }}>Your completed rides will appear here</p>
                        <Link to="/book" style={{ background: '#000', color: '#fff', padding: '12px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>Book your first ride</Link>
                    </div>
                ) : (
                    <div className="uber-card">
                        <table className="uber-table">
                            <thead>
                                <tr>
                                    <th>Trip</th>
                                    <th>Date</th>
                                    <th>Cab</th>
                                    <th>Fare</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(ride => (
                                    <tr key={ride._id}>
                                        <td>
                                            <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                                                {ride.pickupLocation.address}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#545454' }}>
                                                → {ride.dropLocation.address}
                                            </div>
                                        </td>
                                        <td style={{ color: '#545454', fontSize: '13px' }}>
                                            {new Date(ride.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '18px' }}>{getCabIcon(ride.cabType)}</span>
                                            <span style={{ fontSize: '13px', marginLeft: '6px', fontWeight: 500 }}>{ride.cabType}</span>
                                        </td>
                                        <td style={{ fontWeight: 700, fontSize: '15px' }}>₹{ride.actualFare || ride.estimatedFare}</td>
                                        <td>
                                            <span className={`status-badge ${getStatusClass(ride.status)}`}>
                                                {ride.status}
                                            </span>
                                        </td>
                                        <td>
                                            {ride.status === 'completed' && (
                                                <Link to={`/payment/${ride._id}`} style={{ fontSize: '13px', color: '#000', fontWeight: 600, textDecoration: 'none', borderBottom: '1.5px solid #000' }}>
                                                    Receipt
                                                </Link>
                                            )}
                                            {(ride.status === 'accepted' || ride.status === 'ongoing' || ride.status === 'pending') && (
                                                <Link to={`/tracking/${ride._id}`} style={{ fontSize: '13px', color: '#06C167', fontWeight: 600, textDecoration: 'none', borderBottom: '1.5px solid #06C167' }}>
                                                    Track →
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default History;
