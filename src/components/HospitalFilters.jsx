import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Search, 
  MapPin, 
  Navigation, 
  SlidersHorizontal, 
  RotateCcw, 
  Activity, 
  Loader2 
} from 'lucide-react';
import { 
  setSearchQuery, 
  setSelectedCity, 
  setSelectedSpecialty, 
  setEmergencyOnly, 
  setSortBy, 
  resetHospitalFilters 
} from '../redux/slices/hospitalSlice';
import { 
  setUserCoords, 
  setRadiusKm, 
  setLocationLoading, 
  setLocationError, 
  clearUserLocation 
} from '../redux/slices/locationSlice';
import { searchNominatimAddress, getUserLocation, CITY_COORDINATES } from '../services/locationService';
import toast from 'react-hot-toast';

const SPECIALTIES = [
  "Cardiology",
  "Orthopedics",
  "Pediatrics",
  "Neurology",
  "Gynecology & Obstetrics",
  "General Medicine",
  "Dermatology",
  "Dental",
  "Oncology",
  "Emergency Medicine"
];

const RADIUS_OPTIONS = [2, 5, 10, 25, 50];

const HospitalFilters = () => {
  const dispatch = useDispatch();
  const { items: allHospitals, searchQuery, selectedCity, selectedSpecialty, emergencyOnly, sortBy } = useSelector(state => state.hospitals);
  const { userCoords, radiusKm, loading: locationLoading } = useSelector(state => state.location);

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Dynamic cities list derived directly from available registered hospitals
  const dynamicCities = useMemo(() => {
    return Array.from(
      new Set((allHospitals || []).map(h => h.city?.trim()).filter(Boolean))
    ).sort();
  }, [allHospitals]);

  const handleCityChange = (cityName) => {
    dispatch(setSelectedCity(cityName));
    if (cityName) {
      dispatch(setRadiusKm(null));
    }
  };

  const handleUseLocation = async () => {
    dispatch(setLocationLoading(true));
    try {
      const coords = await getUserLocation();
      dispatch(setUserCoords(coords));
      dispatch(setSortBy('distance'));
      toast.success(`Location active: ${coords.city || 'Ahmedabad'}. Showing nearest hospitals.`);
    } catch (err) {
      dispatch(setLocationError(err.message));
      toast.error(err.message || 'Unable to access your location.');
    } finally {
      dispatch(setLocationLoading(false));
    }
  };

  const handleClearLocation = () => {
    dispatch(clearUserLocation());
    if (sortBy === 'distance') {
      dispatch(setSortBy('relevance'));
    }
    toast.success('Location reset to Ahmedabad default.');
  };

  const handleSearchChange = async (e) => {
    const val = e.target.value;
    dispatch(setSearchQuery(val));

    if (val.trim().length >= 3) {
      setLoadingSuggestions(true);
      try {
        const results = await searchNominatimAddress(val);
        setAddressSuggestions(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSuggestions(false);
      }
    } else {
      setAddressSuggestions([]);
    }
  };

  const selectAddressSuggestion = (item) => {
    dispatch(setUserCoords({
      latitude: item.latitude,
      longitude: item.longitude,
      accuracy: 100,
      source: 'nominatim'
    }));
    dispatch(setSearchQuery(item.shortName));
    dispatch(setSortBy('distance'));
    setAddressSuggestions([]);
    toast.success(`Geocoded to ${item.shortName}. Showing nearest hospitals.`);
  };

  const hasActiveFilters = searchQuery || selectedCity || selectedSpecialty || emergencyOnly || userCoords;

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        backgroundColor: '#ffffff',
        border: '1px solid var(--border)'
      }}
    >
      {/* Top Search Bar & Geolocation Row */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem', position: 'relative' }}>
        {/* Search input with live OpenStreetMap suggestions */}
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search
            size={18}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Search hospitals by name, area, specialty, or type address for live GPS..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ paddingLeft: '2.4rem' }}
          />

          {/* Live OpenStreetMap Nominatim Dropdown */}
          {addressSuggestions.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 100,
                marginTop: '4px',
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '0.4rem 0.75rem', backgroundColor: 'var(--bg-main)', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                🌍 OpenStreetMap Geocoded Places (Click to set GPS):
              </div>
              {addressSuggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectAddressSuggestion(item)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.55rem 0.75rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--border)',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    color: 'var(--primary-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <MapPin size={14} color="var(--primary)" />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <strong>{item.shortName}</strong> <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>({item.city || item.state})</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Location Trigger */}
        {!userCoords ? (
          <button
            type="button"
            onClick={handleUseLocation}
            disabled={locationLoading}
            className="btn btn-teal btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}
          >
            {locationLoading ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
            <span>Use My GPS</span>
          </button>
        ) : (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success)',
                border: '1px solid rgba(34,160,107,0.3)',
                padding: '0.4rem 0.75rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                fontWeight: '700'
              }}
            >
              <MapPin size={14} />
              <span>{userCoords.city || 'Ahmedabad'}</span>
            </span>
            <button
              type="button"
              onClick={handleClearLocation}
              className="btn btn-outline-secondary btn-sm"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Filter Options Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', alignItems: 'center' }}>
        {/* City selector */}
        <div>
          <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>City / Hub</label>
          <select
            className="form-select"
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
          >
            <option value="">All Cities ({allHospitals?.length || 0})</option>
            {dynamicCities.map((c, i) => {
              const count = (allHospitals || []).filter(h => h.city?.trim().toLowerCase() === c.toLowerCase()).length;
              return (
                <option key={i} value={c}>{c} ({count} {count === 1 ? 'hospital' : 'hospitals'})</option>
              );
            })}
          </select>
        </div>

        {/* Specialty selector */}
        <div>
          <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>Medical Specialty</label>
          <select
            className="form-select"
            value={selectedSpecialty}
            onChange={(e) => dispatch(setSelectedSpecialty(e.target.value))}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
          >
            <option value="">All Specialties</option>
            {SPECIALTIES.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Radius (only when location active) */}
        {userCoords && (
          <div>
            <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>Max Distance</label>
            <select
              className="form-select"
              value={radiusKm}
              onChange={(e) => dispatch(setRadiusKm(e.target.value))}
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
            >
              {RADIUS_OPTIONS.map((r, i) => (
                <option key={i} value={r}>Within {r} km</option>
              ))}
            </select>
          </div>
        )}

        {/* Sort selector */}
        <div>
          <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>Sort Results</label>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value))}
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
          >
            <option value="relevance">Relevance</option>
            <option value="distance">Nearest Distance</option>
            <option value="rating">Highest Rating</option>
            <option value="fee_asc">Consultation Fee (Low to High)</option>
          </select>
        </div>

        {/* Emergency toggle & reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem' }}>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              fontSize: '0.84rem',
              fontWeight: '600',
              color: emergencyOnly ? 'var(--danger)' : 'var(--text-body)'
            }}
          >
            <input
              type="checkbox"
              checked={emergencyOnly}
              onChange={(e) => dispatch(setEmergencyOnly(e.target.checked))}
              style={{ accentColor: 'var(--danger)', width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <Activity size={15} color={emergencyOnly ? 'var(--danger)' : 'var(--text-muted)'} />
            <span>24/7 Emergency</span>
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => dispatch(resetHospitalFilters())}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                marginLeft: 'auto'
              }}
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalFilters;
