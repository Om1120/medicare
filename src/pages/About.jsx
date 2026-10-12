import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  ShieldCheck, 
  Users, 
  Award, 
  Target, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

const About = () => {
  return (
    <div className="about-page" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '3.5rem' }}>
          <span className="section-subtitle">Our Heritage & Purpose</span>
          <h1 className="section-title">About MediCare Healthcare Network</h1>
          <p className="section-description">
            Dedicated to patient-first discovery, transparent hospital comparisons, advanced clinical outcomes, and verified appointments.
          </p>
        </div>

        {/* Intro Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center', marginBottom: '4.5rem' }}>
          <div>
            <span className="badge badge-info" style={{ marginBottom: '0.75rem' }}>
              Integrated Healthcare Network
            </span>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem', lineHeight: '1.25' }}>
              Connecting Patients with Verified Hospitals and Medical Specialists
            </h2>
            <p style={{ color: 'var(--text-body)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
              The MediCare Healthcare Platform was built with a singular mission: to make medical discovery, doctor credentials, department facilities, and clinical appointments accessible, transparent, and objective for every patient.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              We bring together accredited hospitals, certified clinicians across cardiology, neurology, pediatrics, orthopedics, and surgical specialties with transparent comparison criteria.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/hospitals" className="btn btn-primary">
                <span>Discover Hospitals</span>
                <ArrowRight size={16} />
              </Link>
              <Link to="/compare" className="btn btn-outline-primary">
                <span>Compare Facilities</span>
              </Link>
            </div>
          </div>

          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=700&q=80"
              alt="MediCare Intensive Care Facility"
              style={{ width: '100%', height: '380px', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* Network Scale */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--primary-dark) 0%, #0B6E99 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            marginBottom: '4.5rem',
            textAlign: 'center'
          }}
        >
          <div style={{ color: '#80DEEA', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>
            Healthcare Scale & Coverage
          </div>
          <h3 style={{ color: '#ffffff', fontSize: '1.8rem', marginBottom: '2.5rem' }}>
            Verified Multi-Hospital Network
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#80DEEA', fontFamily: 'var(--font-heading)' }}>6+</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ECEFF1' }}>Major Hospitals</div>
              <div style={{ fontSize: '0.75rem', color: '#B0BEC5' }}>Accredited Facilities</div>
            </div>
            <div>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#80DEEA', fontFamily: 'var(--font-heading)' }}>12+</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ECEFF1' }}>Medical Specialists</div>
              <div style={{ fontSize: '0.75rem', color: '#B0BEC5' }}>Board-Certified Doctors</div>
            </div>
            <div>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#80DEEA', fontFamily: 'var(--font-heading)' }}>1,500+</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ECEFF1' }}>Network Beds</div>
              <div style={{ fontSize: '0.75rem', color: '#B0BEC5' }}>General & ICU Capacity</div>
            </div>
            <div>
              <div style={{ fontSize: '2.8rem', fontWeight: '800', color: '#80DEEA', fontFamily: 'var(--font-heading)' }}>24/7</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#ECEFF1' }}>Emergency Care</div>
              <div style={{ fontSize: '0.75rem', color: '#B0BEC5' }}>Rapid Ambulance Response</div>
            </div>
          </div>
        </div>

        {/* Mission, Vision & Values */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          
          <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--primary)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Target size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>Our Mission</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
              To deliver compassionate, comprehensive, and evidence-driven healthcare services that enhance the quality of life of every patient entrusted to our care.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--teal)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--teal-light)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Eye size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>Our Vision</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
              To be the most trusted healthcare institution, recognized for medical excellence, cutting-edge technology, accessible pricing, and uncompromising clinical ethics.
            </p>
          </div>

          <div className="card" style={{ padding: '2rem', borderTop: '4px solid var(--success)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>Our Core Values</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--text-body)' }}>
              <div>• <strong>Compassion:</strong> Caring with empathy</div>
              <div>• <strong>Integrity:</strong> Honest clinical practice</div>
              <div>• <strong>Excellence:</strong> Continuous medical innovation</div>
              <div>• <strong>Accessibility:</strong> Patient-first assistance</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default About;
