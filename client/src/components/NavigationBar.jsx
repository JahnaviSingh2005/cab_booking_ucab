import React, { useContext } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavigationBar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="ucab-navbar">
            <div className="d-flex align-items-center w-100">
                {/* Brand */}
                <Link to="/" className="navbar-brand text-white fw-black me-5" style={{ fontWeight: 900, fontSize: '22px', letterSpacing: '-0.5px', textDecoration: 'none' }}>
                    U<span style={{ color: '#06C167' }}>cab</span>
                </Link>

                {/* Nav Links */}
                <div className="d-flex align-items-center gap-1 me-auto">
                    {!user && (
                        <>
                            <Link to="/login" className="nav-link text-white-50" style={{ fontSize: '14px', fontWeight: 500, padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.target.style.color = 'white'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={e => { e.target.style.color = ''; e.target.style.background = ''; }}>
                                Login
                            </Link>
                            <Link to="/register" className="nav-link" style={{ fontSize: '14px', fontWeight: 500, padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', color: 'rgba(255,255,255,0.75)', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.target.style.color = 'white'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
                                onMouseLeave={e => { e.target.style.color = 'rgba(255,255,255,0.75)'; e.target.style.background = ''; }}>
                                Register
                            </Link>
                        </>
                    )}

                    {user && user.role === 'user' && (
                        <>
                            <Link to="/book" style={{ fontSize: '14px', fontWeight: 500, padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', color: 'rgba(255,255,255,0.75)', transition: 'all 0.2s' }}>Book Ride</Link>
                            <Link to="/history" style={{ fontSize: '14px', fontWeight: 500, padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', color: 'rgba(255,255,255,0.75)' }}>My Trips</Link>
                            <Link to="/profile" style={{ fontSize: '14px', fontWeight: 500, padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', color: 'rgba(255,255,255,0.75)' }}>Profile</Link>
                        </>
                    )}

                    {user && user.role === 'driver' && (
                        <>
                            <Link to="/driver/dashboard" style={{ fontSize: '14px', fontWeight: 500, padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', color: 'rgba(255,255,255,0.75)' }}>Driver Board</Link>
                            <Link to="/profile" style={{ fontSize: '14px', fontWeight: 500, padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', color: 'rgba(255,255,255,0.75)' }}>Profile</Link>
                        </>
                    )}

                    {user && user.role === 'admin' && (
                        <Link to="/admin" style={{ fontSize: '14px', fontWeight: 500, padding: '6px 14px', borderRadius: '8px', textDecoration: 'none', color: 'rgba(255,255,255,0.75)' }}>Admin Panel</Link>
                    )}
                </div>

                {/* User Info + Logout */}
                {user && (
                    <div className="d-flex align-items-center gap-3">
                        <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                            {user.name} &middot; <span style={{ color: '#06C167', textTransform: 'capitalize' }}>{user.role}</span>
                        </span>
                        <button onClick={handleLogout} className="btn-nav-logout" style={{
                            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                            color: '#fff', fontSize: '13px', fontWeight: 500, padding: '6px 16px',
                            borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                            Log out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default NavigationBar;
