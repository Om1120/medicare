import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Scale, 
  Trash2, 
  Check, 
  X, 
  ShieldCheck, 
  Calendar, 
  RotateCcw, 
  Info, 
  MapPin, 
  Compass, 
  Activity, 
  Bed, 
  Building2,
  CheckCircle2,
  Sparkles,
  Star,
  Layers,
  Search,
  Stethoscope,
  Clock,
  HeartPulse,
  Navigation,
  ExternalLink,
  Plus
} from 'lucide-react';
import { 
  addHospitalToCompare, 
  removeHospitalFromCompare, 
  clearHospitalComparison, 
  setPriorities, 
  resetPriorities 
} from '../redux/slices/comparisonSlice';
import { calculateHospitalMatch } from '../services/comparisonService';
import { formatDistance, estimateTravelTime } from '../services/locationService';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const HospitalComparison = ({ hospitals = [], allHospitals = [], allDoctors = [] }) => {
  const dispatch = useDispatch();
  const { priorities, hospitalIds } = useSelector(state => state.comparison);
  const { userCoords } = useSelector(state => state.location);
  
  const [cityFilter, setCityFilter] = useState('ALL');
  const [traySearchInput, setTraySearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Compute list of unique cities
  const cities = Array.from(new Set(allHospitals.map(h => h.city).filter(Boolean)));

  // Filter the allHospitals tray by city and search keyword
  const visibleTrayHospitals = allHospitals.filter(h => {
    const matchesCity = cityFilter === 'ALL' || h.city.toLowerCase() === cityFilter.toLowerCase();
    if (!matchesCity) return false;
    if (appliedSearch.trim()) {
      const q = appliedSearch.toLowerCase().trim();
      const matchName = h.name.toLowerCase().includes(q);
      const matchCity = h.city.toLowerCase().includes(q);
      const matchSpec = (h.specialties || []).some(s => s.toLowerCase().includes(q));
      return matchName || matchCity || matchSpec;
    }
    return true;
  });

  // Filter compared hospitals if search applied
  const displayedComparedHospitals = hospitals.filter(h => {
    if (!appliedSearch.trim()) return true;
    const q = appliedSearch.toLowerCase().trim();
    return (
      h.name.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      (h.specialties || []).some(s => s.toLowerCase().includes(q))
    );
  });

  // Calculate match scores for all compared hospitals based on current priorities
  const scoredHospitals = (displayedComparedHospitals.length > 0 ? displayedComparedHospitals : hospitals).map(h => {
    const matchResult = calculateHospitalMatch(h, priorities, { userCoords });
    return { ...h, matchResult };
  });

  // Handle Search Trigger
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setAppliedSearch(traySearchInput.trim());
    if (traySearchInput.trim()) {
      toast.success(`Showing results matching "${traySearchInput.trim()}"`);
    }
  };

  const handleClearSearch = () => {
    setTraySearchInput('');
    setAppliedSearch('');
  };

  // Handler to toggle hospital in comparison
  const handleToggleHospital = (hospitalId) => {
    if (hospitalIds.includes(hospitalId)) {
      dispatch(removeHospitalFromCompare(hospitalId));
      toast.success('Removed hospital from comparison.');
    } else {
      dispatch(addHospitalToCompare(hospitalId));
      toast.success('Hospital selected for comparison.');
    }
  };

  // Quick preset: Select all hospitals
  const handleSelectAll = () => {
    // Respect the max 4 hospital comparison limit
    const toAdd = allHospitals.filter(h => !hospitalIds.includes(h.id)).slice(0, 4 - hospitalIds.length);
    toAdd.forEach(h => dispatch(addHospitalToCompare(h.id)));
    if (toAdd.length > 0) {
      toast.success(`Added ${toAdd.length} hospital${toAdd.length > 1 ? 's' : ''}. Max 4 hospitals in comparison.`);
    } else {
      toast(`Comparison is at maximum capacity (4 hospitals).`, { icon: 'ℹ️' });
    }
  };

  // Quick preset: Top 24/7 Emergency
  const handleSelectEmergencyOnly = () => {
    dispatch(clearHospitalComparison());
    allHospitals.filter(h => h.emergencyServices).forEach(h => {
      dispatch(addHospitalToCompare(h.id));
    });
    toast.success('Selected 24/7 Emergency hospitals.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. ALL HOSPITALS SELECTOR & SEARCH TRAY */}
      <div
        className="card"
        style={{
          padding: '1.5rem',
          backgroundColor: '#ffffff',
          border: '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--teal)', fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <Layers size={15} />
              <span>Hospital Selection Hub</span>
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', margin: '0.2rem 0' }}>
              Select Hospitals to View Details ({hospitals.length} selected of {allHospitals.length})
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
              Click any hospital card below to select it and reveal its full details (Services, Charges, Doctors & Distance).
            </p>
          </div>

          {/* Quick Action Presets */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSelectAll}
              className="btn btn-outline-primary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <CheckCircle2 size={13} />
              <span>Select All ({allHospitals.length})</span>
            </button>
            <button
              type="button"
              onClick={handleSelectEmergencyOnly}
              className="btn btn-outline-secondary btn-sm"
              style={{ fontSize: '0.78rem' }}
            >
              <Activity size={13} color="var(--danger)" />
              <span>24/7 Emergency Only</span>
            </button>
            {hospitalIds.length > 0 && (
              <button
                type="button"
                onClick={() => dispatch(clearHospitalComparison())}
                className="btn btn-outline-secondary btn-sm"
                style={{ fontSize: '0.78rem', color: 'var(--danger)' }}
              >
                <Trash2 size={13} />
                <span>Clear Selection</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar with dedicated Search Button */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search
              size={17}
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search hospitals by name, city, or specialty (e.g. UN Mehta, Zydus, Cardiology, Surat)..."
              value={traySearchInput}
              onChange={(e) => setTraySearchInput(e.target.value)}
              style={{ paddingLeft: '2.4rem', height: '40px', fontSize: '0.88rem' }}
            />
            {traySearchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-sm"
            style={{ height: '40px', padding: '0 1.25rem', gap: '0.4rem', fontWeight: '700' }}
          >
            <Search size={15} />
            <span>Search</span>
          </button>

          {appliedSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="btn btn-outline-secondary btn-sm"
              style={{ height: '40px' }}
            >
              <span>Clear Search</span>
            </button>
          )}
        </form>

        {/* City Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.85rem' }}>
          <button
            type="button"
            onClick={() => setCityFilter('ALL')}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.76rem',
              fontWeight: cityFilter === 'ALL' ? '700' : '600',
              border: cityFilter === 'ALL' ? '1.5px solid var(--primary)' : '1px solid var(--border)',
              backgroundColor: cityFilter === 'ALL' ? 'var(--primary)' : '#ffffff',
              color: cityFilter === 'ALL' ? '#ffffff' : 'var(--text-body)',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            All Regions ({allHospitals.length})
          </button>
          {cities.map(city => {
            const count = allHospitals.filter(h => h.city === city).length;
            const isSelected = cityFilter.toLowerCase() === city.toLowerCase();
            return (
              <button
                key={city}
                type="button"
                onClick={() => setCityFilter(city)}
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.76rem',
                  fontWeight: isSelected ? '700' : '600',
                  border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
                  color: isSelected ? '#ffffff' : 'var(--text-body)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {city} ({count})
              </button>
            );
          })}
        </div>

        {/* Selectable Hospital Chips Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '0.65rem',
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '0.35rem 0'
          }}
        >
          {visibleTrayHospitals.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.86rem' }}>
              No hospitals match "{appliedSearch}". Try a different city or search term.
            </div>
          ) : (
            visibleTrayHospitals.map(h => {
              const isSelected = hospitalIds.includes(h.id);
              return (
                <div
                  key={h.id}
                  onClick={() => handleToggleHospital(h.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? '#EAF6FB' : '#F8FAFC',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
                      border: isSelected ? 'none' : '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      flexShrink: 0
                    }}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </div>

                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {h.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {h.city} • {h.totalBeds} Beds • {h.consultationFeeRange}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. IF NO HOSPITALS SELECTED -> EMPTY STATE */}
      {scoredHospitals.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            border: '2px dashed var(--border)',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#EAF6FB',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Building2 size={32} />
          </div>

          <div style={{ maxWidth: '520px' }}>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', fontWeight: '800', marginBottom: '0.4rem' }}>
              No Hospital Selected Yet
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
              Please select one or more hospitals from the selector above to display their complete details: 
              <strong> Services & Facilities</strong>, <strong>Charges & PMJAY Schemes</strong>, <strong>Affiliated Specialist Doctors</strong>, and <strong>GPS Distance & Drive Time</strong>.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={handleSelectAll}
              className="btn btn-primary btn-sm"
              style={{ fontWeight: '700' }}
            >
              <Plus size={15} />
              <span>Select All Hospitals ({allHospitals.length})</span>
            </button>
            <button
              type="button"
              onClick={handleSelectEmergencyOnly}
              className="btn btn-outline-secondary btn-sm"
              style={{ fontWeight: '700' }}
            >
              <Activity size={15} color="var(--danger)" />
              <span>Select 24/7 Emergency Centers</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* 3. PERSONALIZED DECISION & PRIORITY SLIDERS */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--teal)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  Personalized Decision Engine
                </span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', margin: '0.2rem 0' }}>
                  Customize Your Healthcare Priorities
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Adjust weights below. Match scores are mathematically computed based strictly on your chosen criteria.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => dispatch(resetPriorities())}
                  className="btn btn-outline-secondary btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  <RotateCcw size={13} />
                  <span>Reset Weights</span>
                </button>
              </div>
            </div>

            {/* Priority Sliders */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span>Proximity & Distance</span>
                  <span style={{ color: 'var(--primary)' }}>{priorities.distance}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.distance}
                  onChange={(e) => dispatch(setPriorities({ distance: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span>Emergency & Critical Care</span>
                  <span style={{ color: 'var(--teal)' }}>{priorities.emergency}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.emergency}
                  onChange={(e) => dispatch(setPriorities({ emergency: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--teal)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span>Specialties & Services</span>
                  <span style={{ color: 'var(--primary-dark)' }}>{priorities.specialties}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.specialties}
                  onChange={(e) => dispatch(setPriorities({ specialties: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--primary-dark)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span>Facilities & Infrastructure</span>
                  <span style={{ color: 'var(--primary)' }}>{priorities.facilities}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.facilities}
                  onChange={(e) => dispatch(setPriorities({ facilities: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: '600', marginBottom: '0.35rem' }}>
                  <span>Consultation Pricing & Scheme</span>
                  <span style={{ color: 'var(--teal)' }}>{priorities.pricing}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priorities.pricing}
                  onChange={(e) => dispatch(setPriorities({ pricing: Number(e.target.value) }))}
                  style={{ width: '100%', accentColor: 'var(--teal)', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

          {/* 4. COMPREHENSIVE SIDE-BY-SIDE DETAILS TABLE */}
          <div className="table-responsive" style={{ boxShadow: 'var(--shadow-md)', backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
            <table className="table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th style={{ width: '220px', minWidth: '180px', verticalAlign: 'top', backgroundColor: '#F1F5F9', position: 'sticky', left: 0, zIndex: 10 }}>
                    <span style={{ fontSize: '0.88rem', color: 'var(--primary-dark)', fontWeight: '800' }}>Hospital Attributes</span>
                  </th>
                  {scoredHospitals.map(h => (
                    <th key={h.id} style={{ minWidth: '260px', verticalAlign: 'top', textAlign: 'left', backgroundColor: '#ffffff', borderLeft: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.45rem' }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--teal)', fontWeight: '800', textTransform: 'uppercase' }}>
                          {h.type}
                        </span>
                        <button
                          type="button"
                          onClick={() => dispatch(removeHospitalFromCompare(h.id))}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                          title="Remove from comparison"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)', marginBottom: '0.3rem', fontWeight: '800' }}>
                        <Link to={`/hospitals/${h.id}`} style={{ color: 'inherit' }}>
                          {h.name}
                        </Link>
                      </h4>

                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 'normal', margin: '0 0 0.65rem 0' }}>
                        {h.address}, {h.city}
                      </p>

                      {/* Computed Match Rating */}
                      <div
                        style={{
                          backgroundColor: 'var(--primary-light)',
                          border: '1px solid #c8e2f0',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.55rem 0.7rem',
                          marginBottom: '0.75rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--primary-dark)', fontWeight: '700' }}>Priority Match:</span>
                          <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary)' }}>
                            {h.matchResult.score}%
                          </span>
                        </div>
                        <div style={{ width: '100%', height: '5px', backgroundColor: '#d5eaf5', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${h.matchResult.score}%`, height: '100%', backgroundColor: 'var(--primary)' }} />
                        </div>
                      </div>

                      <Link to={`/book-appointment?hospitalId=${h.id}`} className="btn btn-primary btn-sm" style={{ width: '100%', fontSize: '0.78rem' }}>
                        <Calendar size={13} />
                        <span>Book Appointment</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>

                {/* 📍 SECTION 1: DISTANCE & PROXIMITY */}
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  <td colSpan={scoredHospitals.length + 1} style={{ fontWeight: '800', color: 'var(--primary-dark)', fontSize: '0.82rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    📍 1. Distance & Geographic Accessibility (અંતર અને પહોંચવાનો સમય)
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Distance from You</td>
                  {scoredHospitals.map(h => (
                    <td key={h.id} style={{ borderLeft: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '700', color: 'var(--primary-dark)' }}>
                        <MapPin size={14} color="var(--primary)" />
                        <span>{formatDistance(h.distanceKm) || 'Location not set'}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Estimated Travel Time</td>
                  {scoredHospitals.map(h => (
                    <td key={h.id} style={{ borderLeft: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--teal)', fontWeight: '600' }}>
                        <Clock size={14} />
                        <span>{estimateTravelTime(h.distanceKm) || 'Enable GPS to calculate'}</span>
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Full Address</td>
                  {scoredHospitals.map(h => (
                    <td key={h.id} style={{ borderLeft: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {h.address}, {h.city}, {h.state} - {h.postalCode}
                    </td>
                  ))}
                </tr>

                {/* 💰 SECTION 2: CHARGES & FEES */}
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  <td colSpan={scoredHospitals.length + 1} style={{ fontWeight: '800', color: 'var(--primary-dark)', fontSize: '0.82rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    💰 2. Charges, Consultation Fees & Government Schemes (ચાર્જ અને પીએમજેએવાય)
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Consultation Fee Range</td>
                  {scoredHospitals.map(h => (
                    <td key={h.id} style={{ borderLeft: '1px solid var(--border)' }}>
                      <strong style={{ color: 'var(--primary-dark)', fontSize: '0.92rem' }}>
                        {h.consultationFeeRange}
                      </strong>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>PMJAY-MA / Cashless Scheme</td>
                  {scoredHospitals.map(h => {
                    const isPmjay = (h.insuranceAccepted || []).some(ins => ins.toLowerCase().includes('pmjay') || ins.toLowerCase().includes('amrutam') || ins.toLowerCase().includes('ayushman'));
                    return (
                      <td key={h.id} style={{ borderLeft: '1px solid var(--border)' }}>
                        {isPmjay ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.25rem 0.6rem', borderRadius: '4px', fontSize: '0.78rem', color: '#166534', fontWeight: '700' }}>
                            <CheckCircle2 size={13} color="#16A34A" />
                            <span>100% Free under PMJAY-MA</span>
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Standard Private Insurance
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Insurance Accepted</td>
                  {scoredHospitals.map(h => (
                    <td key={h.id} style={{ borderLeft: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {(h.insuranceAccepted || []).map((ins, i) => (
                          <span key={i} style={{ fontSize: '0.72rem', backgroundColor: '#F1F5F9', padding: '0.15rem 0.45rem', borderRadius: '3px' }}>
                            {ins}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Ownership & Model</td>
                  {scoredHospitals.map(h => (
                    <td key={h.id} style={{ borderLeft: '1px solid var(--border)', fontSize: '0.82rem' }}>
                      <span className="badge badge-info">{h.ownership}</span>
                    </td>
                  ))}
                </tr>

                {/* 👨‍⚕️ SECTION 3: AFFILIATED SPECIALIST DOCTORS */}
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  <td colSpan={scoredHospitals.length + 1} style={{ fontWeight: '800', color: 'var(--primary-dark)', fontSize: '0.82rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    👨‍⚕️ 3. Affiliated Specialist Doctors (નિષ્ણાત ડોક્ટરોની ટીમ)
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Available Specialists</td>
                  {scoredHospitals.map(h => {
                    const hospitalDocs = allDoctors.filter(d => d.hospitalId === h.id || (d.hospitalIds && d.hospitalIds.includes(h.id)));
                    return (
                      <td key={h.id} style={{ borderLeft: '1px solid var(--border)' }}>
                        {hospitalDocs.length === 0 ? (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>No direct profile listed</span>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {hospitalDocs.map(doc => (
                              <div
                                key={doc.id}
                                style={{
                                  padding: '0.5rem 0.6rem',
                                  backgroundColor: '#F8FAFC',
                                  borderRadius: '6px',
                                  border: '1px solid var(--border)',
                                  fontSize: '0.76rem'
                                }}
                              >
                                <div style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>
                                  <Link to={`/doctors/${doc.id}`} style={{ color: 'inherit' }}>
                                    {doc.name}
                                  </Link>
                                </div>
                                <div style={{ color: 'var(--teal)', fontWeight: '600' }}>{doc.specialization}</div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                                  {doc.experience} • {formatCurrency(doc.fee)}
                                </div>
                                <div style={{ marginTop: '0.3rem' }}>
                                  <Link
                                    to={`/book-appointment?doctorId=${doc.id}&hospitalId=${h.id}`}
                                    className="btn btn-primary btn-sm"
                                    style={{ padding: '0.15rem 0.45rem', fontSize: '0.68rem' }}
                                  >
                                    Book Dr. {doc.name.split(' ').pop()}
                                  </Link>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* 🏥 SECTION 4: CLINICAL SERVICES & FACILITIES */}
                <tr style={{ backgroundColor: '#F8FAFC' }}>
                  <td colSpan={scoredHospitals.length + 1} style={{ fontWeight: '800', color: 'var(--primary-dark)', fontSize: '0.82rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    🏥 4. Clinical Services & Infrastructure (તબીબી સેવાઓ અને સુવિધાઓ)
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>24/7 Emergency Unit</td>
                  {scoredHospitals.map(h => (
                    <td key={h.id} style={{ borderLeft: '1px solid var(--border)' }}>
                      {h.emergencyServices ? (
                        <span style={{ color: 'var(--success)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Check size={15} /> Yes (24 Hours Open)
                        </span>
                      ) : (
                        <span style={{ color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <X size={15} /> OPD Only
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>ICU Beds</td>
                  {(() => {
                    const bestIcuBeds = Math.max(...scoredHospitals.map(h => h.icuBeds || 0));
                    return scoredHospitals.map(h => (
                      <td key={h.id} style={{ borderLeft: '1px solid var(--border)', backgroundColor: h.icuBeds === bestIcuBeds ? '#F0FDF4' : undefined }}>
                        <strong style={{ color: h.icuBeds === bestIcuBeds ? '#16A34A' : 'var(--primary-dark)' }}>
                          {h.icuBeds} Critical Care Beds
                          {h.icuBeds === bestIcuBeds && <span style={{ fontSize: '0.68rem', marginLeft: '0.3rem', backgroundColor: '#16A34A', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>BEST</span>}
                        </strong>
                      </td>
                    ));
                  })()}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Total Inpatient Beds</td>
                  {(() => {
                    const bestTotalBeds = Math.max(...scoredHospitals.map(h => h.totalBeds || 0));
                    return scoredHospitals.map(h => (
                      <td key={h.id} style={{ borderLeft: '1px solid var(--border)', backgroundColor: h.totalBeds === bestTotalBeds ? '#F0FDF4' : undefined }}>
                        <strong style={{ color: h.totalBeds === bestTotalBeds ? '#16A34A' : 'var(--primary-dark)' }}>
                          {h.totalBeds} Beds
                          {h.totalBeds === bestTotalBeds && <span style={{ fontSize: '0.68rem', marginLeft: '0.3rem', backgroundColor: '#16A34A', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>BEST</span>}
                        </strong>
                      </td>
                    ));
                  })()}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Modular OTs</td>
                  {(() => {
                    const bestOTs = Math.max(...scoredHospitals.map(h => h.operationTheatres || 0));
                    return scoredHospitals.map(h => (
                      <td key={h.id} style={{ borderLeft: '1px solid var(--border)', backgroundColor: h.operationTheatres === bestOTs ? '#F0FDF4' : undefined }}>
                        <span style={{ color: h.operationTheatres === bestOTs ? '#16A34A' : undefined, fontWeight: h.operationTheatres === bestOTs ? '700' : '400' }}>
                          {h.operationTheatres} Operation Theatres
                          {h.operationTheatres === bestOTs && <span style={{ fontSize: '0.68rem', marginLeft: '0.3rem', backgroundColor: '#16A34A', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '3px' }}>BEST</span>}
                        </span>
                      </td>
                    ));
                  })()}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Specialties Offered</td>
                  {scoredHospitals.map(h => (
                    <td key={h.id} style={{ borderLeft: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {(h.specialties || []).map((s, i) => (
                          <span key={i} style={{ fontSize: '0.72rem', backgroundColor: 'var(--primary-light)', padding: '0.15rem 0.45rem', borderRadius: '3px' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Patient Rating</td>
                  {(() => {
                    const bestRating = Math.max(...scoredHospitals.map(h => h.rating || 0));
                    return scoredHospitals.map(h => (
                      <td key={h.id} style={{ borderLeft: '1px solid var(--border)', backgroundColor: h.rating === bestRating ? '#FFFBEB' : undefined }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Star size={14} fill="#F59E0B" color="#F59E0B" />
                          <strong style={{ color: h.rating === bestRating ? '#92400E' : 'var(--primary-dark)', fontSize: '0.95rem' }}>
                            {h.rating}
                          </strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({(h.reviewCount || 0).toLocaleString()} reviews)</span>
                          {h.rating === bestRating && <span style={{ fontSize: '0.68rem', backgroundColor: '#F59E0B', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '3px', fontWeight: '700' }}>BEST</span>}
                        </div>
                      </td>
                    ));
                  })()}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Onsite Pharmacy & Diagnostics</td>
                  {scoredHospitals.map(h => (
                    <td key={h.id} style={{ borderLeft: '1px solid var(--border)', fontSize: '0.8rem' }}>
                      <div>Pharmacy: {h.pharmacyAvailable ? '✅ 24/7 Available' : '❌ No'}</div>
                      <div>Pathology/Radiology: {h.laboratoryAvailable ? '✅ 24/7 Available' : '❌ No'}</div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Ambulance Fleet</td>
                  {scoredHospitals.map(h => (
                    <td key={h.id} style={{ borderLeft: '1px solid var(--border)', fontSize: '0.82rem' }}>
                      {h.ambulanceAvailable ? "✅ ACLS Fleet Ready 24/7" : "❌ Not listed"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Amenities</td>
                  {scoredHospitals.map(h => (
                    <td key={h.id} style={{ borderLeft: '1px solid var(--border)' }}>
                      <ul style={{ paddingLeft: '1.1rem', margin: 0, fontSize: '0.8rem' }}>
                        {(h.amenities || []).map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ fontWeight: '700', color: 'var(--text-dark)', position: 'sticky', left: 0, backgroundColor: '#ffffff' }}>Accreditation</td>
                  {scoredHospitals.map(h => (
                    <td key={h.id} style={{ borderLeft: '1px solid var(--border)', fontSize: '0.8rem' }}>
                      <span className="badge badge-success">{h.accreditation}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

    </div>
  );
};

export default HospitalComparison;
