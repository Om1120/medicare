import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Stethoscope, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  HeartPulse
} from 'lucide-react';
import { loginSuccess } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const HospitalLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: hospitals } = useSelector(state => state.hospitals);

  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0]?.id || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMode, setLoginMode] = useState('select'); // 'select' | 'manual'
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleHospitalSelectLogin = (hId) => {
    const targetHospital = hospitals.find(h => h.id === hId) || hospitals[0];
    if (!targetHospital) {
      toast.error('Hospital record not found.');
      return;
    }

    const hospitalUser = {
      id: `hosp-admin-${targetHospital.id}`,
      name: `${targetHospital.name} (Admin)`,
      email: targetHospital.email || `admin@${targetHospital.slug || 'hospital'}.com`,
      role: 'admin',
      assignedHospitalId: targetHospital.id,
      hospitalName: targetHospital.name,
      isHospitalAdmin: true
    };

    dispatch(loginSuccess(hospitalUser));
    toast.success(`Access granted to ${targetHospital.name}!`);
    navigate('/hospital/portal');
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setIsSubmitting(false);
      toast.error('Hospital email is required.');
      return;
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      setIsSubmitting(false);
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      const activeHospital = hospitals.find(h => h.id === selectedHospitalId) || hospitals[0];
      const hospitalUser = {
        id: `hosp-adm-${activeHospital?.id || '01'}`,
        name: `${activeHospital?.name || 'Hospital'} Director`,
        email: cleanEmail,
        role: 'admin',
        assignedHospitalId: activeHospital?.id || 'hosp-gj-1',
        hospitalName: activeHospital?.name || 'Hospital Network',
        isHospitalAdmin: true
      };

      dispatch(loginSuccess({ user: hospitalUser }));
      setIsSubmitting(false);
      toast.success(`Welcome to Hospital Administration Portal!`);
      navigate('/hospital/portal');
    } catch (err) {
      setIsSubmitting(false);
      toast.error(err.message || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div style={{ minHeight: '85vh', backgroundColor: 'var(--bg-main)', padding: '3.5rem 1rem', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '640px' }}>
        
        {/* Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.35rem 0.85rem',
              backgroundColor: '#EDE9FE',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: '700',
              color: '#6D28D9',
              marginBottom: '1rem'
            }}
          >
            <Sparkles size={14} />
            <span>Shortcut: Press <strong>Ctrl + D</strong> Anytime</span>
          </div>

          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #7C3AED, #2563EB)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <Building2 size={32} />
          </div>

          <h1 style={{ fontSize: '1.9rem', color: 'var(--primary-dark)', marginBottom: '0.4rem', fontWeight: '800' }}>
            Hospital Partner & Clinical Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', maxWidth: '520px', margin: '0 auto' }}>
            Manage your hospital’s infrastructure, register clinical doctors, add patient wards, and update real-time operational capacity.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.85rem' }}>
            <button
              type="button"
              onClick={() => setLoginMode('select')}
              style={{
                flex: 1,
                padding: '0.65rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: loginMode === 'select' ? '#EDE9FE' : 'transparent',
                color: loginMode === 'select' ? '#6D28D9' : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Building2 size={16} />
              <span>Select Hospital (Instant Access)</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginMode('manual')}
              style={{
                flex: 1,
                padding: '0.65rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: loginMode === 'manual' ? '#EDE9FE' : 'transparent',
                color: loginMode === 'manual' ? '#6D28D9' : 'var(--text-muted)',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Lock size={16} />
              <span>Email & Password</span>
            </button>
          </div>

          {loginMode === 'select' ? (
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-dark)', display: 'block', marginBottom: '0.5rem' }}>
                Select Your Registered Hospital:
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '0.25rem', marginBottom: '1.5rem' }}>
                {hospitals.map((hosp) => (
                  <div
                    key={hosp.id}
                    onClick={() => handleHospitalSelectLogin(hosp.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.9rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      backgroundColor: '#FAFAFA',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#7C3AED';
                      e.currentTarget.style.backgroundColor = '#F5F3FF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.backgroundColor = '#FAFAFA';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: '#ffffff',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#7C3AED',
                          fontWeight: '800'
                        }}
                      >
                        <Building2 size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--primary-dark)' }}>
                          {hosp.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {hosp.city} • {hosp.type || 'Super Specialty'} • {hosp.totalBeds || 0} Beds
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#7C3AED', fontSize: '0.82rem', fontWeight: '700' }}>
                      <span>Manage</span>
                      <ArrowRight size={15} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>
                💡 Click any hospital above to enter its dedicated management hub to add doctors & wards immediately.
              </div>
            </div>
          ) : (
            <form onSubmit={handleManualSubmit}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label form-label-req">Associated Hospital</label>
                <select
                  value={selectedHospitalId}
                  onChange={(e) => setSelectedHospitalId(e.target.value)}
                  className="form-control"
                  required
                >
                  {hospitals.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.city})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label form-label-req">Hospital Administrator Email</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="administrator@hospital.health"
                    style={{ paddingLeft: '2.4rem' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label form-label-req">Security Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="••••••••"
                    style={{ paddingLeft: '2.4rem' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
                style={{ width: '100%', padding: '0.85rem' }}
              >
                <span>{isSubmitting ? 'Verifying Hospital...' : 'Access Hospital Management Portal'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
            <Link to="/admin/hospitals" style={{ color: 'var(--primary)', fontWeight: '600' }}>
              ← Return to Main Admin Panel
            </Link>
            <span style={{ color: 'var(--text-muted)' }}>
              Shortcut: <kbd style={{ padding: '2px 5px', background: '#F1F5F9', borderRadius: '4px', border: '1px solid #CBD5E1' }}>Ctrl + D</kbd>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HospitalLogin;
