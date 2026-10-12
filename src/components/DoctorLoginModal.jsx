import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Stethoscope, 
  Lock, 
  Mail, 
  X, 
  ShieldCheck, 
  Key, 
  ArrowRight,
  Sparkles,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { loginSuccess } from '../redux/slices/authSlice';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const DoctorLoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [doctorRegId, setDoctorRegId] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.doctorLogin({
        email,
        password,
        doctorRegId
      });

      dispatch(loginSuccess(response));
      setLoading(false);
      onClose();
      toast.success(`Welcome ${response.user.name}! Clinical Hub Access Granted.`);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setLoading(false);
      toast.error(err.message || 'Invalid medical credentials.');
    }
  };


  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '480px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          padding: '2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '2px solid #7C3AED',
          position: 'relative',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Secret Badge Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #7C3AED 0%, #0B6E99 50%, #16A6A3 100%)'
          }}
        />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px'
          }}
          aria-label="Close Doctor Portal"
        >
          <X size={20} />
        </button>

        {/* Header with Doctor Emblem */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.85rem auto',
              boxShadow: '0 10px 20px rgba(124, 58, 237, 0.3)'
            }}
          >
            <Stethoscope size={32} strokeWidth={2.3} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#F5F3FF', color: '#6D28D9', padding: '0.2rem 0.65rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: '800', marginBottom: '0.4rem', border: '1px solid #DDD6FE' }}>
            <Key size={12} />
            <span>CONFIDENTIAL • DOCTOR ACCESS ONLY (CTRL + D)</span>
          </div>

          <h2 style={{ fontSize: '1.45rem', color: '#1E1B4B', margin: '0.2rem 0 0.25rem 0', fontWeight: '800' }}>
            Attending Physician & Staff Sign In
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
            Restricted to certified physicians, surgeons, and department heads.
          </p>
        </div>


        {/* Form */}
        <form onSubmit={handleDoctorSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1E1B4B', display: 'block', marginBottom: '0.25rem' }}>
              Doctor Hospital Email *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7C3AED' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@medicare.health"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1E1B4B', display: 'block', marginBottom: '0.25rem' }}>
              Medical Registration / NMC ID *
            </label>
            <div style={{ position: 'relative' }}>
              <ShieldCheck size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7C3AED' }} />
              <input
                type="text"
                required
                value={doctorRegId}
                onChange={(e) => setDoctorRegId(e.target.value)}
                placeholder="NMC-MED-XXXXX"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1E1B4B', display: 'block', marginBottom: '0.25rem' }}>
              Secret Doctor Password *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#7C3AED' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  fontSize: '0.88rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              backgroundColor: '#7C3AED',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem',
              fontWeight: '700',
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.35)',
              transition: 'all 0.15s ease'
            }}
          >
            <Stethoscope size={18} />
            <span>{loading ? 'Authenticating Doctor...' : 'Authenticate & Enter Clinical Hub'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/hospital/portal');
            }}
            style={{
              backgroundColor: '#F5F3FF',
              color: '#6D28D9',
              border: '1px solid #DDD6FE',
              borderRadius: 'var(--radius-sm)',
              padding: '0.65rem',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease'
            }}
          >
            <span>🏢 Open Hospital & Wards Management Portal</span>
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          🔒 Protected Clinical Triage & Hospital Management. Shortcut: <strong>Ctrl + D</strong>
        </div>
      </div>
    </div>
  );
};

export default DoctorLoginModal;
