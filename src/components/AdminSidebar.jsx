import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Building2, 
  UserCheck, 
  Layers, 
  Users, 
  Calendar, 
  Stethoscope, 
  ShieldCheck, 
  Receipt, 
  CreditCard, 
  Settings, 
  LogOut,
  HeartPulse,
  Bed
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import toast from 'react-hot-toast';

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Signed out of admin session.');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Hospitals', path: '/admin/hospitals', icon: Building2, badge: 'Ctrl+H' },
    { name: 'Hospital & Wards Hub', path: '/hospital/portal', icon: Bed, badge: 'Ctrl+D' },
    { name: 'Doctors', path: '/admin/doctors', icon: UserCheck },
    { name: 'Departments', path: '/admin/departments', icon: Layers },
    { name: 'Facilities', path: '/admin/facilities', icon: ShieldCheck },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'Services', path: '/admin/services', icon: Stethoscope },
    { name: 'Bills', path: '/admin/bills', icon: Receipt },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  return (
    <aside className="admin-sidebar" aria-label="Admin Navigation Sidebar">
      <div className="admin-sidebar-header">
        <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, var(--teal), #0B6E99)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <HeartPulse size={20} />
        </div>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: '800', color: '#ffffff', lineHeight: 1.1 }}>
            Admin Portal
          </div>
          <span style={{ fontSize: '0.72rem', color: '#80DEEA', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Health Directory Network
          </span>
        </div>
      </div>

      <ul className="admin-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Icon size={18} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <kbd
                    style={{
                      fontSize: '0.66rem',
                      background: 'rgba(255, 255, 255, 0.15)',
                      color: '#E0E7FF',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      fontFamily: 'monospace'
                    }}
                  >
                    {item.badge}
                  </kbd>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <button
          type="button"
          onClick={handleLogout}
          className="admin-nav-item"
          style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: '#EF5350' }}
        >
          <LogOut size={18} />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
