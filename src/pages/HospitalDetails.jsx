import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  ShieldCheck, 
  Activity, 
  Bed, 
  Clock, 
  Calendar, 
  Scale, 
  Check, 
  Compass, 
  ArrowLeft, 
  HeartPulse, 
  Stethoscope, 
  Layers, 
  DollarSign, 
  CheckCircle2,
  Info,
  Share2,
  Navigation,
  Wind
} from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import { addHospitalToCompare, removeHospitalFromCompare } from '../redux/slices/comparisonSlice';
import { calculateDistance, formatDistance, estimateTravelTime, getDrivingRouteOSRM } from '../services/locationService';
import { weatherHealthService } from '../services/weatherHealthService';
import { emergencyService } from '../services/emergencyService';
import toast from 'react-hot-toast';

const HospitalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('overview');
  const [liveAqi, setLiveAqi] = useState(null);
  const [osrmRoute, setOsrmRoute] = useState(null);
  const [telemetry, setTelemetry] = useState(null);

  const allHospitals = useSelector(state => state.hospitals?.items || state.hospitals?.hospitals || []);
  const allDoctors = useSelector(state => state.doctors?.items || state.doctors?.doctors || []);
  const allDepartments = useSelector(state => state.departments?.departments || state.departments?.items || []);
  const allFacilities = useSelector(state => state.facilities?.items || state.facilities?.facilities || []);
  const allServices = useSelector(state => state.services?.services || state.services?.items || []);
  const { userCoords } = useSelector(state => state.location);
  const { hospitalIds: compareList } = useSelector(state => state.comparison);

  const hospital = (allHospitals || []).find(h => h.id === id || h.slug === id);

  useEffect(() => {
    if (hospital) {
      // Live AQI
      weatherHealthService.getLiveHealthAtmosphere(hospital.latitude, hospital.longitude)
        .then(setLiveAqi)
        .catch(console.error);

      // Live Telemetry
      setTelemetry(emergencyService.getHospitalTelemetry(hospital.id));

      // Live OSRM Driving Route if user coordinates available
      if (userCoords) {
        getDrivingRouteOSRM(userCoords.latitude, userCoords.longitude, hospital.latitude, hospital.longitude)
          .then(setOsrmRoute)
          .catch(console.error);
      }
    }
  }, [hospital, userCoords]);

  if (!hospital) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>Hospital Record Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          The requested hospital could not be located in our verified directory.
        </p>
        <Link to="/hospitals" className="btn btn-primary btn-sm">
          Browse Hospital Directory
        </Link>
      </div>
    );
  }

  // Calculate distance if location enabled
  const distanceKm = userCoords ? calculateDistance(userCoords.latitude, userCoords.longitude, hospital.latitude, hospital.longitude) : null;
  const isCompared = compareList.includes(hospital.id);

  const handleCompareToggle = () => {
    if (isCompared) {
      dispatch(removeHospitalFromCompare(hospital.id));
      toast.success(`Removed from comparison.`);
    } else {
      if (compareList.length >= 4) {
        toast.error('You can compare up to 4 hospitals at a time.');
        return;
      }
      dispatch(addHospitalToCompare(hospital.id));
      toast.success(`Added ${hospital.name} to comparison matrix.`);
    }
  };

  // Doctors working at this hospital
  const hospitalDoctors = allDoctors.filter(d => 
    d.hospitalId === hospital.id || (d.hospitalIds && d.hospitalIds.includes(hospital.id))
  );

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh', paddingBottom: '4rem' }}>
      
      {/* 1. TOP HERO BANNER & HOSPITAL SUMMARY */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)', paddingTop: '2rem', paddingBottom: '2.5rem' }}>
        <div className="container">
          
          {/* Breadcrumbs / Back button */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: 'pointer',
              marginBottom: '1.25rem',
              padding: 0
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Directory</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
            
            {/* Left: Info & Details */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--teal)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {hospital.type}
                </span>
                {hospital.verified && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: '600' }}>
                    <ShieldCheck size={15} />
                    <span>Verified Record</span>
                  </span>
                )}
                {hospital.accreditation && (
                  <span style={{ fontSize: '0.78rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', fontWeight: '600' }}>
                    {hospital.accreditation}
                  </span>
                )}
              </div>

              <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: 'var(--primary-dark)', fontWeight: '800', lineHeight: '1.2', marginBottom: '0.6rem' }}>
                {hospital.name}
              </h1>

              <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '0.85rem' }}>
                <MapPin size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                <span>{hospital.address}, {hospital.city}, {hospital.state} {hospital.postalCode}</span>
              </p>

              {/* Live Road Distance & Live AQI Badges */}
              <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.25rem' }}>
                {osrmRoute ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '700' }}>
                    <Navigation size={14} color="var(--primary)" />
                    <span>{osrmRoute.formattedDistance} ({osrmRoute.formattedDuration} via OSRM)</span>
                  </div>
                ) : distanceKm !== null ? (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', fontWeight: '600' }}>
                    <Compass size={15} color="var(--primary)" />
                    <span>{formatDistance(distanceKm)}</span>
                    <span style={{ opacity: 0.75 }}>({estimateTravelTime(distanceKm)})</span>
                  </div>
                ) : null}

                {liveAqi && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: '600' }}>
                    <Wind size={14} color="#16A34A" />
                    <span>Live AQI: <strong>{liveAqi.aqi} ({liveAqi.category})</strong></span>
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to={`/book-appointment?hospitalId=${hospital.id}`} className="btn btn-primary">
                  <Calendar size={16} />
                  <span>Book Appointment</span>
                </Link>

                <a
                  href={`https://maps.google.com/?q=${hospital.latitude},${hospital.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Navigation size={15} />
                  <span>Directions</span>
                </a>

                <button
                  type="button"
                  onClick={handleCompareToggle}
                  className="btn btn-outline-secondary"
                  style={{
                    backgroundColor: isCompared ? 'var(--primary-light)' : 'transparent',
                    borderColor: isCompared ? 'var(--primary)' : 'var(--border)',
                    color: isCompared ? 'var(--primary)' : 'var(--text-body)'
                  }}
                >
                  {isCompared ? <Check size={16} color="var(--primary)" /> : <Scale size={16} />}
                  <span>{isCompared ? "In Comparison" : "Compare"}</span>
                </button>

                {hospital.phone && (
                  <a href={`tel:${hospital.emergencyPhone || hospital.phone}`} className="btn btn-teal">
                    <Phone size={15} />
                    <span>Call: {hospital.emergencyPhone || hospital.phone}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right: Hospital Images Gallery Preview */}
            <div>
              <div style={{ height: '260px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                <img
                  src={hospital.image || (hospital.images && hospital.images[0])}
                  alt={hospital.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)', position: 'sticky', top: '66px', zIndex: 40 }}>
        <div className="container">
          <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', padding: '0.5rem 0' }}>
            {[
              { id: 'overview', label: 'Overview & Infrastructure' },
              { id: 'departments', label: `Departments (${(hospital.departments || []).length})` },
              { id: 'doctors', label: `Doctors (${hospitalDoctors.length})` },
              { id: 'facilities', label: `Facilities & Environment (${(hospital.facilities || []).length})` },
              { id: 'services', label: `Services & Pricing (${(hospital.services || []).length})` }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                  color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: activeTab === tab.id ? '700' : '600',
                  fontSize: '0.92rem',
                  padding: '0.65rem 0.25rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. TAB CONTENT PANELS */}
      <div className="container" style={{ paddingTop: '2.5rem' }}>
        
        {/* TAB 1: OVERVIEW & INFRASTRUCTURE */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Left Col */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
                  About {hospital.name}
                </h3>
                <p style={{ color: 'var(--text-body)', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
                  {hospital.description}
                </p>
              </div>

              {/* Infrastructure Stats */}
              <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>
                  Clinical Infrastructure
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <Bed size={22} color="var(--primary)" style={{ margin: '0 auto 0.4rem auto' }} />
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-dark)' }}>{hospital.totalBeds}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Inpatient Beds</div>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <Activity size={22} color="var(--teal)" style={{ margin: '0 auto 0.4rem auto' }} />
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--teal)' }}>{hospital.icuBeds}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dedicated ICU Beds</div>
                  </div>

                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', textAlign: 'center' }}>
                    <Clock size={22} color="var(--primary)" style={{ margin: '0 auto 0.4rem auto' }} />
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-dark)' }}>{hospital.operationTheatres}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Modular OTs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Operations, Insurance, Provenance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
                  Operating Schedule & Emergency
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--primary-dark)', marginBottom: '0.2rem' }}>Hospital Hours:</strong>
                    <span style={{ color: 'var(--text-body)' }}>{hospital.operatingHours}</span>
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--primary-dark)', marginBottom: '0.2rem' }}>Emergency Desk:</strong>
                    <span style={{ color: hospital.emergencyOpen24x7 ? 'var(--success)' : 'var(--text-body)', fontWeight: '600' }}>
                      {hospital.emergencyOpen24x7 ? "24/7 Level-1 Emergency & Trauma Care" : "Standard OPD Hours"}
                    </span>
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--primary-dark)', marginBottom: '0.2rem' }}>General OPD Consultation Fee:</strong>
                    <span style={{ color: 'var(--primary)', fontWeight: '700' }}>{hospital.consultationFeeRange}</span>
                  </div>
                </div>
              </div>

              {/* Cashless Insurance */}
              <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
                  Accepted Cashless Insurance
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  The hospital supports cashless claims via Third-Party Administrators (TPA) for major insurers:
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {(hospital.insuranceAccepted || []).map((ins, i) => (
                    <span key={i} style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: '600' }}>
                      {ins}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DEPARTMENTS */}
        {activeTab === 'departments' && (
          <div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>
              Specialized Departments at {hospital.name}
            </h3>
            {(hospital.departments || []).length === 0 ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>No department data available for this hospital.</p>
              </div>
            ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {allDepartments.filter(dept => (hospital.departments || []).includes(dept.id)).map(dept => (
                <div key={dept.id} className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <HeartPulse size={20} color="var(--primary)" />
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', margin: 0 }}>{dept.name}</h4>
                  </div>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
                    {dept.description}
                  </p>
                  <div style={{ fontSize: '0.78rem', color: 'var(--teal)', fontWeight: '600', marginBottom: '0.75rem' }}>
                    Head: {dept.headDoctor}
                  </div>
                  <Link to={`/book-appointment?hospitalId=${hospital.id}&department=${encodeURIComponent(dept.name)}`} className="btn btn-outline-primary btn-sm" style={{ width: '100%' }}>
                    Book in {dept.name}
                  </Link>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* TAB 3: DOCTORS */}
        {activeTab === 'doctors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', margin: 0 }}>
                Specialist Doctors at this Hospital ({hospitalDoctors.length})
              </h3>
              <Link to="/doctors" className="btn btn-outline-primary btn-sm">
                <span>View Full Doctor Network</span>
              </Link>
            </div>

            {hospitalDoctors.length === 0 ? (
              <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>No individual doctor profiles currently linked to this hospital.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
                {hospitalDoctors.map(doctor => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: FACILITIES & ENVIRONMENT */}
        {activeTab === 'facilities' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
                Hospital Environment & Patient Amenities
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                Verified physical infrastructure and patient comfort facilities available on campus:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {(hospital.amenities || []).map((amenity, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                    <CheckCircle2 size={16} color="var(--teal)" />
                    <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-dark)' }}>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', backgroundColor: '#ffffff' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>
                Key Diagnostic & Clinical Facilities
              </h3>
              {(hospital.facilities || []).length === 0 ? (
                <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No facility data linked to this hospital.</div>
              ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {allFacilities.filter(fac => (hospital.facilities || []).includes(fac.id)).map(fac => (
                  <div key={fac.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>{fac.name}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: '0 0 0.5rem 0' }}>{fac.description}</p>
                    <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '600' }}>Capacity: {fac.capacity}</div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SERVICES & PRICING */}
        {activeTab === 'services' && (
          <div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>
              Clinical Diagnostic Services & Estimated Pricing
            </h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Service / Diagnostic Test</th>
                    <th>Category</th>
                    <th>Duration / Turnaround</th>
                    <th>Estimated Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allServices.filter(srv => (hospital.services || []).includes(srv.id)).map(srv => (
                    <tr key={srv.id}>
                      <td>
                        <strong>{srv.name}</strong>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{srv.description}</div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.76rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.2rem 0.5rem', borderRadius: '3px' }}>
                          {srv.category}
                        </span>
                      </td>
                      <td>{srv.duration}</td>
                      <td>
                        <strong style={{ color: 'var(--primary-dark)' }}>₹{srv.price}</strong>
                      </td>
                      <td>
                        <Link to={`/book-appointment?hospitalId=${hospital.id}&service=${encodeURIComponent(srv.name)}`} className="btn btn-outline-primary btn-sm">
                          Book Test
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* DATA PROVENANCE FOOTNOTE */}
        <div style={{ marginTop: '3rem', padding: '1rem 1.25rem', backgroundColor: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <Info size={18} color="var(--primary)" style={{ flexShrink: 0 }} />
          <div>
            <strong>Information Transparency:</strong> Data compiled from <em>{hospital.dataSource || 'State Health Authority Registry'}</em>. Verified status updated on {hospital.lastUpdated || '2026-09-15'}. Exact OPD schedule and slot availability may vary during public holidays.
          </div>
        </div>

      </div>
    </div>
  );
};

export default HospitalDetails;
