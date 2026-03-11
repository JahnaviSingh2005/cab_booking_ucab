import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '',
        role: 'user', licenseNumber: '', vehicleType: 'Economy', vehicleNumber: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const res = await register(formData);
        if (res.success) {
            if (formData.role === 'driver') navigate('/driver/dashboard');
            else navigate('/dashboard');
        } else {
            setError(res.message);
        }
        setLoading(false);
    };

    const isDriver = formData.role === 'driver';

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#f6f6f6' }}>
            {/* Left dark panel */}
            <div style={{ width: '42%', background: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }} className="d-none d-lg-flex">
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(6,193,103,0.18) 0%, transparent 70%)', borderRadius: '50%' }} />
                <Link to="/" style={{ textDecoration: 'none', fontWeight: 900, fontSize: '28px', color: 'white', marginBottom: '60px', letterSpacing: '-1px' }}>
                    U<span style={{ color: '#06C167' }}>cab</span>
                </Link>
                <h2 style={{ fontSize: '38px', fontWeight: 900, color: 'white', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '16px' }}>
                    Join thousands<br />of riders.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: 1.6 }}>
                    Whether you're a passenger or driver, Ucab connects you to the city.
                </p>
            </div>

            {/* Right form panel */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: '440px', padding: '20px 0' }}>
                    <div style={{ marginBottom: '32px' }}>
                        <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>Create account</h1>
                        <p style={{ color: '#545454', fontSize: '14px' }}>Join Ucab in seconds</p>
                    </div>

                    {error && <div className="uber-alert uber-alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="uber-form-group">
                            <label className="uber-form-label">I want to</label>
                            <select className="uber-form-control uber-select" name="role" value={formData.role} onChange={handleChange}>
                                <option value="user">Book rides as Passenger</option>
                                <option value="driver">Drive with Ucab</option>
                            </select>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <div className="uber-form-group">
                                <label className="uber-form-label">Full Name</label>
                                <input className="uber-form-control" type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
                            </div>
                            <div className="uber-form-group">
                                <label className="uber-form-label">Phone</label>
                                <input className="uber-form-control" type="tel" name="phone" placeholder="9876543210" value={formData.phone} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="uber-form-group">
                            <label className="uber-form-label">Email Address</label>
                            <input className="uber-form-control" type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
                        </div>

                        <div className="uber-form-group">
                            <label className="uber-form-label">Password</label>
                            <input className="uber-form-control" type="password" name="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required />
                        </div>

                        {isDriver && (
                            <div style={{ background: '#f6f6f6', border: '1.5px solid #ebebeb', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                                <p style={{ fontSize: '13px', fontWeight: 700, marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#06C167' }}>Driver Details</p>
                                <div className="uber-form-group">
                                    <label className="uber-form-label">License Number</label>
                                    <input className="uber-form-control" type="text" name="licenseNumber" placeholder="DL-XXXXXXXXXX" value={formData.licenseNumber} onChange={handleChange} required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                    <div className="uber-form-group">
                                        <label className="uber-form-label">Vehicle Type</label>
                                        <select className="uber-form-control uber-select" name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
                                            <option value="Economy">Economy</option>
                                            <option value="Comfort">Comfort</option>
                                            <option value="Premium">Premium</option>
                                        </select>
                                    </div>
                                    <div className="uber-form-group">
                                        <label className="uber-form-label">Vehicle Number</label>
                                        <input className="uber-form-control" type="text" name="vehicleNumber" placeholder="MH 01 AB 1234" value={formData.vehicleNumber} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '15px', background: '#000', color: '#fff', border: 'none',
                            borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                            opacity: loading ? 0.7 : 1
                        }}>
                            {loading ? 'Creating account...' : `Create ${isDriver ? 'Driver' : 'Passenger'} Account →`}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#545454' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#000', fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
