import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Navigation, Compass, PhoneCall, Calendar, Activity, X } from 'lucide-react';
import { formatDistance, estimateTravelTime } from '../services/locationService';

const HospitalMap = ({ hospitals = [], userCoords = null }) => {
  const [activeHospital, setActiveHospital] = useState(hospitals[0] || null);

  // Dynamic bounding box derived from active hospitals and user live coords
  const allPoints = [
    ...hospitals.filter(h => h.latitude && h.longitude).map(h => ({ lat: h.latitude, lon: h.longitude })),
    ...(userCoords?.latitude && userCoords?.longitude ? [{ lat: userCoords.latitude, lon: userCoords.longitude }] : [])
  ];

  const lats = allPoints.map(p => p.lat);
  const lons = allPoints.map(p => p.lon);

  const minLat = lats.length > 0 ? Math.min(...lats) - 0.04 : 21.0;
  const maxLat = lats.length > 0 ? Math.max(...lats) + 0.04 : 23.5;
  const minLon = lons.length > 0 ? Math.min(...lons) - 0.04 : 72.0;
  const maxLon = lons.length > 0 ? Math.max(...lons) + 0.04 : 73.5;

  const getPositionStyle = (lat, lon) => {
    const latSpan = Math.max(0.01, maxLat - minLat);
    const lonSpan = Math.max(0.01, maxLon - minLon);
    const yPercent = 100 - ((lat - minLat) / latSpan) * 100;
    const xPercent = ((lon - minLon) / lonSpan) * 100;
    return {
      top: `${Math.max(10, Math.min(88, yPercent))}%`,
      left: `${Math.max(8, Math.min(92, xPercent))}%`
    };
  };

  return (
    <div
      className="card"
      style={{
        position: 'relative',
        height: '520px',
        overflow: 'hidden',
        backgroundColor: '#eaf4f8',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Map Background Grid & Vector Stylings */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(#c6dbe6 1.5px, transparent 1.5px),
            linear-gradient(to right, rgba(11, 110, 153, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(11, 110, 153, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 48px 48px, 48px 48px',
          opacity: 0.9
        }}
      />

      {/* Decorative Region Waterway / Expressway Indicator */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.35 }}
      >
        <path d="M 50 480 Q 180 320 280 260 T 550 140 T 900 60" fill="none" stroke="#0B6E99" strokeWidth="4" strokeDasharray="6,6" />
        <path d="M 80 490 Q 220 380 340 300 T 700 180" fill="none" stroke="#16A6A3" strokeWidth="3" />
      </svg>

      {/* User Coords Pin */}
      {userCoords && (
        <div
          style={{
            position: 'absolute',
            ...getPositionStyle(userCoords.latitude, userCoords.longitude),
            transform: 'translate(-50%, -50%)',
            zIndex: 20
          }}
          title="Your Current Location"
        >
          <div
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              backgroundColor: '#0284C7',
              border: '3px solid #ffffff',
              boxShadow: '0 0 0 6px rgba(2, 132, 199, 0.3), 0 4px 10px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', backgroundColor: '#0284C7', color: '#fff', fontSize: '0.68rem', fontWeight: '700', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
              You are here
            </div>
          </div>
        </div>
      )}

      {/* Hospital Interactive Pins */}
      {hospitals.map((hosp) => {
        const isSelected = activeHospital?.id === hosp.id;
        const pos = getPositionStyle(hosp.latitude, hosp.longitude);

        return (
          <button
            key={hosp.id}
            type="button"
            onClick={() => setActiveHospital(hosp)}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              transform: 'translate(-50%, -100%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: isSelected ? 25 : 15,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'transform 0.2s ease'
            }}
          >
            <div
              style={{
                backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
                color: isSelected ? '#ffffff' : 'var(--primary-dark)',
                border: `2px solid ${isSelected ? '#ffffff' : 'var(--primary)'}`,
                borderRadius: 'var(--radius-full)',
                padding: '0.35rem 0.65rem',
                fontSize: '0.74rem',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                boxShadow: isSelected ? '0 6px 16px rgba(11, 110, 153, 0.4)' : '0 2px 8px rgba(0,0,0,0.15)',
                whiteSpace: 'nowrap'
              }}
            >
              <MapPin size={13} color={isSelected ? '#ffffff' : 'var(--primary)'} />
              <span>{hosp.name.split(' ')[0]}</span>
              {hosp.distanceKm !== null && (
                <span style={{ opacity: 0.85, fontSize: '0.68rem' }}>({hosp.distanceKm.toFixed(1)} km)</span>
              )}
            </div>
            {/* Triangle pointer */}
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `6px solid ${isSelected ? 'var(--primary)' : '#ffffff'}`
              }}
            />
          </button>
        );
      })}

      {/* Active Hospital Popover Overlay */}
      {activeHospital && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            right: '16px',
            maxWidth: '460px',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border)',
            padding: '1rem',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--teal)', fontWeight: '700', textTransform: 'uppercase' }}>
                {activeHospital.type}
              </span>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-dark)', margin: '0.15rem 0' }}>
                {activeHospital.name}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                {activeHospital.address}, {activeHospital.city}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveHospital(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              aria-label="Close hospital preview"
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.78rem', color: 'var(--text-dark)' }}>
            {activeHospital.distanceKm !== null && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
                <Compass size={13} color="var(--primary)" />
                <span>{formatDistance(activeHospital.distanceKm)}</span>
              </span>
            )}
            {activeHospital.emergencyServices && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--success)', fontWeight: '600' }}>
                <Activity size={13} />
                <span>24/7 Emergency</span>
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontWeight: '600', color: 'var(--primary-dark)' }}>
              Fee: {activeHospital.consultationFeeRange || 'Standard'}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <Link to={`/hospitals/${activeHospital.id}`} className="btn btn-outline-primary btn-sm" style={{ flex: 1, padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              View Hospital
            </Link>
            <Link to={`/book-appointment?hospitalId=${activeHospital.id}`} className="btn btn-primary btn-sm" style={{ flex: 1, padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              <Calendar size={13} />
              <span>Book Appointment</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalMap;
