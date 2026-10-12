import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  Building2, 
  User, 
  Plus, 
  ArrowRight,
  CheckCircle2,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  MapPin,
  Compass
} from 'lucide-react';
import HospitalComparison from '../components/HospitalComparison';
import DoctorComparison from '../components/DoctorComparison';
import { 
  setActiveComparisonTab, 
  addHospitalToCompare, 
  removeHospitalFromCompare,
  addDoctorToCompare,
  removeDoctorFromCompare
} from '../redux/slices/comparisonSlice';
import { calculateDistance } from '../services/locationService';

const Compare = () => {
  const dispatch = useDispatch();
  const { hospitalIds, doctorIds, activeTab } = useSelector(state => state.comparison);
  const { items: allHospitals } = useSelector(state => state.hospitals);
  const { items: allDoctors } = useSelector(state => state.doctors);
  const { userCoords } = useSelector(state => state.location);

  // If user selected specific hospitals in Redux, show only those selected hospitals.
  // Otherwise, list is empty so no details are shown until user selects!
  const effectiveHospitalList = hospitalIds.map(id => allHospitals.find(h => h.id === id)).filter(Boolean);

  // Enrich with live distance
  const selectedHospitals = effectiveHospitalList.map(h => {
    let distanceKm = null;
    if (userCoords) {
      distanceKm = calculateDistance(userCoords.latitude, userCoords.longitude, h.latitude, h.longitude);
    }
    return { ...h, distanceKm };
  });

  // Effective doctors (only selected doctors)
  const effectiveDoctorList = doctorIds.map(id => allDoctors.find(d => d.id === id)).filter(Boolean);

  return (
    <div style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--teal)', fontSize: '0.82rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '0.35rem' }}>
              <Scale size={16} />
              <span>Multi-Hospital & Doctor Decision Matrix</span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.85rem, 3vw, 2.4rem)', color: 'var(--primary-dark)', margin: 0 }}>
              Compare Healthcare Facilities
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem', marginBottom: 0 }}>
              Full side-by-side evaluation of every hospital's ICU readiness, bed capacity, OPD fees, and priority matching without typing names.
            </p>
          </div>

          {/* Tab Switcher: Hospitals vs Doctors */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '0.25rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <button
              type="button"
              onClick={() => dispatch(setActiveComparisonTab('hospitals'))}
              style={{
                padding: '0.5rem 1.15rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: activeTab === 'hospitals' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'hospitals' ? '#ffffff' : 'var(--text-body)',
                fontSize: '0.88rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease'
              }}
            >
              <Building2 size={16} />
              <span>Hospitals ({selectedHospitals.length})</span>
            </button>

            <button
              type="button"
              onClick={() => dispatch(setActiveComparisonTab('doctors'))}
              style={{
                padding: '0.5rem 1.15rem',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: activeTab === 'doctors' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'doctors' ? '#ffffff' : 'var(--text-body)',
                fontSize: '0.88rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease'
              }}
            >
              <User size={16} />
              <span>Doctors ({effectiveDoctorList.length})</span>
            </button>
          </div>
        </div>

        {/* Content View */}
        {activeTab === 'hospitals' ? (
          <HospitalComparison 
            hospitals={selectedHospitals} 
            allHospitals={allHospitals}
            allDoctors={allDoctors}
          />
        ) : (
          <DoctorComparison 
            doctors={effectiveDoctorList} 
            allDoctors={allDoctors}
          />
        )}

      </div>
    </div>
  );
};

export default Compare;
