import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Building2,
  Scale,
  Activity
} from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--primary-dark)', color: '#EAF6FB', marginTop: 'auto', borderTop: '4px solid var(--teal)' }}>
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
          
          {/* Col 1: Platform Overview */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'linear-gradient(135deg, var(--teal), #0B6E99)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <HeartPulse size={24} />
              </div>
              <div>
                <h3 style={{ color: '#ffffff', fontSize: '1.35rem', margin: 0 }}>MediCare</h3>
                <span style={{ fontSize: '0.72rem', color: '#A0D3E8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Care Access & Discovery Network
                </span>
              </div>
            </div>
            <p style={{ color: '#B0BEC5', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Empowering patients and families to discover nearby hospitals, compare critical infrastructure, find specialized doctors, and book clinical consultations with transparency.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#80DEEA', fontSize: '0.82rem' }}>
              <ShieldCheck size={16} />
              <span>Verified Hospital Data Network</span>
            </div>
          </div>

          {/* Col 2: Hospital Discovery */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--teal)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Hospital Discovery
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/hospitals" style={{ color: '#B0BEC5', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ChevronRight size={14} color="#16A6A3" /> Find Hospitals Near Me
                </Link>
              </li>
              <li>
                <Link to="/compare" style={{ color: '#B0BEC5', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ChevronRight size={14} color="#16A6A3" /> Compare Hospitals Side-by-Side
                </Link>
              </li>
              <li>
                <Link to="/emergency" style={{ color: '#B0BEC5', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ChevronRight size={14} color="#16A6A3" /> 24/7 Emergency & ICU Directory
                </Link>
              </li>
              <li>
                <Link to="/departments" style={{ color: '#B0BEC5', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ChevronRight size={14} color="#16A6A3" /> Medical Departments
                </Link>
              </li>
              <li>
                <Link to="/facilities" style={{ color: '#B0BEC5', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ChevronRight size={14} color="#16A6A3" /> Facilities & Diagnostic Labs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Care Services & Patient Access */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--teal)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Patient Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/doctors" style={{ color: '#B0BEC5', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ChevronRight size={14} color="#16A6A3" /> Find Specialist Doctors
                </Link>
              </li>
              <li>
                <Link to="/book-appointment" style={{ color: '#B0BEC5', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ChevronRight size={14} color="#16A6A3" /> Book Consultation Slot
                </Link>
              </li>
              <li>
                <Link to="/services" style={{ color: '#B0BEC5', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ChevronRight size={14} color="#16A6A3" /> Clinical Services & Packages
                </Link>
              </li>
              <li>
                <Link to="/health-information" style={{ color: '#B0BEC5', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ChevronRight size={14} color="#16A6A3" /> Preventive Health Education
                </Link>
              </li>
              <li>
                <Link to="/patient/dashboard" style={{ color: '#B0BEC5', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <ChevronRight size={14} color="#16A6A3" /> Patient Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Healthcare Support */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.25rem', borderBottom: '2px solid var(--teal)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Emergency & Inquiries
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <li style={{ display: 'flex', gap: '0.75rem', color: '#B0BEC5', fontSize: '0.86rem' }}>
                <MapPin size={18} color="#16A6A3" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Central Healthcare Network, SG Highway, Ahmedabad 380054, Gujarat</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: '#B0BEC5', fontSize: '0.86rem' }}>
                <Phone size={18} color="#16A6A3" style={{ flexShrink: 0 }} />
                <span>Emergency Hotline: 108 / 102</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: '#B0BEC5', fontSize: '0.86rem' }}>
                <Mail size={18} color="#16A6A3" style={{ flexShrink: 0 }} />
                <span>contact@medicare.health</span>
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', color: '#B0BEC5', fontSize: '0.86rem' }}>
                <Clock size={18} color="#16A6A3" style={{ flexShrink: 0 }} />
                <span>Emergency Services: 24/7 Available</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Transparency Note */}
        <div style={{ marginTop: '3rem', padding: '1rem 1.25rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.8rem', color: '#B0BEC5', lineHeight: '1.5' }}>
          <strong>Transparency Notice:</strong> Hospital details, distance estimates, operating hours, and consultation fee ranges are compiled from verified hospital directory registries and health authority datasets. Please contact individual hospitals directly to confirm exact slot availability and specialized emergency procedures.
        </div>

        {/* Copyright & Legal Links */}
        <div style={{ marginTop: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', color: '#90A4AE', fontSize: '0.8rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '1.25rem' }}>
          <div>© 2026 MediCare Healthcare Discovery Network. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/about" style={{ color: '#90A4AE' }}>About</Link>
            <Link to="/contact" style={{ color: '#90A4AE' }}>Contact</Link>
            <Link to="/health-information" style={{ color: '#90A4AE' }}>Health Info</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
