import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldAlert, ArrowLeft, LogIn, Home, Lock } from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const Unauthorized = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, role } = useSelector(state => state.auth);

  const attemptedPath = location.state?.from?.pathname || 'the requested protected resource';

  const handleSwitchAccount = () => {
    dispatch(logout());
    toast.success('Signed out. Please authenticate with an authorized administrator account.');
    navigate('/login?admin=1');
  };

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-main)',
        padding: '3rem 1rem'
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: 'var(--shadow-xl)',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border)'
        }}
      >
        {/* Shield Alert Icon */}
        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '20px',
            backgroundColor: '#FEF2F2',
            color: '#DC2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            border: '2px solid #FEE2E2',
            boxShadow: '0 8px 16px rgba(220, 38, 38, 0.12)'
          }}
        >
          <ShieldAlert size={36} strokeWidth={2.2} />
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.25rem 0.75rem',
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '0.85rem'
          }}
        >
          <Lock size={12} />
          <span>HTTP 403 • Access Forbidden</span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '0.5rem', fontWeight: '800' }}>
          Access Permission Denied
        </h1>

        {/* Description */}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
          You are currently signed in as <strong>{user?.name || 'Verified User'}</strong> (role: <code>{role || 'patient'}</code>).
          Your account does not have the administrative privileges required to access <code>{attemptedPath}</code>.
        </p>

        {/* Security Architecture Note */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '0.85rem',
            marginBottom: '1.75rem',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            textAlign: 'left',
            lineHeight: '1.45'
          }}
        >
          <strong style={{ color: 'var(--primary-dark)' }}>🛡️ Security Architecture Guard:</strong><br />
          Client-side role validation prevented unauthorized UI access. In a production deployment, all administrative APIs independently enforce authorization tokens on the server.
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {role === 'patient' ? (
            <Link to="/patient/dashboard" className="btn btn-primary" style={{ justifyContent: 'center', padding: '0.75rem' }}>
              <ArrowLeft size={16} />
              <span>Return to My Patient Dashboard</span>
            </Link>
          ) : (
            <Link to="/" className="btn btn-primary" style={{ justifyContent: 'center', padding: '0.75rem' }}>
              <Home size={16} />
              <span>Return to MediCare Home</span>
            </Link>
          )}

          <button
            type="button"
            onClick={handleSwitchAccount}
            className="btn btn-outline-primary"
            style={{ justifyContent: 'center', padding: '0.75rem' }}
          >
            <LogIn size={16} />
            <span>Switch to Administrator Account (Alt + A)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
