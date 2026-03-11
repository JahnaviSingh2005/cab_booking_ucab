import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Payment = () => {
    const { rideId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [ride, setRide] = useState(null);
    const [method, setMethod] = useState('card');
    const [donation, setDonation] = useState(0);
    const [refreshments, setRefreshments] = useState(0);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [receipt, setReceipt] = useState(null);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

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
                if (data.status !== 'completed') {
                    setError('Ride is not completed yet so you cannot pay.');
                }
            } catch (err) {
                setError('Failed to fetch ride details');
            }
        };

        fetchRide();
    }, [rideId, user, navigate]);

    const handlePayment = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = {
                rideId,
                method,
                donation: Number(donation),
                refreshments: Number(refreshments)
            };

            const { data } = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/payments/pay`, payload, config);
            setSuccess('Payment successful! Your receipt has been generated.');
            setReceipt(data.payment.receiptUrl);
        } catch (err) {
            setError(err.response?.data?.message || 'Payment processing failed');
        }
    };

    if (error && !ride) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
    if (!ride) return <Container className="mt-5">Loading payment details...</Container>;

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === 'UCAB10') {
            setDiscount(0.10); // 10% off
            setError('');
        } else {
            setDiscount(0);
            setError('Invalid promo code');
        }
    };

    const baseFare = ride.actualFare || ride.estimatedFare;
    const discountAmount = baseFare * discount;
    const totalAmount = (baseFare - discountAmount) + Number(donation) + Number(refreshments);

    return (
        <Container className="mt-4">
            <Row className="justify-content-md-center">
                <Col md={8}>
                    <Card className="shadow-sm">
                        <Card.Header as="h4" className="bg-success text-white">Complete Your Payment</Card.Header>
                        <Card.Body>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {success && (
                                <Alert variant="success">
                                    {success} <br />
                                    <a href="#" onClick={(e) => { e.preventDefault(); alert("Downloaded: " + receipt) }} className="alert-link">Download Receipt</a>
                                    <div className="mt-3">
                                        <Button variant="outline-success" onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
                                    </div>
                                </Alert>
                            )}

                            {!success && (
                                <Form onSubmit={handlePayment}>
                                    <h5 className="mb-3">Ride Summary</h5>
                                    <p>From: <strong>{ride.pickupLocation.address}</strong></p>
                                    <p>To: <strong>{ride.dropLocation.address}</strong></p>
                                    <p>Cab Type: <strong>{ride.cabType}</strong></p>
                                    <hr />

                                    <Row className="mb-3">
                                        <Col>Base Fare:</Col>
                                        <Col className="text-end">₹{baseFare}</Col>
                                    </Row>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Add Donation (Optional ₹)</Form.Label>
                                        <Form.Select value={donation} onChange={e => setDonation(e.target.value)}>
                                            <option value={0}>No Thanks</option>
                                            <option value={5}>₹5 - Clean Water Fund</option>
                                            <option value={10}>₹10 - Feed the Hungry</option>
                                            <option value={20}>₹20 - Tree Plantation</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>In-Ride Refreshments Purchases (₹)</Form.Label>
                                        <Form.Select value={refreshments} onChange={e => setRefreshments(e.target.value)}>
                                            <option value={0}>None</option>
                                            <option value={20}>₹20 - Water Bottle</option>
                                            <option value={50}>₹50 - Snacks Pack</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Promo Code</Form.Label>
                                        <div className="d-flex">
                                            <Form.Control type="text" placeholder="e.g. UCAB10" value={promoCode} onChange={e => setPromoCode(e.target.value)} />
                                            <Button variant="outline-primary" className="ms-2" onClick={handleApplyPromo}>Apply</Button>
                                        </div>
                                        {discount > 0 && <small className="text-success mt-1 d-block">10% Discount Applied! (-₹{discountAmount.toFixed(2)})</small>}
                                    </Form.Group>

                                    <hr />
                                    <Row className="mb-4">
                                        <Col><h4>Total Amount:</h4></Col>
                                        <Col className="text-end"><h4 className="text-primary">₹{totalAmount}</h4></Col>
                                    </Row>

                                    <Form.Group className="mb-4">
                                        <Form.Label>Payment Method</Form.Label>
                                        <Form.Select value={method} onChange={e => setMethod(e.target.value)}>
                                            <option value="card">Credit/Debit Card</option>
                                            <option value="upi">UPI / GPay</option>
                                            <option value="wallet">Ucab Wallet</option>
                                        </Form.Select>
                                    </Form.Group>

                                    <Button variant="primary" type="submit" size="lg" className="w-100" disabled={ride.status !== 'completed'}>
                                        Pay ₹{totalAmount} Now
                                    </Button>
                                </Form>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Payment;
