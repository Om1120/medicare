import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  Calendar, 
  FileText, 
  Receipt, 
  CreditCard, 
  User, 
  LogOut,
  Bookmark,
  Sparkles,
  HeartPulse,
  Home,
  ShieldCheck
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const PatientSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Signed out of patient session');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard Overview', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'My Appointments', path: '/patient/appointments', icon: Calendar },
    { name: 'Saved Hospitals & Doctors', path: '/patient/saved', icon: Bookmark },
    { name: 'Medical Records', path: '/patient/records', icon: FileText },
    { name: 'Invoices & Bills', path: '/patient/bills', icon: Receipt },
    { name: 'Payment Records', path: '/patient/payments', icon: CreditCard },
    { name: 'Patient Profile', path: '/patient/profile', icon: User }
  ];

  const initials = (user?.name || 'Rahul Sharma')
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="patient-sidebar" aria-label="Patient Navigation Sidebar">
      
      {/* Patient Profile Badge Card */}
      <div style={{ 
        padding: '1rem', 
        backgroundColor: '#F8FAFC', 
        borderRadius: 'var(--radius-lg)', 
        marginBottom: '1.5rem', 
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--teal))',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '800',
          fontSize: '0.92rem',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(11, 110, 153, 0.25)'
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--primary-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Rahul Sharma'}
            </span>
            <ShieldCheck size={14} color="var(--teal)" style={{ flexShrink: 0 }} />
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email || 'patient@medicare.health'}
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>

      {/* Bottom Shortcuts & Logout */}
      <div style={{ marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            fontSize: '0.82rem', 
            color: 'var(--text-muted)', 
            padding: '0.4rem 0.5rem', 
            textDecoration: 'none',
            borderRadius: '6px'
          }}
        >
          <Home size={15} />
          <span>Back to Main Website</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          className="btn btn-outline-secondary btn-sm"
          style={{ width: '100%', color: 'var(--danger)', borderColor: 'var(--danger-bg)', justifyContent: 'center' }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
};

export default PatientSidebar;
