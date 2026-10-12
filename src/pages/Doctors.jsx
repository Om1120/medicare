import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Stethoscope, 
  Building2, 
  Search, 
  RotateCcw, 
  Scale, 
  GraduationCap, 
  ArrowRight,
  Filter
} from 'lucide-react';
import DoctorCard from '../components/DoctorCard';
import EmptyState from '../components/EmptyState';

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const allDoctors = useSelector(state => state.doctors?.items || state.doctors?.doctors || []);
  const allHospitals = useSelector(state => state.hospitals?.items || state.hospitals?.hospitals || []);
  const allDepartments = useSelector(state => state.departments?.departments || state.departments?.items || []);
  const { doctorIds: compareList } = useSelector(state => state.comparison);

  const initialDept = searchParams.get('department') || '';
  const initialHosp = searchParams.get('hospitalId') || '';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(initialHosp);
  const [selectedDepartment, setSelectedDepartment] = useState(initialDept);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [maxFee, setMaxFee] = useState('');

  useEffect(() => {
    const deptFromUrl = searchParams.get('department');
    if (deptFromUrl) setSelectedDepartment(deptFromUrl);
    const hospFromUrl = searchParams.get('hospitalId');
    if (hospFromUrl) setSelectedHospital(hospFromUrl);
  }, [searchParams]);

  // Extract unique specializations
  const specializations = useMemo(() => {
    const specs = new Set();
    allDoctors.forEach(doc => {
      if (doc.specialization) specs.add(doc.specialization);
    });
    return Array.from(specs);
  }, [allDoctors]);

  // Filter doctors
  const filteredDoctors = useMemo(() => {
    return allDoctors.filter(doc => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        doc.name.toLowerCase().includes(term) ||
        doc.specialization.toLowerCase().includes(term) ||
        doc.department.toLowerCase().includes(term) ||
        (doc.hospitalName && doc.hospitalName.toLowerCase().includes(term)) ||
        (doc.qualification && doc.qualification.toLowerCase().includes(term));

      const matchesHosp =
        !selectedHospital ||
        doc.hospitalId === selectedHospital ||
        (doc.hospitalIds && doc.hospitalIds.includes(selectedHospital));

      const matchesDept =
        !selectedDepartment ||
        doc.department.toLowerCase() === selectedDepartment.toLowerCase();

      const matchesSpec =
        !selectedSpecialization ||
        doc.specialization.toLowerCase() === selectedSpecialization.toLowerCase();

      const matchesFee =
        !maxFee || doc.fee <= Number(maxFee);

      return matchesSearch && matchesHosp && matchesDept && matchesSpec && matchesFee;
    });
  }, [allDoctors, searchTerm, selectedHospital, selectedDepartment, selectedSpecialization, maxFee]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedHospital('');
    setSelectedDepartment('');
    setSelectedSpecialization('');
    setMaxFee('');
    setSearchParams({});
  };

  return (
    <div style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--teal)', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <Stethoscope size={16} />
              <span>Specialist Directory</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-dark)', margin: 0 }}>
              Find Specialist Doctors
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.35rem', marginBottom: 0 }}>
              Discover certified clinical specialists, check hospital affiliations, consultation fees, and schedule slots directly.
            </p>
          </div>

          {compareList.length > 0 && (
            <Link to="/compare?tab=doctors" className="btn btn-teal btn-sm">
              <Scale size={15} />
              <span>Compare Selected ({compareList.length})</span>
            </Link>
          )}
        </div>

        {/* Filter Controls Card */}
        <div
          className="card"
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border)',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {/* Top Search Input */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by doctor name, clinical specialty, hospital, or qualification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>

          {/* Dropdown Filters Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem', alignItems: 'flex-end' }}>
            
            {/* Hospital Affiliation */}
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>Hospital Facility</label>
              <select
                className="form-select"
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
              >
                <option value="">All Hospitals</option>
                {allHospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            {/* Department */}
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>Department</label>
              <select
                className="form-select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
              >
                <option value="">All Departments</option>
                {allDepartments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>

            {/* Specialization */}
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>Sub-Specialization</label>
              <select
                className="form-select"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
              >
                <option value="">All Specializations</option>
                {specializations.map((spec, idx) => (
                  <option key={idx} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* Max Consultation Fee */}
            <div>
              <label className="form-label" style={{ fontSize: '0.78rem', marginBottom: '0.2rem' }}>Max Fee</label>
              <select
                className="form-select"
                value={maxFee}
                onChange={(e) => setMaxFee(e.target.value)}
                style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
              >
                <option value="">Any Consultation Fee</option>
                <option value="600">Up to ₹600</option>
                <option value="800">Up to ₹800</option>
                <option value="1000">Up to ₹1,000</option>
                <option value="1500">Up to ₹1,500</option>
              </select>
            </div>

            {/* Reset Button */}
            <div>
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={handleResetFilters}
                style={{ width: '100%', height: '38px' }}
              >
                <RotateCcw size={14} />
                <span>Reset Filters</span>
              </button>
            </div>

          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            Showing <strong>{filteredDoctors.length}</strong> matching specialist {filteredDoctors.length === 1 ? 'doctor' : 'doctors'}
          </span>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.75rem' }}>
            {filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Stethoscope}
            title="No Doctors Match Your Filter Criteria"
            description="Try selecting a different hospital or resetting your specialization or fee range."
            actionText="Reset Doctor Filters"
            onActionClick={handleResetFilters}
          />
        )}

      </div>
    </div>
  );
};

export default Doctors;
