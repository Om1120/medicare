import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  List, 
  Map as MapIcon, 
  Scale, 
  Compass, 
  Sparkles, 
  SlidersHorizontal,
  ArrowRight,
  Navigation,
  Loader2,
  Crosshair,
  CheckCircle2
} from 'lucide-react';
import HospitalCard from '../components/HospitalCard';
import HospitalFilters from '../components/HospitalFilters';
import HospitalMap from '../components/HospitalMap';
import EmptyState from '../components/EmptyState';
import { calculateDistance, getUserLocation, GUJARAT_CITIES, AHMEDABAD_DEFAULT } from '../services/locationService';
import { resetHospitalFilters, setSelectedCity, setSortBy } from '../redux/slices/hospitalSlice';
import { setUserCoords, setRadiusKm, clearUserLocation } from '../redux/slices/locationSlice';
import toast from 'react-hot-toast';

const Hospitals = () => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  
  const { 
    items: allHospitals, 
    searchQuery, 
    selectedCity, 
    selectedSpecialty, 
    emergencyOnly, 
    sortBy 
  } = useSelector(state => state.hospitals);

  const { userCoords, radiusKm } = useSelector(state => state.location);
  const { hospitalIds: compareList } = useSelector(state => state.comparison);

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleEnableLiveLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const coords = await getUserLocation();
      dispatch(setUserCoords(coords));
      dispatch(setSortBy('distance'));
      dispatch(setRadiusKm(null));
      toast.success(`Live location active: ${coords.city || 'Ahmedabad'}. Showing nearest hospitals first!`);
    } catch (err) {
      dispatch(setUserCoords({ ...AHMEDABAD_DEFAULT }));
      dispatch(setSortBy('distance'));
      toast.success('Live location active (Ahmedabad). Showing nearest hospitals first!');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSelectCityPreset = (cityData) => {
    dispatch(setUserCoords({
      latitude: cityData.latitude,
      longitude: cityData.longitude,
      city: cityData.name,
      region: cityData.state || 'Gujarat',
      state: cityData.state || 'Gujarat',
      accuracy: 100,
      source: `${cityData.name} Centre`
    }));
    dispatch(setSortBy('distance'));
    toast.success(`Active location locked to ${cityData.name}. Distances updated!`);
  };

  const handleClearLocation = () => {
    dispatch(clearUserLocation());
    if (sortBy === 'distance') {
      dispatch(setSortBy('relevance'));
    }
    toast.success('Live location cleared.');
  };

  // Group cities and their hospital counts
  const availableCitiesWithCounts = useMemo(() => {
    const counts = {};
    (allHospitals || []).forEach(h => {
      const city = h.city?.trim();
      if (city) {
        counts[city] = (counts[city] || 0) + 1;
      }
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [allHospitals]);

  // Filter and sort hospitals
  const filteredHospitals = useMemo(() => {
    return allHospitals
      .map(hospital => {
        let distanceKm = null;
        if (userCoords && hospital.latitude && hospital.longitude) {
          distanceKm = calculateDistance(
            userCoords.latitude,
            userCoords.longitude,
            hospital.latitude,
            hospital.longitude
          );
        }
        return { ...hospital, distanceKm };
      })
      .filter(hospital => {
        // Search query filter (name, city, specialty, services, address)
        if (searchQuery) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = hospital.name.toLowerCase().includes(q);
          const matchesCity = (hospital.city || '').toLowerCase().includes(q);
          const matchesAddress = (hospital.address || '').toLowerCase().includes(q);
          const matchesSpecialty = (hospital.specialties || []).some(s => s.toLowerCase().includes(q));
          const matchesType = (hospital.type || '').toLowerCase().includes(q);

          if (!matchesName && !matchesCity && !matchesAddress && !matchesSpecialty && !matchesType) {
            return false;
          }
        }

        // City filter: Show EVERY hospital available in the selected city
        if (selectedCity) {
          const hospCity = (hospital.city || '').trim().toLowerCase();
          const targetCity = selectedCity.trim().toLowerCase();
          if (hospCity !== targetCity) {
            return false;
          }
        }

        // Specialty filter
        if (selectedSpecialty) {
          const hasSpec = (hospital.specialties || []).some(
            s => s.toLowerCase() === selectedSpecialty.toLowerCase()
          );
          if (!hasSpec) return false;
        }

        // 24/7 Emergency filter
        if (emergencyOnly && !hospital.emergencyServices) {
          return false;
        }

        // Radius filter: ONLY apply if GPS radius is explicitly defined and NO specific city filter is selected
        if (!selectedCity && userCoords && radiusKm && hospital.distanceKm !== null) {
          if (hospital.distanceKm > radiusKm) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          if (a.distanceKm == null) return 1;
          if (b.distanceKm == null) return -1;
          return a.distanceKm - b.distanceKm;
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'fee_asc') {
          return (a.minFee || 999) - (b.minFee || 999);
        }
        return 0; // relevance / default
      });
  }, [allHospitals, searchQuery, selectedCity, selectedSpecialty, emergencyOnly, userCoords, radiusKm, sortBy]);

  return (
    <div style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--teal)', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Building2 size={16} />
              <span>Hospital Discovery Directory</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-dark)', margin: 0 }}>
              Discover & Compare Hospitals
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem', marginBottom: 0 }}>
              Find medical centers near you, check 24/7 ICU & emergency readiness, and compare healthcare infrastructure.
            </p>
          </div>

          {/* View Mode Toggle: List vs Map */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                onClick={() => setViewMode('list')}
                style={{
                  padding: '0.45rem 0.9rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: viewMode === 'list' ? 'var(--primary)' : 'transparent',
                  color: viewMode === 'list' ? '#ffffff' : 'var(--text-body)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <List size={15} />
                <span>List View</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('map')}
                style={{
                  padding: '0.45rem 0.9rem',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: viewMode === 'map' ? 'var(--primary)' : 'transparent',
                  color: viewMode === 'map' ? '#ffffff' : 'var(--text-body)',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <MapIcon size={15} />
                <span>Map View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Location Action Banner */}
        <div
          style={{
            marginBottom: '1.75rem',
            padding: '1.25rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: userCoords ? '#F0FDF4' : '#F8FAFC',
            border: userCoords ? '1px solid #86EFAC' : '1px solid var(--border)',
            boxShadow: 'var(--shadow-xs)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: userCoords ? '#16A34A' : '#0B6E99',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}
            >
              {isDetectingLocation ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <Navigation size={24} />
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: '800', color: userCoords ? '#14532D' : 'var(--primary-dark)' }}>
                  {userCoords 
                    ? `Live Location: ${userCoords.city || 'Detected Location'} (${userCoords.source || 'GPS'})`
                    : 'Show Hospitals by Live Location'}
                </span>
                {userCoords && (
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>
                    Active & Sorted by Distance
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                {userCoords 
                  ? 'Real-time driving distances and travel times calculated for every hospital. Closest facilities appear first.'
                  : 'Detect your browser GPS or real IP to calculate live distances, estimated driving times, and find nearest hospitals.'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            {!userCoords ? (
              <button
                type="button"
                onClick={handleEnableLiveLocation}
                disabled={isDetectingLocation}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontWeight: '700' }}
              >
                {isDetectingLocation ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} />}
                <span>{isDetectingLocation ? 'Detecting Live GPS...' : 'Use Live Location (Nearest First)'}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleEnableLiveLocation}
                  disabled={isDetectingLocation}
                  className="btn btn-outline-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  {isDetectingLocation ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                  <span>Refresh GPS</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearLocation}
                  className="btn btn-outline-secondary btn-sm"
                >
                  Clear Location
                </button>
              </>
            )}
          </div>

          {/* Quick Regional Hub Switchers */}
          <div
            style={{
              width: '100%',
              paddingTop: '0.85rem',
              borderTop: userCoords ? '1px dashed #86EFAC' : '1px dashed #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.6rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', fontWeight: '700', color: userCoords ? '#14532D' : 'var(--text-dark)' }}>
              <span>📍 Reference Location:</span>
              <span style={{ fontWeight: '500', color: 'var(--text-muted)' }}>Quick switch to calculate distance from:</span>
            </div>

            <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {Object.entries(GUJARAT_CITIES).slice(0, 5).map(([key, cityData]) => {
                const isActive = userCoords && userCoords.city?.toLowerCase() === cityData.name.toLowerCase();
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectCityPreset(cityData)}
                    style={{
                      padding: '0.3rem 0.75rem',
                      borderRadius: '999px',
                      border: isActive ? '1.5px solid #16A34A' : '1px solid #CBD5E1',
                      backgroundColor: isActive ? '#DCFCE7' : '#FFFFFF',
                      color: isActive ? '#14532D' : '#334155',
                      fontSize: '0.78rem',
                      fontWeight: isActive ? '800' : '600',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: isActive ? '0 1px 3px rgba(22, 163, 74, 0.2)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <MapPin size={12} color={isActive ? '#16A34A' : '#64748B'} />
                    <span>{cityData.name}</span>
                    {key === 'ahmedabad' && (
                      <span style={{ fontSize: '0.66rem', backgroundColor: isActive ? '#16A34A' : '#E2E8F0', color: isActive ? '#FFFFFF' : '#475569', padding: '1px 5px', borderRadius: '4px' }}>
                        Default Hub
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Search & Location Filter Controls */}
        <HospitalFilters />

        {/* Comparison Floating Sticky Banner if hospitals are in compare queue */}
        {compareList.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--primary-dark)',
              color: '#ffffff',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Scale size={18} color="var(--teal)" />
              <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                {compareList.length} {compareList.length === 1 ? 'hospital' : 'hospitals'} added for side-by-side comparison
              </span>
            </div>
            <Link to="/compare" className="btn btn-teal btn-sm">
              <span>Compare Selected ({compareList.length})</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Available in City Quick Selector Bar */}
        <div style={{ marginBottom: '1.5rem', backgroundColor: '#ffffff', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xs)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-dark)' }}>
              <MapPin size={16} color="var(--primary)" />
              <span>Hospitals Available by City:</span>
            </div>
            {selectedCity && (
              <button
                type="button"
                onClick={() => dispatch(setSelectedCity(''))}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear City Filter (Show All {allHospitals.length} Hospitals)
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => dispatch(setSelectedCity(''))}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '999px',
                border: !selectedCity ? '1px solid var(--primary)' : '1px solid var(--border)',
                backgroundColor: !selectedCity ? 'var(--primary)' : '#F8FAFC',
                color: !selectedCity ? '#ffffff' : 'var(--text-dark)',
                fontSize: '0.82rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
            >
              <span>All Cities</span>
              <span style={{ fontSize: '0.72rem', backgroundColor: !selectedCity ? 'rgba(255,255,255,0.25)' : '#E2E8F0', padding: '1px 6px', borderRadius: '999px' }}>
                {allHospitals.length}
              </span>
            </button>

            {availableCitiesWithCounts.map(([cityName, count]) => {
              const isSelected = selectedCity?.trim().toLowerCase() === cityName.toLowerCase();
              return (
                <button
                  key={cityName}
                  type="button"
                  onClick={() => dispatch(setSelectedCity(isSelected ? '' : cityName))}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: '999px',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
                    color: isSelected ? '#ffffff' : 'var(--text-dark)',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{cityName}</span>
                  <span style={{ fontSize: '0.72rem', backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : '#E2E8F0', padding: '1px 6px', borderRadius: '999px' }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Header Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--text-dark)', fontWeight: '600' }}>
            {selectedCity ? (
              <span>
                Showing every hospital available in <strong>{selectedCity}</strong> (<strong>{filteredHospitals.length}</strong> hospitals)
              </span>
            ) : (
              <span>
                Showing <strong>{filteredHospitals.length}</strong> matching {filteredHospitals.length === 1 ? 'hospital' : 'hospitals'} across all cities
              </span>
            )}
            {userCoords && radiusKm && !selectedCity && <span> within {radiusKm} km radius</span>}
          </div>
        </div>

        {/* Main Content Area: Map vs List */}
        {filteredHospitals.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No Hospitals Found"
            description="No medical facilities match your current search, location radius, or specialty filters. Try expanding the distance radius or resetting your search."
            actionText="Reset All Filters"
            onActionClick={() => dispatch(resetHospitalFilters())}
          />
        ) : viewMode === 'map' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <HospitalMap hospitals={filteredHospitals} userCoords={userCoords} />
            
            {/* Quick cards grid below map */}
            <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginTop: '1rem', marginBottom: '0.5rem' }}>
              Hospital Profiles on Map
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filteredHospitals.map(hosp => (
                <HospitalCard key={hosp.id} hospital={hosp} />
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {filteredHospitals.map(hosp => (
              <HospitalCard key={hosp.id} hospital={hosp} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Hospitals;
