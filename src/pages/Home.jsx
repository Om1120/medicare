import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Building2, 
  Scale, 
  Activity, 
  Stethoscope, 
  Calendar, 
  ShieldCheck, 
  Compass, 
  HeartPulse, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Layers,
  Sparkles,
  PhoneCall,
  Loader2
} from 'lucide-react';
import HospitalCard from '../components/HospitalCard';
import DoctorCard from '../components/DoctorCard';
import { setSearchQuery, setSelectedCity, setSelectedSpecialty, setSortBy } from '../redux/slices/hospitalSlice';
import { setUserCoords, setLocationLoading, setLocationError } from '../redux/slices/locationSlice';
import { getUserLocation, calculateDistance, searchNominatimAddress, CITY_COORDINATES } from '../services/locationService';
import toast from 'react-hot-toast';

const POPULAR_SPECIALTIES = [
  { name: "Cardiology", icon: "HeartPulse", count: "12 Hospitals" },
  { name: "Orthopedics", icon: "Bone", count: "9 Hospitals" },
  { name: "Pediatrics", icon: "Baby", count: "8 Hospitals" },
  { name: "Neurology", icon: "Activity", count: "7 Hospitals" },
  { name: "Gynecology & Obstetrics", icon: "Users", count: "10 Hospitals" },
  { name: "Emergency Medicine", icon: "Clock", count: "24/7 Available" }
];

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: allHospitals } = useSelector(state => state.hospitals);
  const { items: allDoctors } = useSelector(state => state.doctors);
  const { userCoords, loading: locationLoading } = useSelector(state => state.location);

  const [heroSearch, setHeroSearch] = useState('');
  const [selectedHub, setSelectedHub] = useState('');
  const [heroSuggestions, setHeroSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Dynamic list of unique cities from active hospital directory (Only cities with registered hospitals)
  const availableCities = Array.from(
    new Set(allHospitals.map(h => h.city?.trim()).filter(Boolean))
  ).sort();

  // Handle Search Input Change with live Nominatim API Geocoding
  const handleHeroSearchChange = async (e) => {
    const val = e.target.value;
    setHeroSearch(val);

    if (val.trim().length >= 3) {
      setLoadingSuggestions(true);
      try {
        const results = await searchNominatimAddress(val);
        setHeroSuggestions(results);
      } catch (err) {
        console.error("Nominatim hero search error:", err);
      } finally {
        setLoadingSuggestions(false);
      }
    } else {
      setHeroSuggestions([]);
    }
  };

  const handleSelectHeroSuggestion = (item) => {
    dispatch(setUserCoords({
      latitude: item.latitude,
      longitude: item.longitude,
      accuracy: 100,
      city: item.city || item.shortName,
      state: item.state || '',
      address: item.name,
      source: 'nominatim-api'
    }));
    dispatch(setSearchQuery(item.shortName));
    if (item.city) {
      dispatch(setSelectedCity(item.city));
    }
    dispatch(setSortBy('distance'));
    setHeroSuggestions([]);
    toast.success(`📍 Geocoded to ${item.shortName}. Showing nearest hospitals.`);
    navigate('/hospitals');
  };

  // Calculate distance for preview if location active
  const enrichedHospitals = allHospitals.map(h => {
    if (userCoords) {
      const dist = calculateDistance(userCoords.latitude, userCoords.longitude, h.latitude, h.longitude);
      return { ...h, distanceKm: dist };
    }
    return { ...h, distanceKm: null };
  });

  const sortedHospitals = userCoords 
    ? [...enrichedHospitals].sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999))
    : enrichedHospitals;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (heroSearch) {
      dispatch(setSearchQuery(heroSearch));
    }
    if (selectedHub) {
      dispatch(setSelectedCity(selectedHub));
    }
    navigate('/hospitals');
  };

  const handleUseMyLocation = async () => {
    dispatch(setLocationLoading(true));
    try {
      const coords = await getUserLocation();
      dispatch(setUserCoords(coords));
      dispatch(setSortBy('distance'));
      toast.success('Location active! Showing nearest hospitals.');
      navigate('/hospitals');
    } catch (err) {
      dispatch(setLocationError(err.message));
      toast.error(err.message || 'Unable to detect location. Please search by city.');
    }
  };

  const handleSpecialtyClick = (specialtyName) => {
    dispatch(setSelectedSpecialty(specialtyName));
    navigate('/hospitals');
  };

  return (
    <main>
      {/* 1. HERO SECTION: Location & Discovery Focused */}
      <section
        style={{
          background: 'linear-gradient(180deg, #EAF6FB 0%, #F7FAFC 100%)',
          padding: '4.5rem 0 3.5rem 0',
          position: 'relative',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '840px', margin: '0 auto', textAlign: 'center' }}>
            
            {/* Eyebrow badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(11, 110, 153, 0.1)',
                color: 'var(--primary)',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: '700',
                marginBottom: '1.25rem'
              }}
            >
              <Compass size={15} />
              <span>Transparent Hospital Discovery & Comparison</span>
            </div>

            {/* Main Headline */}
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: 'var(--primary-dark)', fontWeight: '800', lineHeight: '1.15', marginBottom: '1rem' }}>
              Find the Right Hospital for Your Healthcare Needs
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: '1.1rem', color: 'var(--text-body)', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '700px', margin: '0 auto 2.25rem auto' }}>
              Search hospitals near you, compare emergency facilities, critical ICU capacity, verified doctor availability, and consultation fees using transparent criteria.
            </p>

            {/* Search Box Card */}
            <form
              onSubmit={handleSearchSubmit}
              className="card"
              style={{
                padding: '1.25rem',
                boxShadow: 'var(--shadow-lg)',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border)',
                marginBottom: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', position: 'relative' }}>
                {/* Search query input with Live Nominatim API Suggestions */}
                <div style={{ flex: '2 1 260px', position: 'relative' }}>
                  <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search hospitals, medical specialty, or type any area/address..."
                    value={heroSearch}
                    onChange={handleHeroSearchChange}
                    style={{ paddingLeft: '2.5rem', height: '48px', fontSize: '0.95rem' }}
                  />
                  {loadingSuggestions && (
                    <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }}>
                      <Loader2 size={16} className="spin" color="var(--primary)" />
                    </div>
                  )}

                  {/* Live OpenStreetMap Nominatim Dropdown */}
                  {heroSuggestions.length > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        backgroundColor: '#ffffff',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        zIndex: 100,
                        maxHeight: '220px',
                        overflowY: 'auto',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ padding: '0.4rem 0.75rem', backgroundColor: '#F8FAFC', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                        🌍 OpenStreetMap Geocoded Places (Click to set location):
                      </div>
                      {heroSuggestions.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectHeroSuggestion(item)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '0.6rem 0.85rem',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderBottom: '1px solid var(--border)',
                            cursor: 'pointer',
                            fontSize: '0.84rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            transition: 'background-color 0.15s ease'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EAF6FB')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <MapPin size={15} color="var(--primary)" style={{ flexShrink: 0 }} />
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <strong style={{ color: 'var(--primary-dark)' }}>{item.shortName}</strong>{' '}
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                              ({item.city || item.state || item.country})
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* City dropdown */}
                <div style={{ flex: '1 1 180px' }}>
                  <select
                    className="form-select"
                    value={selectedHub}
                    onChange={(e) => setSelectedHub(e.target.value)}
                    style={{ height: '48px', fontSize: '0.92rem' }}
                  >
                    <option value="">All Regions / Cities</option>
                    {availableCities.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Submit button */}
                <button type="submit" className="btn btn-primary" style={{ height: '48px', padding: '0 1.75rem' }}>
                  <Search size={17} />
                  <span>Search Hospitals</span>
                </button>
              </div>

              {/* Quick Location Detection Sub-row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={locationLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--teal)',
                    fontSize: '0.86rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: 0
                  }}
                >
                  {locationLoading ? <Loader2 size={15} className="animate-spin" /> : <Navigation size={15} />}
                  <span>{userCoords ? "Location Detected (Update)" : "Use My Current Location to Find Nearest"}</span>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Verified data sources</span>
                  <span>•</span>
                  <span>Independent comparisons</span>
                </div>
              </div>
            </form>

            {/* Popular Specialty Pills */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>Popular Specialties:</span>
              {POPULAR_SPECIALTIES.slice(0, 5).map((spec, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSpecialtyClick(spec.name)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.78rem',
                    color: 'var(--primary-dark)',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--primary-dark)'; }}
                >
                  {spec.name}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION: How the Platform Works */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Transparent Decision Framework</span>
            <h2 className="section-title">How MediCare Helps You Decide</h2>
            <p className="section-description">
              Healthcare decisions should be based on transparent criteria tailored to your situation, not unsupported claims.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.75rem' }}>
            <div className="card" style={{ padding: '1.75rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Compass size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>1. Discover Nearby</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>
                Filter hospitals by geographical distance, neighborhood, and travel time from your location.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'var(--teal-light)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Scale size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>2. Compare Capabilities</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>
                Compare ICU beds, 24/7 trauma care, diagnostic equipment (MRI, CT), and OPD consultation fees side by side.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Stethoscope size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>3. Inspect Doctors</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>
                Review doctor qualifications, specialty experience, languages spoken, and hospital shift timings.
              </p>
            </div>

            <div className="card" style={{ padding: '1.75rem', textAlign: 'center', backgroundColor: '#ffffff' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', backgroundColor: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                <Calendar size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>4. Book Direct Slot</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>
                Select validated working dates and real-time available time slots to confirm your appointment without phone queues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED HOSPITALS DISCOVERY GRID */}
      <section className="section">
        <div className="container">

          {/* Location Status Banner - shows when GPS is active */}
          {userCoords && (
            <div
              style={{
                backgroundColor: '#EAF6FB',
                border: '1px solid #BAE6FD',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.25rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <Navigation size={17} color="var(--primary)" />
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-dark)' }}>
                    📍 Location Active{userCoords.city ? ` — ${userCoords.city}` : ''}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '0.6rem' }}>
                    Hospitals sorted by distance from your location
                  </span>
                </div>
              </div>
              <Link to="/hospitals" style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                See all sorted by distance <ArrowRight size={13} />
              </Link>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-subtitle">{userCoords ? 'Nearest to You' : 'Verified Network'}</span>
              <h2 className="section-title" style={{ margin: 0 }}>
                {userCoords ? '🏥 Nearest Hospitals to Your Location' : 'Hospitals in Your Region'}
              </h2>
            </div>
            <Link to="/hospitals" className="btn btn-outline-primary btn-sm">
              <span>View All ({allHospitals.length}) Hospitals</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {sortedHospitals.slice(0, userCoords ? 4 : 3).map(hospital => (
              <HospitalCard key={hospital.id} hospital={hospital} />
            ))}
          </div>

          {/* Prompt to enable location if not yet done */}
          {!userCoords && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={locationLoading}
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, var(--teal) 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  padding: '0.65rem 1.5rem',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: locationLoading ? 'not-allowed' : 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 4px 14px rgba(11,110,153,0.3)'
                }}
              >
                {locationLoading ? <Loader2 size={15} className="animate-spin" /> : <Navigation size={15} />}
                <span>Detect My Location — Show Nearest Hospitals</span>
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 4. HOSPITAL COMPARISON CALLOUT */}
      <section
        style={{
          backgroundColor: 'var(--primary-dark)',
          color: '#ffffff',
          padding: '4.5rem 0',
          position: 'relative'
        }}
      >
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  backgroundColor: 'rgba(22, 166, 163, 0.25)',
                  color: '#80DEEA',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: '700',
                  marginBottom: '1rem'
                }}
              >
                <Scale size={14} />
                <span>Transparent Multi-Hospital Matrix</span>
              </div>
              <h2 style={{ fontSize: '2.2rem', color: '#ffffff', marginBottom: '1rem', lineHeight: '1.2' }}>
                Which Hospital is the Best Match for Your Situation?
              </h2>
              <p style={{ color: '#B0BEC5', fontSize: '1.02rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
                No single hospital is universally superior for every patient. Use our decision engine to weigh your priorities—whether that's emergency proximity, specialized cardiology, critical ICU readiness, or affordable outpatient consultation.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/compare" className="btn btn-teal">
                  <Scale size={16} />
                  <span>Open Comparison Engine</span>
                </Link>
                <Link to="/hospitals" className="btn btn-outline-primary" style={{ color: '#ffffff', borderColor: 'rgba(255,255,255,0.4)' }}>
                  <span>Select Hospitals to Compare</span>
                </Link>
              </div>
            </div>

            {/* Comparison Highlights Teaser */}
            <div
              className="card"
              style={{
                backgroundColor: '#ffffff',
                color: 'var(--text-dark)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                Key Comparison Metrics Analyzed:
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--primary-dark)' }}>Emergency & Trauma Readiness</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>24/7 casualty desk, dedicated ACLS ambulances, and on-call trauma teams.</div>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--primary-dark)' }}>Critical Care Infrastructure</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total operational beds, dedicated ICU/NICU units, and modular OTs.</div>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--primary-dark)' }}>Verified Doctor Rosters</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Accredited specialists, verified qualifications, and direct slot booking.</div>
                  </div>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <CheckCircle2 size={18} color="var(--teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--primary-dark)' }}>Transparent Consultation Pricing</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Clearly disclosed OPD consultation ranges and accepted insurance networks.</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED DOCTORS ACROSS HOSPITALS */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-subtitle">Clinical Specialists</span>
              <h2 className="section-title" style={{ margin: 0 }}>Specialist Doctors Across Network Hospitals</h2>
            </div>
            <Link to="/doctors" className="btn btn-outline-primary btn-sm">
              <span>View All Doctors ({allDoctors.length})</span>
              <ArrowRight size={15} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {allDoctors.slice(0, 4).map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. EMERGENCY CARE CALLOUT */}
      <section className="section section-alt" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div
            className="card"
            style={{
              padding: '2.5rem',
              backgroundColor: '#fff5f5',
              borderColor: '#fed7d7',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '2rem'
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--danger)', fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                <Activity size={18} />
                <span>24/7 Emergency & Acute Trauma Directory</span>
              </div>
              <h3 style={{ fontSize: '1.75rem', color: '#9b2c2c', marginBottom: '0.5rem' }}>
                Need Immediate Emergency or Critical Care?
              </h3>
              <p style={{ color: 'var(--text-body)', fontSize: '0.95rem', margin: 0, lineHeight: '1.6' }}>
                Access direct emergency dispatch lines, locate hospitals with open 24/7 casualty units, find trauma ICUs with ventilator support, and get navigation directions instantly.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/emergency" className="btn btn-danger btn-lg">
                <Activity size={18} />
                <span>Find Nearest Emergency</span>
              </Link>
              <a href="tel:108" className="btn btn-outline-secondary btn-lg" style={{ borderColor: '#e53e3e', color: '#e53e3e' }}>
                <PhoneCall size={18} />
                <span>National Ambulance: 108</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
