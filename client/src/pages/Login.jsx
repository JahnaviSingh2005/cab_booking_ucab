import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('user');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'driver') navigate('/driver/dashboard');
            else navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const res = await login(email, password, type);
        if (!res.success) setError(res.message);
        setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#f6f6f6' }}>
            {/* Left Panel */}
            <div style={{ width: '50%', background: '#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }} className="d-none d-lg-flex">
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(6,193,103,0.2) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(6,193,103,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
                <Link to="/" style={{ textDecoration: 'none', fontWeight: 900, fontSize: '28px', color: 'white', marginBottom: '60px', letterSpacing: '-1px' }}>
                    U<span style={{ color: '#06C167' }}>cab</span>
                </Link>
                <h2 style={{ fontSize: '42px', fontWeight: 900, color: 'white', lineHeight: 1.1, letterSpacing: '-1.5px', marginBottom: '16px' }}>
                    Your ride,<br />your way.
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', lineHeight: 1.6 }}>
                    Sign in to book rides, track your driver, and pay seamlessly.
                </p>
                <div style={{ marginTop: 'auto', display: 'flex', gap: '24px' }}>
                    {['Reliable', 'Fast', 'Safe'].map(tag => (
                        <span key={tag} style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', padding: '6px 14px', borderRadius: '50px', fontSize: '13px', fontWeight: 500 }}>✓ {tag}</span>
                    ))}
                </div>
            </div>

            {/* Right Panel - Form */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
                <div style={{ width: '100%', maxWidth: '420px' }}>
                    <div style={{ marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>Sign in</h1>
                        <p style={{ color: '#545454', fontSize: '15px' }}>Welcome back to Ucab</p>
                    </div>

                    {error && <div className="uber-alert uber-alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="uber-form-group">
                            <label className="uber-form-label">I am a</label>
                            <select className="uber-form-control uber-select" value={type} onChange={e => setType(e.target.value)}>
                                <option value="user">Passenger</option>
                                <option value="driver">Driver</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="uber-form-group">
                            <label className="uber-form-label">Email Address</label>
                            <input className="uber-form-control" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>

                        <div className="uber-form-group" style={{ marginBottom: '28px' }}>
                            <label className="uber-form-label">Password</label>
                            <input className="uber-form-control" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>

                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '15px', background: '#000', color: '#fff', border: 'none',
                            borderRadius: '8px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                            opacity: loading ? 0.7 : 1
                        }}>
                            {loading ? 'Signing in...' : 'Sign In →'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#545454' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#000', fontWeight: 700, textDecoration: 'none' }}>Create account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
