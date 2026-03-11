import React, { useEffect, useState, useContext } from 'react';
import { Container, Card, Row, Col, Table, Button, Badge, Alert } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [unverifiedDrivers, setUnverifiedDrivers] = useState([]);
    const [rides, setRides] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user && user.role === 'admin') {
            fetchStats();
            fetchUnverifiedDrivers();
            fetchRides();
        }
    }, [user]);

    const fetchStats = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/dashboard`, config);
            setStats(data);
        } catch (err) {
            setError('Failed to fetch stats');
        }
    };

    const fetchUnverifiedDrivers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/drivers/unverified`, config);
            setUnverifiedDrivers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchRides = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/rides`, config);
            setRides(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerifyDriver = async (driverId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/drivers/${driverId}/verify`, {}, config);
            fetchUnverifiedDrivers();
            fetchStats(); // Update stats
        } catch (err) {
            setError('Failed to verify driver');
        }
    };

    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'admin') return <Navigate to="/dashboard" />;

    return (
        <Container className="mt-4">
            <h2 className="mb-4">Admin Dashboard</h2>
            {error && <Alert variant="danger">{error}</Alert>}

            {stats && (
                <Row className="mb-4">
                    <Col md={3}>
                        <Card className="text-center shadow-sm">
                            <Card.Body>
                                <Card.Title>Total Users</Card.Title>
                                <h3>{stats.totalUsers}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm">
                            <Card.Body>
                                <Card.Title>Total Drivers</Card.Title>
                                <h3>{stats.totalDrivers}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm">
                            <Card.Body>
                                <Card.Title>Total Rides</Card.Title>
                                <h3>{stats.totalRides}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3}>
                        <Card className="text-center shadow-sm bg-success text-white">
                            <Card.Body>
                                <Card.Title>Total Revenue</Card.Title>
                                <h3>₹{stats.totalRevenue}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

            <h4 className="mt-4 mb-3">Pending Driver Verifications</h4>
            <Card className="shadow-sm mb-5 border-warning">
                <Card.Body>
                    {unverifiedDrivers.length === 0 ? <p>No drivers pending verification.</p> : (
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>License</th>
                                    <th>Vehicle</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {unverifiedDrivers.map(d => (
                                    <tr key={d._id}>
                                        <td>{d.name}</td>
                                        <td>{d.email}</td>
                                        <td>{d.phone}</td>
                                        <td>{d.licenseNumber}</td>
                                        <td>{d.vehicleType} - {d.vehicleNumber}</td>
                                        <td>
                                            <Button variant="success" size="sm" onClick={() => handleVerifyDriver(d._id)}>
                                                Verify
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            <h4 className="mb-3">Recent Platform Rides</h4>
            <Card className="shadow-sm mb-5">
                <Card.Body>
                    {rides.length === 0 ? <p>No rides have been requested yet.</p> : (
                        <Table hover responsive className="align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Passenger</th>
                                    <th>Driver</th>
                                    <th>Status</th>
                                    <th>Fare</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rides.slice(0, 15).map(r => ( // showing just 15 for mock
                                    <tr key={r._id}>
                                        <td><small>{r._id.substring(r._id.length - 6)}</small></td>
                                        <td>{r.userId ? r.userId.name : 'Unknown'}</td>
                                        <td>{r.driverId ? r.driverId.name : 'Unassigned'}</td>
                                        <td>
                                            <Badge bg={r.status === 'completed' ? 'success' : r.status === 'pending' ? 'secondary' : r.status === 'cancelled' ? 'danger' : 'primary'}>
                                                {r.status}
                                            </Badge>
                                        </td>
                                        <td>₹{r.actualFare || r.estimatedFare}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

        </Container>
    );
};

export default AdminDashboard;
