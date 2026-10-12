import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  HeartPulse, 
  Calendar, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Scale, 
  Activity, 
  ChevronDown,
  Building2,
  Stethoscope,
  PhoneCall,
  Pill,
  FileText,
  Receipt,
  Layers,
  MapPin
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import LocationPickerModal from './LocationPickerModal';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const { isAuthenticated, role, user } = useSelector(state => state.auth);
  const { hospitalIds, doctorIds } = useSelector(state => state.comparison);
  const { userCoords } = useSelector(state => state.location);
  const totalCompared = (hospitalIds || []).length + (doctorIds || []).length;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track scroll state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on page route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Signed out successfully.');
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileMenuOpen(false);
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <header
        className="site-navbar"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.96)' : '#ffffff',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border)',
          boxShadow: scrolled ? '0 4px 20px rgba(15, 23, 42, 0.08)' : '0 1px 3px rgba(15, 23, 42, 0.03)',
          transition: 'all 0.2s ease',
          height: '68px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Fixed 1140px Max Width Container */}
        <div style={{ width: '100%', maxWidth: '1140px', margin: '0 auto', padding: '0 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem' }}>
            
            {/* 1. BRAND LOGO */}
            <Link
              to="/"
              onClick={closeMobile}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                textDecoration: 'none',
                flexShrink: 0
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--teal) 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 10px rgba(11, 110, 153, 0.25)',
                  flexShrink: 0
                }}
              >
                <HeartPulse size={20} strokeWidth={2.4} />
              </div>

              <div style={{ lineHeight: '1.15' }}>
                <div
                  style={{
                    fontSize: '1.22rem',
                    fontWeight: '800',
                    color: 'var(--primary-dark)',
                    fontFamily: 'Outfit, Plus Jakarta Sans, sans-serif',
                    letterSpacing: '-0.3px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <span>MediCare</span>
                  <span style={{ color: 'var(--teal)', fontWeight: '900' }}>+</span>
                </div>
                <div
                  style={{
                    fontSize: '0.62rem',
                    color: 'var(--text-muted)',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase'
                  }}
                >
                  Healthcare Access
                </div>
              </div>
            </Link>

            {/* 2. ESSENTIAL DESKTOP NAVIGATION LINKS (Uncluttered 4 core options) */}
            <nav className="navbar-nav-desktop" aria-label="Main Navigation">
              <ul
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0
                }}
              >
                <li>
                  <NavLink
                    to="/hospitals"
                    className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                  >
                    <Building2 size={15} />
                    <span>Hospitals</span>
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/doctors"
                    className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                  >
                    <Stethoscope size={15} />
                    <span>Doctors</span>
                  </NavLink>
                </li>


                <li>
                  <NavLink
                    to="/compare"
                    className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
                    style={{ position: 'relative' }}
                  >
                    <Scale size={15} />
                    <span>Compare</span>
                    {totalCompared > 0 && (
                      <span
                        style={{
                          backgroundColor: 'var(--primary)',
                          color: '#ffffff',
                          fontSize: '0.65rem',
                          fontWeight: '800',
                          padding: '0.05rem 0.35rem',
                          borderRadius: '8px',
                          marginLeft: '0.15rem'
                        }}
                      >
                        {totalCompared}
                      </span>
                    )}
                  </NavLink>
                </li>
              </ul>
            </nav>

            {/* 3. RIGHT ACTIONS UTILITY BAR */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
              
              {/* Location Selector Chip */}
              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: userCoords ? '#EAF6FB' : '#F1F5F9',
                  color: userCoords ? 'var(--primary-dark)' : 'var(--text-dark)',
                  border: userCoords ? '1px solid #BAE6FD' : '1px solid var(--border)',
                  borderRadius: '50px',
                  padding: '0.35rem 0.7rem',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
                title="Click to detect or change city via Live API"
              >
                <MapPin size={13} color={userCoords ? 'var(--teal)' : 'var(--primary)'} />
                <span style={{ maxWidth: '95px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {userCoords?.city || 'Location'}
                </span>
                {userCoords && (
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: 'var(--teal)',
                      borderRadius: '50%'
                    }}
                  />
                )}
              </button>

              {/* 24/7 Emergency Quick Action */}
              <NavLink
                to="/emergency"
                className={({ isActive }) => `nav-emergency-header-btn ${isActive ? 'active' : ''}`}
              >
                <span className="emergency-live-dot" />
                <Activity size={14} />
                <span>Emergency</span>
              </NavLink>

              {/* Book Appointment CTA Button */}
              <Link
                to="/book-appointment"
                className="btn btn-teal btn-sm hide-on-tablet"
                style={{
                  height: '36px',
                  padding: '0 0.9rem',
                  fontSize: '0.82rem',
                  fontWeight: '700',
                  gap: '0.35rem'
                }}
              >
                <Calendar size={14} />
                <span>Book Slot</span>
              </Link>

              {/* Auth User Menu or Sign In */}
              {isAuthenticated ? (
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border)',
                      borderRadius: '50px',
                      padding: '0.25rem 0.65rem 0.25rem 0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-xs)',
                      transition: 'all 0.15s ease',
                      height: '36px'
                    }}
                    aria-expanded={userDropdownOpen}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: role === 'admin' ? '#7C3AED' : 'var(--primary)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '0.78rem'
                      }}
                    >
                      {userInitial}
                    </div>

                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary-dark)' }} className="hide-on-tablet">
                      {user?.name?.split(' ')[0] || 'Account'}
                    </span>

                    <ChevronDown size={12} color="var(--text-muted)" style={{ transform: userDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>

                  {userDropdownOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 12px 35px rgba(15, 23, 42, 0.16)',
                        minWidth: '220px',
                        zIndex: 1100,
                        overflow: 'hidden',
                        animation: 'fadeIn 0.15s ease'
                      }}
                    >
                      <div style={{ padding: '0.75rem 1rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: '800', fontSize: '0.86rem', color: 'var(--primary-dark)' }}>
                          {user?.name || (role === 'admin' ? 'Hospital Admin' : 'Patient')}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user?.email || 'Logged in'}
                        </div>
                      </div>

                      <div style={{ padding: '0.35rem 0' }}>
                        <Link
                          to={role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'}
                          className="dropdown-item-link"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <User size={15} color="var(--primary)" />
                          <span>{role === 'admin' ? 'Admin Hub' : 'Patient Dashboard'}</span>
                        </Link>

                        {role === 'patient' && (
                          <>
                            <Link
                              to="/patient/appointments"
                              className="dropdown-item-link"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <Calendar size={15} color="var(--teal)" />
                              <span>My Appointments</span>
                            </Link>

                            <Link
                              to="/patient/records"
                              className="dropdown-item-link"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <FileText size={15} color="#2563EB" />
                              <span>Medical Records</span>
                            </Link>

                            <Link
                              to="/patient/bills"
                              className="dropdown-item-link"
                              onClick={() => setUserDropdownOpen(false)}
                            >
                              <Receipt size={15} color="#059669" />
                              <span>Invoices & Bills</span>
                            </Link>
                          </>
                        )}

                        <div style={{ margin: '0.3rem 0', borderTop: '1px solid var(--border)' }} />

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="dropdown-item-link"
                          style={{
                            width: '100%',
                            background: 'none',
                            border: 'none',
                            color: 'var(--danger)',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <LogOut size={15} color="var(--danger)" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-outline-primary btn-sm"
                  style={{
                    height: '36px',
                    padding: '0 0.85rem',
                    fontSize: '0.82rem',
                    fontWeight: '700'
                  }}
                >
                  <User size={14} />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile / Tablet Nav Hamburger Toggle */}
              <button
                type="button"
                className="navbar-mobile-toggle"
                aria-label="Toggle Navigation Menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '0.4rem',
                  cursor: 'pointer',
                  color: 'var(--primary-dark)',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '36px',
                  width: '36px'
                }}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

            </div>
          </div>

          {/* 4. MOBILE DROPDOWN DRAWER */}
          {mobileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '68px',
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                borderBottom: '1px solid var(--border)',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.15)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                maxHeight: 'calc(100vh - 80px)',
                overflowY: 'auto',
                animation: 'fadeIn 0.2s ease'
              }}
            >
              {/* Mobile Location Bar */}
              <button
                type="button"
                onClick={() => {
                  closeMobile();
                  setLocationModalOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: '#EAF6FB',
                  border: '1px solid #BAE6FD',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--primary-dark)',
                  fontSize: '0.84rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginBottom: '0.5rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="var(--teal)" />
                  <span>Location: <strong>{userCoords?.city || 'Auto-Detect (GPS / IP)'}</strong></span>
                </div>
                <span style={{ fontSize: '0.74rem', color: 'var(--primary)', textDecoration: 'underline' }}>Change</span>
              </button>

              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0.2rem 0.5rem', letterSpacing: '0.5px' }}>
                Healthcare Navigation
              </div>

              <NavLink to="/hospitals" className="mobile-item-link" onClick={closeMobile}>
                <Building2 size={16} color="var(--primary)" />
                <span>Find Hospitals</span>
              </NavLink>
              <NavLink to="/doctors" className="mobile-item-link" onClick={closeMobile}>
                <Stethoscope size={16} color="var(--primary)" />
                <span>Specialist Doctors</span>
              </NavLink>
              <NavLink to="/departments" className="mobile-item-link" onClick={closeMobile}>
                <HeartPulse size={16} color="var(--primary)" />
                <span>Medical Departments</span>
              </NavLink>
              <NavLink to="/compare" className="mobile-item-link" onClick={closeMobile}>
                <Scale size={16} color="var(--teal)" />
                <span>Compare Hospitals {totalCompared > 0 && `(${totalCompared})`}</span>
              </NavLink>
              <NavLink to="/health-information" className="mobile-item-link" onClick={closeMobile}>
                <Pill size={16} color="var(--primary)" />
                <span>Drug & Health Info</span>
              </NavLink>

              <NavLink to="/emergency" className="mobile-item-link" onClick={closeMobile} style={{ color: '#DC2626', backgroundColor: '#FEF2F2', fontWeight: '700' }}>
                <Activity size={16} color="#DC2626" />
                <span>24/7 Emergency & ICU Directory</span>
              </NavLink>

              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to="/book-appointment" className="btn btn-teal" onClick={closeMobile} style={{ width: '100%', justifyContent: 'center' }}>
                  <Calendar size={16} />
                  <span>Book Appointment Slot</span>
                </Link>
                {isAuthenticated ? (
                  <Link
                    to={role === 'admin' ? '/admin/dashboard' : '/patient/dashboard'}
                    className="btn btn-primary"
                    onClick={closeMobile}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <User size={16} />
                    <span>Go to {role === 'admin' ? 'Admin Hub' : 'Patient Dashboard'}</span>
                  </Link>
                ) : (
                  <Link to="/login" className="btn btn-outline-primary" onClick={closeMobile} style={{ width: '100%', justifyContent: 'center' }}>
                    <User size={16} />
                    <span>Patient Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Global Location Picker Modal */}
        <LocationPickerModal
          isOpen={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
        />
      </header>

      <style>{`
        .nav-link-item {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.45rem 0.75rem;
          color: #334155;
          font-weight: 600;
          font-size: 0.88rem;
          border-radius: 8px;
          text-decoration: none;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .nav-link-item:hover {
          color: var(--primary);
          background-color: #F1F5F9;
        }
        .nav-link-item.active {
          color: var(--primary);
          background-color: #EAF6FB;
          font-weight: 700;
        }
        .nav-emergency-header-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0 0.75rem;
          height: 36px;
          color: #DC2626;
          font-weight: 700;
          font-size: 0.82rem;
          border-radius: 8px;
          text-decoration: none;
          background-color: #FEF2F2;
          border: 1px solid #FEE2E2;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        .nav-emergency-header-btn:hover,
        .nav-emergency-header-btn.active {
          background-color: #FEE2E2;
          color: #B91C1C;
          border-color: #FECACA;
        }
        .emergency-live-dot {
          width: 6px;
          height: 6px;
          background-color: #DC2626;
          border-radius: 50%;
          animation: spin 2s infinite ease-in-out;
        }
        .dropdown-item-link {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.55rem 0.95rem;
          color: #334155;
          text-decoration: none;
          font-size: 0.84rem;
          font-weight: 600;
          transition: all 0.15s ease;
        }
        .dropdown-item-link:hover {
          background-color: #F1F5F9;
          color: var(--primary);
        }
        .mobile-item-link {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.6rem 0.85rem;
          color: #334155;
          text-decoration: none;
          font-size: 0.88rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.15s ease;
        }
        .mobile-item-link:hover,
        .mobile-item-link.active {
          background-color: #F1F5F9;
          color: var(--primary);
        }

        @media (max-width: 992px) {
          .navbar-nav-desktop {
            display: none !important;
          }
          .navbar-mobile-toggle {
            display: flex !important;
          }
        }

        @media (max-width: 640px) {
          .hide-on-tablet {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;
