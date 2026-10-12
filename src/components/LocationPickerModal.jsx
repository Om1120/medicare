import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  MapPin, 
  Navigation, 
  Search, 
  X, 
  Check, 
  Loader2, 
  Compass, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Globe2
} from 'lucide-react';
import { 
  setUserCoords, 
  setRadiusKm, 
  setLocationLoading, 
  setLocationError, 
  clearUserLocation 
} from '../redux/slices/locationSlice';
import { setSortBy, setSelectedCity } from '../redux/slices/hospitalSlice';
import { 
  getUserLocation, 
  searchNominatimAddress, 
  CITY_COORDINATES,
  GUJARAT_CITIES,
  OTHER_METRO_CITIES
} from '../services/locationService';
import toast from 'react-hot-toast';

const LocationPickerModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { userCoords, radiusKm, loading: locationLoading } = useSelector(state => state.location);
  
  const [searchInput, setSearchInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceTimerRef = useRef(null);

  // Auto-search via Nominatim API as user types
  useEffect(() => {
    if (!searchInput || searchInput.trim().length < 2) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await searchNominatimAddress(searchInput);
        setSuggestions(results);
      } catch (err) {
        console.error('Nominatim search error:', err);
      } finally {
        setSearching(false);
      }
    }, 350);

    return () => clearTimeout(debounceTimerRef.current);
  }, [searchInput]);

  if (!isOpen) return null;

  // Handle GPS / IP Auto-detection
  const handleDetectLocation = async () => {
    dispatch(setLocationLoading(true));
    try {
      const coords = await getUserLocation();
      dispatch(setUserCoords(coords));
      dispatch(setSortBy('distance'));
      if (coords.city && coords.city !== 'Detected Location') {
        dispatch(setSelectedCity(coords.city));
      }
      toast.success(`📍 Location detected: ${coords.city || 'Your Area'} (${coords.source})`);
      onClose();
    } catch (err) {
      dispatch(setLocationError(err.message));
      toast.error(err.message || 'Unable to detect location. Please search manually.');
    }
  };

  // Handle selection from API search suggestions
  const handleSelectSuggestion = (item) => {
    dispatch(setUserCoords({
      latitude: item.latitude,
      longitude: item.longitude,
      accuracy: 100,
      city: item.city || item.shortName,
      state: item.state || '',
      address: item.name,
      source: 'nominatim-api'
    }));
    if (item.city) {
      dispatch(setSelectedCity(item.city));
    }
    dispatch(setSortBy('distance'));
    toast.success(`📍 Geocoded to ${item.shortName}`);
    onClose();
  };

  // Handle selection from preset Hubs
  const handleSelectCityPreset = (key, hub) => {
    dispatch(setUserCoords({
      latitude: hub.latitude,
      longitude: hub.longitude,
      accuracy: 500,
      city: hub.name,
      state: hub.state,
      address: `${hub.name}, ${hub.state}, India`,
      source: 'preset-hub'
    }));
    dispatch(setSelectedCity(hub.name));
    dispatch(setSortBy('distance'));
    toast.success(`📍 Location set to ${hub.name}`);
    onClose();
  };

  // Clear location
  const handleClear = () => {
    dispatch(clearUserLocation());
    dispatch(setSelectedCity(''));
    dispatch(setSortBy('relevance'));
    toast.success('Location preference reset.');
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 60px rgba(15, 23, 42, 0.3)',
          border: '1px solid var(--border)',
          padding: '1.75rem',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '6px'
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--teal), #0B6E99)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(22, 166, 163, 0.3)'
            }}
          >
            <Compass size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
              Set Your Healthcare Location
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Powered by Live GPS, IP Geolocation & OpenStreetMap APIs
            </span>
          </div>
        </div>

        {/* Current Active Location Card */}
        <div
          style={{
            backgroundColor: userCoords ? '#F0FDF4' : '#F8FAFC',
            border: userCoords ? '1px solid #BBF7D0' : '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: userCoords ? 'var(--success)' : '#94A3B8',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MapPin size={17} />
            </div>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: '800', color: userCoords ? '#166534' : 'var(--text-dark)' }}>
                {userCoords ? `${userCoords.city || 'Active Location'}` : 'No Custom Location Set'}
              </div>
              <div style={{ fontSize: '0.74rem', color: userCoords ? '#15803D' : 'var(--text-muted)' }}>
                {userCoords 
                  ? `Lat: ${userCoords.latitude?.toFixed(4)}, Lon: ${userCoords.longitude?.toFixed(4)} (${userCoords.source || 'verified'})` 
                  : 'Displaying nationwide hospitals directory'}
              </div>
            </div>
          </div>

          {userCoords && (
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-outline-secondary btn-sm"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem' }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Auto Detect Button */}
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={locationLoading}
          className="btn btn-teal"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            fontSize: '0.92rem',
            fontWeight: '700',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1.25rem',
            borderRadius: 'var(--radius-md)'
          }}
        >
          {locationLoading ? (
            <>
              <Loader2 size={18} className="spin" />
              <span>Querying Geolocation API...</span>
            </>
          ) : (
            <>
              <Navigation size={18} />
              <span>Auto-Detect My GPS / Live IP Location</span>
            </>
          )}
        </button>

        {/* Divider with Text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1.25rem 0',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            fontWeight: '700'
          }}
        >
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
          <span style={{ padding: '0 0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            OR SEARCH ANY ADDRESS VIA API
          </span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
        </div>

        {/* OpenStreetMap Nominatim Live Search Bar */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search
            size={18}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Type city, street, neighborhood, or pincode..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ paddingLeft: '2.5rem', height: '44px', fontSize: '0.9rem' }}
          />
          {searching && (
            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
              <Loader2 size={16} className="spin" color="var(--primary)" />
            </div>
          )}

          {/* Autocomplete Suggestions from OpenStreetMap Nominatim */}
          {suggestions.length > 0 && (
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
                overflowY: 'auto'
              }}
            >
              <div style={{ padding: '0.4rem 0.75rem', backgroundColor: '#F8FAFC', fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                🌍 OpenStreetMap Geocoded Places (Click to select):
              </div>
              {suggestions.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(item)}
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

        {/* Gujarat Healthcare Hubs (ગુજરાતના પ્રમુખ શહેરો) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary-dark)', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1rem' }}>🏛️</span>
              <span>Gujarat Key Cities • ગુજરાતના પ્રમુખ શહેરો</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--teal)', fontWeight: '700', backgroundColor: '#EAF6FB', padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
              Priority Region
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {Object.entries(GUJARAT_CITIES).map(([key, hub]) => {
              const isSelected = userCoords && userCoords.city?.toLowerCase() === hub.name.toLowerCase();
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectCityPreset(key, hub)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? '800' : '600',
                    border: isSelected ? '1.5px solid var(--teal)' : '1px solid #BAE6FD',
                    backgroundColor: isSelected ? '#EAF6FB' : '#F0F9FF',
                    color: isSelected ? 'var(--primary-dark)' : '#0369A1',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--teal)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = '#BAE6FD';
                  }}
                >
                  {isSelected && <Check size={12} color="var(--teal)" />}
                  <span>{hub.regionalName} ({hub.name})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Other Major Metros */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Globe2 size={13} color="var(--text-muted)" />
            <span>Other Metros (અન્ય શહેરો)</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {Object.entries(OTHER_METRO_CITIES).map(([key, hub]) => {
              const isSelected = userCoords && userCoords.city?.toLowerCase() === hub.name.toLowerCase();
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectCityPreset(key, hub)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '20px',
                    fontSize: '0.76rem',
                    fontWeight: isSelected ? '700' : '500',
                    border: isSelected ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? '#F1F5F9' : '#ffffff',
                    color: isSelected ? 'var(--primary-dark)' : 'var(--text-body)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  {isSelected && <Check size={11} color="var(--primary)" />}
                  <span>{hub.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Distance Radius Preference */}
        <div style={{ paddingTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)' }}>
              Hospital Discovery Search Radius:
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--teal)' }}>
              {radiusKm} km
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[5, 10, 15, 25, 50, 100].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => dispatch(setRadiusKm(r))}
                style={{
                  flex: 1,
                  padding: '0.35rem 0',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: radiusKm === r ? '800' : '600',
                  border: radiusKm === r ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                  backgroundColor: radiusKm === r ? 'var(--primary)' : '#ffffff',
                  color: radiusKm === r ? '#ffffff' : 'var(--text-body)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LocationPickerModal;
