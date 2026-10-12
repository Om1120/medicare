import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  HeartPulse, 
  Lock, 
  Mail, 
  User, 
  ArrowRight,
  ShieldCheck, 
  Building2,
  Sparkles,
  KeyRound
} from 'lucide-react';
import { loginSuccess } from '../redux/slices/authSlice';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const loginSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const from = location.state?.from?.pathname || null;
  const isFromAdmin = Boolean(from && from.startsWith('/admin'));

  const [isAdminMode, setIsAdminMode] = useState(() => {
    return (
      searchParams.get('admin') === '1' ||
      searchParams.get('role') === 'admin' ||
      isFromAdmin
    );
  });

  const [formInitialValues, setFormInitialValues] = useState(() => ({
    email: isFromAdmin ? 'admin@medicare.health' : '',
    password: isFromAdmin ? 'admin123' : '',
    rememberMe: false
  }));

  useEffect(() => {
    if (searchParams.get('admin') === '1' || searchParams.get('role') === 'admin') {
      setIsAdminMode(true);
    } else if (searchParams.get('admin') === '0' || searchParams.get('role') === 'patient') {
      setIsAdminMode(false);
    } else if (isFromAdmin) {
      setIsAdminMode(true);
    }
  }, [searchParams, isFromAdmin]);

  const handleSwitchMode = (adminMode) => {
    setIsAdminMode(adminMode);
    if (adminMode) {
      setSearchParams({ admin: '1' }, { replace: true });
      setFormInitialValues({
        email: 'admin@medicare.health',
        password: 'admin123',
        rememberMe: false
      });
    } else {
      setSearchParams({}, { replace: true });
      setFormInitialValues({
        email: 'patient@medicare.health',
        password: 'patient123',
        rememberMe: false
      });
    }
  };

  // Local listener for Alt + A to toggle Admin login mode interface
  useEffect(() => {
    const handleLocalKeyDown = (e) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        handleSwitchMode(!isAdminMode);
        toast(isAdminMode ? 'Switched to Patient Sign In' : 'Administrator Sign-In Mode (Alt + A)', {
          icon: isAdminMode ? '👤' : '🔐'
        });
      }
    };
    window.addEventListener('keydown', handleLocalKeyDown);
    return () => window.removeEventListener('keydown', handleLocalKeyDown);
  }, [isAdminMode]);

  const handleLoginSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    try {
      const response = await authService.login({
        email: values.email,
        password: values.password
      });

      dispatch(loginSuccess(response));
      setSubmitting(false);
      toast.success(`Welcome back, ${response.user.name}!`);

      if (from) {
        if (from.startsWith('/admin') && response.user.role !== 'admin') {
          toast('Signed in with Patient privileges. Redirecting to Patient Dashboard.', { icon: 'ℹ️' });
          navigate('/patient/dashboard', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      } else if (response.user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/patient/dashboard', { replace: true });
      }
    } catch (err) {
      setSubmitting(false);
      toast.error(err.message || 'Unable to sign in. Please verify your credentials.');
    }
  };

  return (
    <div style={{ padding: '3.5rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        
        {/* Portal Switcher Tabs */}
        <div style={{ display: 'flex', background: '#E2E8F0', padding: '4px', borderRadius: '12px', marginBottom: '1.5rem', gap: '4px' }}>
          <button
            type="button"
            onClick={() => handleSwitchMode(false)}
            style={{
              flex: 1,
              padding: '0.65rem 0.5rem',
              borderRadius: '9px',
              border: 'none',
              background: !isAdminMode ? '#ffffff' : 'transparent',
              color: !isAdminMode ? 'var(--primary-dark)' : '#64748B',
              fontWeight: '700',
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              boxShadow: !isAdminMode ? '0 2px 5px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <HeartPulse size={16} color={!isAdminMode ? 'var(--primary)' : '#64748B'} />
            <span>Patient Portal</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchMode(true)}
            style={{
              flex: 1,
              padding: '0.65rem 0.5rem',
              borderRadius: '9px',
              border: 'none',
              background: isAdminMode ? '#7C3AED' : 'transparent',
              color: isAdminMode ? '#ffffff' : '#64748B',
              fontWeight: '700',
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              boxShadow: isAdminMode ? '0 3px 10px rgba(124,58,237,0.35)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <KeyRound size={16} />
            <span>Admin & Staff</span>
          </button>
        </div>

        {/* Protected route redirect warning notice if user arrived at admin route */}
        {isFromAdmin && !isAdminMode && (
          <div style={{ padding: '0.75rem 1rem', background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.82rem', color: '#92400E' }}>
            ⚠️ <strong>Admin Access Required:</strong> You requested an administrative area (<code>{from}</code>). Switch to the <strong>Admin & Staff</strong> tab above to sign in.
          </div>
        )}

        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: 'var(--radius-lg)',
              background: isAdminMode 
                ? 'linear-gradient(135deg, #7C3AED, #2563EB)' 
                : 'linear-gradient(135deg, var(--primary), var(--teal))',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {isAdminMode ? <KeyRound size={28} /> : <HeartPulse size={30} />}
          </div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
            {isAdminMode ? 'Administrator Sign In' : 'Patient Portal Sign In'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            {isAdminMode 
              ? 'Authorized Administrator and medical staff console access.' 
              : 'Access your personalized patient health dashboard, appointments, diagnostic records, and medical invoices.'}
          </p>
        </div>

        {/* Fast Preset Demo Pill */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: isAdminMode ? '#EDE9FE' : '#E0F2FE', 
          border: `1px solid ${isAdminMode ? '#DDD6FE' : '#BAE6FD'}`, 
          borderRadius: '10px', 
          padding: '0.65rem 0.9rem', 
          marginBottom: '1.25rem',
          fontSize: '0.8rem',
          color: isAdminMode ? '#6D28D9' : '#0369A1'
        }}>
          <div>
            <strong>Quick Demo Fill:</strong> {isAdminMode ? 'admin@medicare.health' : 'patient@medicare.health'}
          </div>
          <button
            type="button"
            onClick={() => {
              setFormInitialValues({
                email: isAdminMode ? 'admin@medicare.health' : 'patient@medicare.health',
                password: isAdminMode ? 'admin123' : 'patient123',
                rememberMe: true
              });
              toast.success(`Demo ${isAdminMode ? 'Admin' : 'Patient'} credentials loaded!`);
            }}
            style={{
              background: isAdminMode ? '#7C3AED' : 'var(--primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.25rem 0.6rem',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Auto Fill
          </button>
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-lg)', backgroundColor: '#ffffff' }}>
          <Formik
            enableReinitialize={true}
            initialValues={formInitialValues}
            validationSchema={loginSchema}
            onSubmit={handleLoginSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form>
                
                {/* Email Field */}
                <div className="form-group">
                  <label className="form-label form-label-req">Registered Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <Field
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                      placeholder={isAdminMode ? "admin@medicare.health" : "patient@example.com"}
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>
                  <ErrorMessage name="email" component="div" className="form-error" />
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label className="form-label form-label-req" style={{ margin: 0 }}>Password</label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }} onClick={() => toast('Password reset link will be sent to your registered email.')}>
                      Forgot Password?
                    </span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <Field
                      name="password"
                      type="password"
                      className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                      placeholder="••••••••"
                      style={{ paddingLeft: '2.4rem' }}
                    />
                  </div>
                  <ErrorMessage name="password" component="div" className="form-error" />
                </div>

                {/* Remember Me */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <Field type="checkbox" name="rememberMe" id="rememberMe" />
                  <label htmlFor="rememberMe" style={{ fontSize: '0.85rem', color: 'var(--text-body)', cursor: 'pointer' }}>
                    Keep me signed in on this browser
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ 
                    width: '100%', 
                    padding: '0.85rem',
                    backgroundColor: isAdminMode ? '#7C3AED' : undefined,
                    borderColor: isAdminMode ? '#7C3AED' : undefined
                  }}
                >
                  <span>
                    {isSubmitting 
                      ? 'Signing in...' 
                      : (isAdminMode ? 'Sign In as Administrator' : 'Sign In to Account')}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </Form>
            )}
          </Formik>
        </div>

        {/* Footer link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
          <p style={{ margin: 0 }}>
            New to MediCare? <Link to="/book-appointment" style={{ fontWeight: '600', color: 'var(--primary)' }}>Book a Consultation</Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
