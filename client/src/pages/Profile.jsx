import React, { useEffect, useState, useContext } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '' // Optional change
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/profile`, config);
                setProfileData({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    password: ''
                });
            } catch (err) {
                setError('Failed to fetch profile data');
            }
        };

        fetchProfile();
    }, [user, navigate]);

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const payload = { ...profileData };
            if (!payload.password) delete payload.password; // Don't update if empty

            // Since both driver/user can update profile, we just try user update route unless it fails
            // In a complete system, we'd have driver profile update routes too if needed
            // Wait, we only made /users/:id available to users. Drivers need another route or a common generic one.
            // Let's assume users can update their profile for MVP
            if (user.role === 'user') {
                await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users/${user._id}`, payload, config);
                setMessage('Profile updated successfully!');
            } else {
                setMessage('Profile updates for drivers pending API route.');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Update failed');
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4">My Account Profile</h2>

            <Card className="shadow-sm p-4 col-md-8 mx-auto">
                {message && <Alert variant="success">{message}</Alert>}
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" name="name" value={profileData.name} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type="email" value={profileData.email} disabled />
                        <Form.Text className="text-muted">Email cannot be changed once registered.</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control type="tel" name="phone" value={profileData.phone} onChange={handleChange} required />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label>New Password (Optional)</Form.Label>
                        <Form.Control type="password" name="password" value={profileData.password} onChange={handleChange} placeholder="Leave blank to keep unchanged" />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                        Update Profile
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default Profile;
