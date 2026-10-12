import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Bookmark, Building2, Stethoscope, ArrowRight } from 'lucide-react';
import HospitalCard from '../../components/HospitalCard';
import DoctorCard from '../../components/DoctorCard';
import PatientSidebar from '../../components/PatientSidebar';
import EmptyState from '../../components/EmptyState';

const PatientSaved = () => {
  const { user } = useSelector(state => state.auth);
  const { items: allHospitals } = useSelector(state => state.hospitals);
  const { items: allDoctors } = useSelector(state => state.doctors);

  // Retrieve user's saved hospitals and doctors (with fallbacks)
  const savedHospitalIds = user?.savedHospitals || ['hosp-1', 'hosp-3'];
  const savedDoctorIds = user?.savedDoctors || ['doc-1', 'doc-2'];

  const savedHospitals = allHospitals.filter(h => savedHospitalIds.includes(h.id));
  const savedDoctors = allDoctors.filter(d => savedDoctorIds.includes(d.id));

  return (
    <div className="patient-layout">
      <PatientSidebar />
      <main className="patient-main">
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--teal)', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            <Bookmark size={15} />
            <span>Saved Directory Bookmarks</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', margin: 0 }}>
            Saved Hospitals & Specialists
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Quick access to your preferred healthcare facilities and consulting doctors.
          </p>
        </div>

        {/* Section 1: Saved Hospitals */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', margin: 0 }}>
              Saved Hospitals ({savedHospitals.length})
            </h2>
            <Link to="/hospitals" className="btn btn-outline-primary btn-sm">
              <span>Explore More Hospitals</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {savedHospitals.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {savedHospitals.map(hosp => (
                <HospitalCard key={hosp.id} hospital={hosp} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Building2}
              title="No Saved Hospitals Yet"
              description="Save your preferred hospitals from the discovery directory for one-click access."
              actionText="Browse Hospitals"
              actionLink="/hospitals"
            />
          )}
        </div>

        {/* Section 2: Saved Doctors */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--primary-dark)', margin: 0 }}>
              Saved Specialist Doctors ({savedDoctors.length})
            </h2>
            <Link to="/doctors" className="btn btn-outline-primary btn-sm">
              <span>Explore Doctor Directory</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {savedDoctors.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {savedDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Stethoscope}
              title="No Saved Doctors Yet"
              description="Save consulting doctors to easily review their shift schedules and book follow-ups."
              actionText="Browse Doctors"
              actionLink="/doctors"
            />
          )}
        </div>

      </main>
    </div>
  );
};

export default PatientSaved;
