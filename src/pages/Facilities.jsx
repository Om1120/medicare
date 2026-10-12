import React from 'react';
import { Building2, ShieldCheck, Clock, Users, HeartPulse } from 'lucide-react';
import FacilityCard from '../components/FacilityCard';
import defaultFacilities from '../data/facilities.json';

const Facilities = () => {
  return (
    <div className="facilities-page" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        
        {/* Page Header */}
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <span className="section-subtitle">World-Class Infrastructure</span>
          <h1 className="section-title">Hospital Facilities</h1>
          <p className="section-description">
            Explore our clinical suites, critical intensive care wings, advanced robotic operating theatres, and patient care amenities.
          </p>
        </div>

        {/* Feature Highlights Banner */}
        <div
          style={{
            backgroundColor: '#123B5D',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            marginBottom: '3.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#80DEEA', fontFamily: 'var(--font-heading)' }}>120+</div>
            <div style={{ fontSize: '0.9rem', color: '#ECEFF1', fontWeight: '600' }}>Inpatient Hospital Beds</div>
            <div style={{ fontSize: '0.75rem', color: '#B0BEC5' }}>Modular Private & Semi-Private</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#80DEEA', fontFamily: 'var(--font-heading)' }}>40</div>
            <div style={{ fontSize: '0.9rem', color: '#ECEFF1', fontWeight: '600' }}>Critical ICU / CCU Beds</div>
            <div style={{ fontSize: '0.75rem', color: '#B0BEC5' }}>Dedicated Ventilators & Telemetry</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#80DEEA', fontFamily: 'var(--font-heading)' }}>8</div>
            <div style={{ fontSize: '0.9rem', color: '#ECEFF1', fontWeight: '600' }}>Modular Operation Theatres</div>
            <div style={{ fontSize: '0.75rem', color: '#B0BEC5' }}>Laminar Air Flow Sterile Zones</div>
          </div>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#80DEEA', fontFamily: 'var(--font-heading)' }}>24/7</div>
            <div style={{ fontSize: '0.9rem', color: '#ECEFF1', fontWeight: '600' }}>Trauma & Emergency Care</div>
            <div style={{ fontSize: '0.75rem', color: '#B0BEC5' }}>Hotline Response Fleet</div>
          </div>
        </div>

        {/* Facilities Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
          {defaultFacilities.map((fac) => (
            <FacilityCard key={fac.id} facility={fac} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Facilities;
