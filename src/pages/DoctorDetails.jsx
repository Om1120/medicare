import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Calendar, 
  Clock, 
  GraduationCap, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  ArrowLeft,
  ChevronRight,
  Building2,
  Scale,
  Check,
  Languages
} from 'lucide-react';
import { addDoctorToCompare, removeDoctorFromCompare } from '../redux/slices/comparisonSlice';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: allDoctors } = useSelector(state => state.doctors);
  const { items: allHospitals } = useSelector(state => state.hospitals);
  const { doctorIds: compareList } = useSelector(state => state.comparison);

  const doctor = allDoctors.find(d => d.id === id);

  if (!doctor) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--primary-dark)' }}>Doctor Profile Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          The requested specialist doctor could not be located in our directory.
        </p>
        <Link to="/doctors" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Back to Doctors Directory</span>
        </Link>
      </div>
    );
  }

  const isCompared = compareList.includes(doctor.id);
  const affiliatedHospital = allHospitals.find(h => h.id === doctor.hospitalId);

  const handleCompareToggle = () => {
    if (isCompared) {
      dispatch(removeDoctorFromCompare(doctor.id));
      toast.success('Removed doctor from comparison.');
    } else {
      if (compareList.length >= 4) {
        toast.error('You can compare up to 4 doctors simultaneously.');
        return;
      }
      dispatch(addDoctorToCompare(doctor.id));
      toast.success(`Added ${doctor.name} to comparison.`);
    }
  };

  return (
    <div className="doctor-details-page" style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <Link to="/" style={{ color: 'var(--text-muted)' }}>Home</Link>
          <ChevronRight size={14} />
          <Link to="/doctors" style={{ color: 'var(--text-muted)' }}>Doctors</Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--primary-dark)', fontWeight: '600' }}>{doctor.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
          
          {/* Left Column: Doctor Profile Header Card */}
          <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '130px', height: '130px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', flexShrink: 0, border: '3px solid var(--primary-light)' }}>
                <img
                  src={doctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'}
                  alt={doctor.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <span className="badge badge-info" style={{ marginBottom: '0.4rem' }}>
                  {doctor.department}
                </span>
                <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--primary-dark)', margin: '0.2rem 0' }}>
                  {doctor.name}
                </h1>
                <p style={{ color: 'var(--teal)', fontWeight: '600', fontSize: '0.95rem', margin: 0 }}>
                  {doctor.specialization}
                </p>

                {/* Primary Hospital Affiliation Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', color: 'var(--primary)', fontSize: '0.86rem', fontWeight: '600' }}>
                  <Building2 size={16} />
                  {affiliatedHospital ? (
                    <Link to={`/hospitals/${affiliatedHospital.id}`} style={{ color: 'inherit', textDecoration: 'underline' }}>
                      {affiliatedHospital.name}
                    </Link>
                  ) : (
                    <span>{doctor.hospitalName || 'Multi-Hospital Specialist'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* About Doctor */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
                Biography & Clinical Focus
              </h3>
              <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', lineHeight: '1.7', margin: 0 }}>
                {doctor.about || `${doctor.name} is an experienced medical specialist in ${doctor.department} with clinical dedication to patient evaluation, evidence-based therapies, and surgical/interventional care.`}
              </p>
            </div>

            {/* Clinical Services Provided */}
            {doctor.services && doctor.services.length > 0 && (
              <div style={{ marginBottom: '1.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
                  Specialized Procedures & Clinical Services
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                  {doctor.services.map((srv, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-body)' }}>
                      <CheckCircle2 size={16} color="var(--teal)" style={{ flexShrink: 0 }} />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Qualifications & Credentials */}
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
                Qualifications & Practice Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-body)' }}>
                  <GraduationCap size={18} color="var(--primary)" />
                  <span>Medical Qualifications: <strong>{doctor.qualification}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-body)' }}>
                  <ShieldCheck size={18} color="var(--teal)" />
                  <span>Clinical Experience: <strong>{doctor.experience} Practice</strong></span>
                </div>
                {doctor.languages && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-body)' }}>
                    <Languages size={18} color="var(--primary)" />
                    <span>Consultation Languages: <strong>{doctor.languages.join(', ')}</strong></span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Schedule & Booking Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Appointment Booking Box */}
            <div className="card" style={{ padding: '1.75rem', borderTop: '4px solid var(--primary)', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>
                    Consultation Fee
                  </span>
                  <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
                    {formatCurrency(doctor.fee)}
                  </div>
                </div>
                <span className="badge badge-success">Accepting Appointments</span>
              </div>

              {/* Timing info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <Calendar size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-dark)' }}>Scheduled Days</strong>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {Array.isArray(doctor.availableDays) ? doctor.availableDays.join(', ') : doctor.availableDays}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <Clock size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-dark)' }}>Shift Hours</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{doctor.availableTime}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                  <MapPin size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-dark)' }}>Consultation Chamber</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{doctor.roomNumber || 'Main OPD Wing'}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Link
                  to={`/book-appointment?doctorId=${doctor.id}`}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.85rem 1rem' }}
                >
                  <Calendar size={18} />
                  <span>Book Consultation Slot</span>
                </Link>

                <button
                  type="button"
                  onClick={handleCompareToggle}
                  className="btn btn-outline-secondary btn-sm"
                  style={{ width: '100%' }}
                >
                  {isCompared ? <Check size={14} color="var(--primary)" /> : <Scale size={14} />}
                  <span>{isCompared ? "In Doctor Comparison Matrix" : "Add to Doctor Comparison"}</span>
                </button>
              </div>
            </div>

            {/* Direct Contact Info Card */}
            <div className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-main)' }}>
              <h4 style={{ fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
                Desk Inquiries
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={15} color="var(--teal)" />
                  <span>{doctor.contact}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={15} color="var(--teal)" />
                  <span>{doctor.email}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default DoctorDetails;
