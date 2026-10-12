import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  PhoneCall, 
  MapPin, 
  Compass, 
  Clock, 
  ShieldAlert, 
  Navigation, 
  AlertTriangle,
  Loader2,
  Ambulance,
  HeartPulse,
  Droplet,
  CheckCircle,
  Radio,
  Send
} from 'lucide-react';
import { calculateDistance, formatDistance, estimateTravelTime, getUserLocation, reverseGeocodeCoordinates, searchNominatimAddress } from '../services/locationService';
import { emergencyService } from '../services/emergencyService';
import { setUserCoords, setLocationLoading, setLocationError } from '../redux/slices/locationSlice';
import toast from 'react-hot-toast';

const Emergency = () => {
  const dispatch = useDispatch();
  const { items: allHospitals } = useSelector(state => state.hospitals);
  const { userCoords, loading: locationLoading } = useSelector(state => state.location);

  // Live Telemetry
  const [telemetry, setTelemetry] = useState(emergencyService.getHospitalTelemetry('hosp-1'));

  // Live Ambulance Dispatch State
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [callerName, setCallerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [emergencyType, setEmergencyType] = useState('Cardiac / Chest Pain');
  const [activeDispatch, setActiveDispatch] = useState(null);
  const [dispatchLoading, setDispatchLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(emergencyService.getHospitalTelemetry('hosp-1'));
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  // Filter 24/7 Emergency hospitals only and calculate distance
  const emergencyHospitals = allHospitals
    .filter(h => h.emergencyServices)
    .map(h => {
      let distanceKm = null;
      if (userCoords) {
        distanceKm = calculateDistance(userCoords.latitude, userCoords.longitude, h.latitude, h.longitude);
      }
      return { ...h, distanceKm };
    })
    .sort((a, b) => {
      if (a.distanceKm == null) return 1;
      if (b.distanceKm == null) return -1;
      return a.distanceKm - b.distanceKm;
    });

  const handleUseLocation = async () => {
    dispatch(setLocationLoading(true));
    try {
      const coords = await getUserLocation();
      dispatch(setUserCoords(coords));
      
      // Also reverse geocode address for ambulance dispatch
      const geo = await reverseGeocodeCoordinates(coords.latitude, coords.longitude);
      if (geo && geo.displayName) {
        setPickupAddress(geo.displayName);
      }
      toast.success('GPS Location verified. Showing nearest Level-1 trauma centers.');
    } catch (err) {
      dispatch(setLocationError(err.message));
      toast.error(err.message || 'Unable to access GPS.');
    }
  };

  const handleRequestAmbulance = (e) => {
    e.preventDefault();
    if (!callerName.trim() || !contactPhone.trim() || !pickupAddress.trim()) {
      toast.error('Please enter caller name, mobile number, and pickup address.');
      return;
    }

    setDispatchLoading(true);
    setTimeout(() => {
      const session = emergencyService.dispatchAmbulance({
        callerName,
        contactPhone,
        pickupLocation: pickupAddress,
        emergencyType,
        userCoords
      });
      setActiveDispatch(session);
      setDispatchLoading(false);
      toast.success(`🚨 Ambulance ${session.vehicleNumber} dispatched! ETA ~${session.etaMinutes} mins.`);
    }, 1000);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', paddingBottom: '4rem' }}>
      
      {/* Top Emergency Red Alert Bar */}
      <div style={{ backgroundColor: '#DC2626', color: '#ffffff', padding: '3.5rem 0 3rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '840px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(0,0,0,0.25)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: '700', marginBottom: '1rem' }}>
              <Radio size={16} className="spin" color="#FACC15" />
              <span>24/7 Level-1 Acute Trauma & Resuscitation Network</span>
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: '800', lineHeight: '1.2', marginBottom: '0.85rem' }}>
              Immediate Emergency Care & Ambulance Dispatch
            </h1>
            <p style={{ fontSize: '1.05rem', color: '#FEE2E2', lineHeight: '1.6', margin: 0 }}>
              Live telemetry tracking for ICU beds, ventilators, blood bank stocks, and real-time GPS ambulance dispatch.
            </p>

            {/* Direct Dial Emergency Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
              <a href="tel:108" className="btn btn-lg" style={{ backgroundColor: '#ffffff', color: '#DC2626', fontWeight: '800' }}>
                <PhoneCall size={20} />
                <span>Gujarat 108 EMRI (૧૦૮ ઇમરજન્સી)</span>
              </a>
              <button
                type="button"
                onClick={() => setDispatchModalOpen(true)}
                className="btn btn-lg"
                style={{ backgroundColor: '#FACC15', color: '#78350F', fontWeight: '800' }}
              >
                <Ambulance size={20} />
                <span>Request Rapid Ambulance Dispatch</span>
              </button>
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={locationLoading}
                className="btn btn-outline-secondary btn-lg"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', borderColor: '#ffffff', color: '#ffffff' }}
              >
                {locationLoading ? <Loader2 size={18} className="spin" /> : <Navigation size={18} />}
                <span>Locate Nearest Trauma Center</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        
        {/* Live Critical Care Telemetry Widget */}
        <div
          className="card"
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #FCA5A5',
            padding: '1.75rem',
            marginBottom: '2.5rem',
            boxShadow: '0 10px 25px rgba(220, 38, 38, 0.08)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HeartPulse size={24} color="#DC2626" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--primary-dark)' }}>
                  Live Critical Care Telemetry (Central Hub)
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Real-time status updated every 20 seconds • Verified Hospital Feeds
                </span>
              </div>
            </div>
            <span className="badge badge-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#fff', borderRadius: '50%' }} />
              LIVE TELEMETRY
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', borderRadius: 'var(--radius-md)', border: '1px solid #FEE2E2' }}>
              <span style={{ fontSize: '0.78rem', color: '#991B1B', fontWeight: '700' }}>ICU Beds Available</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#DC2626' }}>
                {telemetry.icuBedsAvailable} <span style={{ fontSize: '0.9rem', color: '#991B1B', fontWeight: '500' }}>/ {telemetry.icuBedsTotal} Total</span>
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#EFF6FF', borderRadius: 'var(--radius-md)', border: '1px solid #DBEAFE' }}>
              <span style={{ fontSize: '0.78rem', color: '#1E40AF', fontWeight: '700' }}>Advanced Ventilators</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#2563EB' }}>
                {telemetry.ventilatorsAvailable} <span style={{ fontSize: '0.9rem', color: '#1E40AF', fontWeight: '500' }}>/ {telemetry.ventilatorsTotal} Operational</span>
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#F0FDF4', borderRadius: 'var(--radius-md)', border: '1px solid #DCFCE7' }}>
              <span style={{ fontSize: '0.78rem', color: '#166534', fontWeight: '700' }}>Emergency Doctors</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#16A34A' }}>
                {telemetry.emergencyDoctorsOnDuty} <span style={{ fontSize: '0.9rem', color: '#166534', fontWeight: '500' }}>On Active Shift</span>
              </div>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#FFFBEB', borderRadius: 'var(--radius-md)', border: '1px solid #FEF3C7' }}>
              <span style={{ fontSize: '0.78rem', color: '#92400E', fontWeight: '700' }}>ACLS Ambulances</span>
              <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#D97706' }}>
                {telemetry.ambulanceUnitsAvailable} <span style={{ fontSize: '0.9rem', color: '#92400E', fontWeight: '500' }}>Ready for Dispatch</span>
              </div>
            </div>
          </div>

          {/* Blood Bank Live Stock */}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-dark)' }}>
              <Droplet size={16} color="#DC2626" />
              <span>Blood Bank Inventory (Packed Red Blood Cells Units)</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {Object.entries(telemetry.bloodStock).map(([bloodType, count]) => (
                <div
                  key={bloodType}
                  style={{
                    padding: '0.4rem 0.85rem',
                    backgroundColor: 'var(--bg-main)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <strong style={{ color: '#DC2626' }}>{bloodType}:</strong>
                  <span>{count} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Ambulance Tracking Card if Dispatched */}
        {activeDispatch && (
          <div
            className="card"
            style={{
              backgroundColor: '#FEF2F2',
              border: '2px solid #EF4444',
              padding: '1.75rem',
              marginBottom: '2.5rem',
              animation: 'pulse 2s infinite'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge badge-danger" style={{ marginBottom: '0.5rem' }}>
                  🚨 DISPATCH CODE: {activeDispatch.dispatchId}
                </span>
                <h3 style={{ fontSize: '1.3rem', color: '#991B1B', margin: '0.3rem 0' }}>
                  Ambulance En Route • Estimated Arrival: ~{activeDispatch.etaMinutes} Minutes
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#7F1D1D', margin: 0 }}>
                  Pickup Address: <strong>{activeDispatch.pickupLocation}</strong>
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <a
                  href={`tel:${activeDispatch.driverPhone}`}
                  className="btn btn-danger btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <PhoneCall size={15} />
                  <span>Call Driver ({activeDispatch.driverName})</span>
                </a>
                <div style={{ fontSize: '0.78rem', color: '#7F1D1D', marginTop: '0.3rem' }}>
                  Vehicle: <strong>{activeDispatch.vehicleNumber}</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hospitals Grid Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)', margin: 0 }}>
            Hospitals with 24/7 Emergency & Trauma Units ({emergencyHospitals.length})
          </h2>
          {userCoords && (
            <span style={{ fontSize: '0.85rem', color: 'var(--teal)', fontWeight: '700' }}>
              Sorted by Nearest Road Distance
            </span>
          )}
        </div>

        {/* Emergency Hospital Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
          {emergencyHospitals.map(hospital => (
            <div
              key={hospital.id}
              className="card card-interactive"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #FED7D7',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}
            >
              {/* Header & Badges */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.74rem', backgroundColor: '#FEE2E2', color: '#991B1B', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                    24/7 Level-1 Trauma Unit
                  </span>
                  {hospital.distanceKm !== null && (
                    <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Compass size={14} />
                      {formatDistance(hospital.distanceKm)}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', margin: '0.2rem 0' }}>
                  <Link to={`/hospitals/${hospital.id}`} style={{ color: 'inherit' }}>
                    {hospital.name}
                  </Link>
                </h3>

                <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.84rem', margin: 0 }}>
                  <MapPin size={14} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <span>{hospital.address}, {hospital.city}</span>
                </p>
              </div>

              {/* Emergency Readiness Specs */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '0.5rem',
                  backgroundColor: 'var(--bg-main)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border)',
                  fontSize: '0.82rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>ICU Beds:</span>
                  <strong style={{ color: 'var(--teal)', fontSize: '0.95rem' }}>{hospital.icuBeds} Critical Beds</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Ambulance:</span>
                  <strong style={{ color: 'var(--success)' }}>{hospital.ambulanceAvailable ? "ACLS On-site" : "Available"}</strong>
                </div>
              </div>

              {/* Direct Action Dialers */}
              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a
                  href={`tel:${hospital.emergencyPhone || hospital.phone}`}
                  className="btn btn-danger btn-sm"
                  style={{ width: '100%', fontSize: '0.88rem' }}
                >
                  <PhoneCall size={15} />
                  <span>Emergency Desk: {hospital.emergencyPhone || hospital.phone}</span>
                </a>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/hospitals/${hospital.id}`} className="btn btn-outline-primary btn-sm" style={{ flex: 1 }}>
                    Hospital Info
                  </Link>
                  <a
                    href={`https://maps.google.com/?q=${hospital.latitude},${hospital.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-secondary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Navigation size={14} />
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Ambulance Dispatch Modal */}
      {dispatchModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
            padding: '1rem'
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '540px',
              width: '100%',
              padding: '2rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Ambulance size={24} color="#DC2626" />
                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary-dark)' }}>
                  Rapid Ambulance SOS Request
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDispatchModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRequestAmbulance} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '0.3rem' }}>
                  Caller Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  placeholder="Enter your name"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '0.3rem' }}>
                  Mobile Number for Live Driver Contact *
                </label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                />
              </div>

              <div style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <label style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-dark)' }}>
                    Exact Pickup Address & Landmark *
                  </label>
                  <button
                    type="button"
                    onClick={handleUseLocation}
                    disabled={locationLoading}
                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                  >
                    {locationLoading ? <Loader2 size={13} className="spin" /> : <Navigation size={13} />}
                    <span>📍 Auto-Fill Live GPS / IP</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={pickupAddress}
                  onChange={async (e) => {
                    const val = e.target.value;
                    setPickupAddress(val);
                    if (val.trim().length >= 3) {
                      setSearchingAddress(true);
                      try {
                        const res = await searchNominatimAddress(val);
                        setPickupSuggestions(res);
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setSearchingAddress(false);
                      }
                    } else {
                      setPickupSuggestions([]);
                    }
                  }}
                  placeholder="Type address, street, building, or area for live geocoding..."
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.88rem' }}
                />

                {/* Live Nominatim Geocoding Autocomplete for Pickup */}
                {pickupSuggestions.length > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 2px)',
                      left: 0,
                      right: 0,
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      zIndex: 100,
                      maxHeight: '180px',
                      overflowY: 'auto'
                    }}
                  >
                    <div style={{ padding: '0.3rem 0.6rem', backgroundColor: '#F8FAFC', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                      🌍 Geocoded Address Suggestions:
                    </div>
                    {pickupSuggestions.map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setPickupAddress(item.name);
                          setPickupSuggestions([]);
                          dispatch(setUserCoords({
                            latitude: item.latitude,
                            longitude: item.longitude,
                            accuracy: 100,
                            city: item.city || item.shortName,
                            source: 'nominatim-api'
                          }));
                          toast.success(`📍 Pickup location geocoded.`);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.5rem 0.65rem',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid var(--border)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#EAF6FB')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <MapPin size={13} color="var(--primary)" style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          <strong>{item.shortName}</strong> - <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{item.name}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '0.3rem' }}>
                  Emergency Condition Category
                </label>
                <select
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                >
                  <option value="Cardiac / Chest Pain">Cardiac / Severe Chest Pain</option>
                  <option value="Acute Respiratory Distress">Acute Respiratory Distress / Breathlessness</option>
                  <option value="Road Accident / Major Trauma">Road Accident / Major Trauma / Fracture</option>
                  <option value="Suspected Stroke / Paralysis">Suspected Stroke / Facial Droop / Paralysis</option>
                  <option value="Maternity / Labor Emergency">Maternity / Active Labor Emergency</option>
                  <option value="General Acute Emergency">General Acute Medical Emergency</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setDispatchModalOpen(false)}
                  className="btn btn-outline-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={dispatchLoading}
                  className="btn btn-danger"
                  style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  {dispatchLoading ? <Loader2 size={18} className="spin" /> : <Ambulance size={18} />}
                  <span>Confirm SOS Ambulance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Emergency;
