import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Book from './pages/Book';
import Tracking from './pages/Tracking';
import DriverDashboard from './pages/DriverDashboard';
import Payment from './pages/Payment';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import History from './pages/History';
import NavigationBar from './components/NavigationBar';

// Uber-style Home Page
const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <div style={{ background: '#000', minHeight: 'calc(100vh - 68px)', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Green glow effects */}
      <div style={{ position: 'absolute', top: '-20%', right: '0', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(6,193,103,0.15) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(6,193,103,0.08) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 2, width: '100%' }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: 900, color: '#fff', lineHeight: 1.05, letterSpacing: '-2.5px', marginBottom: '20px' }}>
            Go anywhere<br />with <span style={{ color: '#06C167' }}>Ucab</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: '40px', maxWidth: '440px' }}>
            Request a ride, hop in, and go. Safe, reliable, and always on time.
          </p>
          {!user ? (
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/login" style={{ background: '#fff', color: '#000', padding: '16px 36px', borderRadius: '8px', fontWeight: 800, fontSize: '16px', textDecoration: 'none', transition: 'all 0.2s' }}>Get started</Link>
              <Link to="/register" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '16px 36px', borderRadius: '8px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>Create account</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link to="/book" style={{ background: '#06C167', color: '#fff', padding: '16px 36px', borderRadius: '8px', fontWeight: 800, fontSize: '16px', textDecoration: 'none' }}>Book a ride</Link>
              <Link to="/history" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '16px 36px', borderRadius: '8px', fontWeight: 700, fontSize: '16px', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>My trips</Link>
            </div>
          )}
          {/* Features row */}
          <div style={{ display: 'flex', gap: '32px', marginTop: '64px', flexWrap: 'wrap' }}>
            {[['🛡️', 'Safe rides', 'Verified drivers'], ['⚡', 'Fast pickup', 'Avg. 3 mins'], ['💳', 'Easy pay', 'Multiple methods']].map(([icon, title, sub]) => (
              <div key={title}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Uber-style Dashboard
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.role === 'driver') return <Navigate to="/driver/dashboard" />;
  return (
    <div style={{ background: '#f6f6f6', minHeight: 'calc(100vh - 68px)', padding: '32px 0 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div className="page-header">
          <h1 className="page-title">Good day, {user.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Where are you going today?</p>
        </div>
        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {[
            { to: '/book', icon: '🚗', label: 'Book a ride', desc: 'Request a car now', bg: '#000', color: '#fff' },
            { to: '/history', icon: '🕐', label: 'My trips', desc: 'View past rides', bg: '#fff', color: '#000' },
            { to: '/profile', icon: '👤', label: 'Profile', desc: 'Manage account', bg: '#fff', color: '#000' },
          ].map(item => (
            <Link key={item.to} to={item.to} style={{ background: item.bg, color: item.color, padding: '24px', borderRadius: '16px', textDecoration: 'none', border: '1px solid #ebebeb', display: 'block', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
              <div style={{ fontWeight: 800, fontSize: '16px', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '13px', opacity: 0.6 }}>{item.desc}</div>
            </Link>
          ))}
        </div>
        {/* Promo Banner */}
        <div style={{ background: '#06C167', borderRadius: '16px', padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: '20px', color: '#fff', marginBottom: '4px' }}>🎉 Use code UCAB10</div>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Get 10% off on your next ride</div>
          </div>
          <Link to="/book" style={{ background: '#fff', color: '#000', padding: '12px 24px', borderRadius: '8px', fontWeight: 800, textDecoration: 'none', fontSize: '14px' }}>Book now</Link>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <div style={{ paddingTop: '70px', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/history" element={<History />} />
            <Route path="/book" element={<Book />} />
            <Route path="/tracking/:rideId" element={<Tracking />} />
            <Route path="/payment/:rideId" element={<Payment />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
