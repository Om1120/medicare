import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  UserCheck, 
  Layers, 
  Bed, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  Stethoscope, 
  ExternalLink, 
  Save, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { updateHospital } from '../../redux/slices/hospitalSlice';
import { addDoctor, deleteDoctor } from '../../redux/slices/doctorSlice';
import { addWard, updateWard, deleteWard } from '../../redux/slices/wardSlice';
import toast from 'react-hot-toast';

const HospitalPortal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: hospitals } = useSelector(state => state.hospitals);
  const { items: doctors } = useSelector(state => state.doctors);
  const { items: wards } = useSelector(state => state.wards);
  const { user } = useSelector(state => state.auth);

  // Active hospital being managed: default to assigned hospital or first hospital
  const initialHospitalId = user?.assignedHospitalId || hospitals[0]?.id || '';
  const [activeHospitalId, setActiveHospitalId] = useState(initialHospitalId);
  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' | 'wards' | 'details'

  const activeHospital = useMemo(() => {
    return hospitals.find(h => h.id === activeHospitalId) || hospitals[0] || {};
  }, [hospitals, activeHospitalId]);

  // Doctors belonging to active hospital
  const hospitalDoctors = useMemo(() => {
    return doctors.filter(d => 
      d.hospitalId === activeHospital.id || 
      (d.hospitalIds && d.hospitalIds.includes(activeHospital.id))
    );
  }, [doctors, activeHospital]);

  // Wards belonging to active hospital
  const hospitalWards = useMemo(() => {
    return wards.filter(w => w.hospitalId === activeHospital.id);
  }, [wards, activeHospital]);

  // -------------------------------------------------------------
  // 1. DOCTOR STATE & HANDLERS
  // -------------------------------------------------------------
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: '',
    department: 'Cardiology',
    qualification: 'MBBS, MD',
    experienceYears: 10,
    fee: 500,
    availableDays: 'Monday - Friday',
    availableHours: '09:00 AM - 01:00 PM',
    contact: '+91 98765 43210',
    email: '',
    about: ''
  });

  const handleAddDoctor = (e) => {
    e.preventDefault();
    if (!doctorForm.name || !doctorForm.specialization) {
      toast.error('Doctor name and specialization are required.');
      return;
    }

    const newDoc = {
      id: `doc-${Date.now()}`,
      hospitalId: activeHospital.id,
      hospitalIds: [activeHospital.id],
      hospitalName: activeHospital.name,
      name: doctorForm.name.startsWith('Dr.') ? doctorForm.name : `Dr. ${doctorForm.name}`,
      specialization: doctorForm.specialization,
      department: doctorForm.department,
      qualification: doctorForm.qualification,
      experienceYears: Number(doctorForm.experienceYears) || 5,
      experience: `${doctorForm.experienceYears}+ Years`,
      fee: Number(doctorForm.fee) || 0,
      availableDays: doctorForm.availableDays.split(',').map(s => s.trim()),
      availableTime: doctorForm.availableHours,
      availableHours: doctorForm.availableHours,
      contact: doctorForm.contact,
      email: doctorForm.email || `dr.${doctorForm.name.toLowerCase().replace(/[^a-z]/g, '')}@${activeHospital.slug || 'medicare'}.health`,
      about: doctorForm.about || `Experienced clinical specialist at ${activeHospital.name} providing advanced diagnosis and dedicated inpatient care.`,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      rating: 4.9,
      reviewCount: 12,
      acceptingAppointments: true
    };

    dispatch(addDoctor(newDoc));
    toast.success(`${newDoc.name} registered to ${activeHospital.name}!`);
    setShowDoctorModal(false);
    setDoctorForm({
      name: '',
      specialization: '',
      department: 'Cardiology',
      qualification: 'MBBS, MD',
      experienceYears: 10,
      fee: 500,
      availableDays: 'Monday - Friday',
      availableHours: '09:00 AM - 01:00 PM',
      contact: '+91 98765 43210',
      email: '',
      about: ''
    });
  };

  const handleDeleteDoctor = (docId, docName) => {
    if (window.confirm(`Are you sure you want to remove ${docName} from this hospital?`)) {
      dispatch(deleteDoctor(docId));
      toast.success('Doctor removed from hospital directory.');
    }
  };

  // -------------------------------------------------------------
  // 2. WARD STATE & HANDLERS ("new word and details about them")
  // -------------------------------------------------------------
  const [showWardModal, setShowWardModal] = useState(false);
  const [wardForm, setWardForm] = useState({
    name: '',
    category: 'ICU / Critical Care',
    floor: '2nd Floor, Main Wing',
    totalBeds: 20,
    availableBeds: 8,
    dailyCharge: 2500,
    headNurse: '',
    facilities: '24/7 Oxygen, Cardiac Telemetry, Ventilator Support'
  });

  const handleAddWard = (e) => {
    e.preventDefault();
    if (!wardForm.name) {
      toast.error('Ward name is required.');
      return;
    }

    const newWard = {
      id: `ward-${Date.now()}`,
      hospitalId: activeHospital.id,
      hospitalName: activeHospital.name,
      name: wardForm.name,
      category: wardForm.category,
      floor: wardForm.floor,
      totalBeds: Number(wardForm.totalBeds) || 10,
      availableBeds: Number(wardForm.availableBeds) || 5,
      dailyCharge: Number(wardForm.dailyCharge) || 1000,
      headNurse: wardForm.headNurse || 'Head Nurse On Duty',
      facilities: wardForm.facilities.split(',').map(f => f.trim()),
      status: 'Operational',
      lastUpdated: new Date().toISOString().slice(0, 10)
    };

    dispatch(addWard(newWard));
    toast.success(`Ward "${newWard.name}" created for ${activeHospital.name}!`);
    setShowWardModal(false);
    setWardForm({
      name: '',
      category: 'ICU / Critical Care',
      floor: '2nd Floor, Main Wing',
      totalBeds: 20,
      availableBeds: 8,
      dailyCharge: 2500,
      headNurse: '',
      facilities: '24/7 Oxygen, Cardiac Telemetry, Ventilator Support'
    });
  };

  const handleQuickAdjustBed = (ward, delta) => {
    const updatedAvailable = Math.max(0, Math.min(ward.totalBeds, (ward.availableBeds || 0) + delta));
    dispatch(updateWard({
      ...ward,
      availableBeds: updatedAvailable,
      status: updatedAvailable === 0 ? 'Full' : 'Operational'
    }));
    toast.success(`Updated ${ward.name}: ${updatedAvailable} beds available`);
  };

  const handleDeleteWard = (wardId, wardName) => {
    if (window.confirm(`Are you sure you want to remove ward "${wardName}"?`)) {
      dispatch(deleteWard(wardId));
      toast.success('Ward archived.');
    }
  };

  // -------------------------------------------------------------
  // 3. HOSPITAL DETAILS STATE & HANDLERS
  // -------------------------------------------------------------
  const [detailsForm, setDetailsForm] = useState({
    name: activeHospital.name || '',
    type: activeHospital.type || 'Apex Super Specialty',
    city: activeHospital.city || 'Ahmedabad',
    address: activeHospital.address || '',
    phone: activeHospital.phone || '',
    emergencyPhone: activeHospital.emergencyPhone || '',
    email: activeHospital.email || '',
    website: activeHospital.website || '',
    totalBeds: activeHospital.totalBeds || 300,
    icuBeds: activeHospital.icuBeds || 50,
    consultationFeeRange: activeHospital.consultationFeeRange || '₹500 - ₹1,000',
    emergencyServices: activeHospital.emergencyServices ?? true,
    pharmacyAvailable: activeHospital.pharmacyAvailable ?? true,
    ambulanceAvailable: activeHospital.ambulanceAvailable ?? true,
    description: activeHospital.description || ''
  });

  // Keep details form updated when switching active hospital
  React.useEffect(() => {
    if (activeHospital) {
      setDetailsForm({
        name: activeHospital.name || '',
        type: activeHospital.type || 'Apex Super Specialty',
        city: activeHospital.city || 'Ahmedabad',
        address: activeHospital.address || '',
        phone: activeHospital.phone || '',
        emergencyPhone: activeHospital.emergencyPhone || '',
        email: activeHospital.email || '',
        website: activeHospital.website || '',
        totalBeds: activeHospital.totalBeds || 300,
        icuBeds: activeHospital.icuBeds || 50,
        consultationFeeRange: activeHospital.consultationFeeRange || '₹500 - ₹1,000',
        emergencyServices: activeHospital.emergencyServices ?? true,
        pharmacyAvailable: activeHospital.pharmacyAvailable ?? true,
        ambulanceAvailable: activeHospital.ambulanceAvailable ?? true,
        description: activeHospital.description || ''
      });
    }
  }, [activeHospitalId]);

  const handleSaveDetails = (e) => {
    e.preventDefault();
    dispatch(updateHospital({
      ...activeHospital,
      ...detailsForm,
      totalBeds: Number(detailsForm.totalBeds),
      icuBeds: Number(detailsForm.icuBeds)
    }));
    toast.success('Hospital profile & operational parameters updated successfully!');
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', padding: '2rem 1rem 4rem 1rem' }}>
      <div className="container" style={{ maxWidth: '1180px' }}>
        
        {/* Top Breadcrumb & Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/admin/dashboard" className="btn btn-outline-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ArrowLeft size={14} />
              <span>Admin Panel</span>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <span>Shortcut:</span>
              <kbd style={{ background: '#EDE9FE', color: '#6D28D9', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>Ctrl + D</kbd>
            </div>
          </div>

          {/* Switch Hospital Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-dark)', margin: 0 }}>
              Managing Hospital:
            </label>
            <select
              value={activeHospitalId}
              onChange={(e) => setActiveHospitalId(e.target.value)}
              className="form-control"
              style={{ minWidth: '260px', padding: '0.45rem 0.75rem', fontWeight: '600' }}
            >
              {hospitals.map(h => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Hero Hospital Overview Card */}
        <div 
          className="card" 
          style={{ 
            padding: '2rem', 
            marginBottom: '2rem', 
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', 
            color: '#ffffff',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
              <div 
                style={{ 
                  width: '68px', 
                  height: '68px', 
                  borderRadius: '16px', 
                  backgroundColor: 'rgba(255, 255, 255, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                }}
              >
                <Building2 size={36} color="#A78BFA" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                  <h1 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                    {activeHospital.name}
                  </h1>
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#10B981', color: '#ffffff', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>
                    Verified Facility
                  </span>
                </div>
                <p style={{ margin: 0, color: '#C7D2FE', fontSize: '0.88rem' }}>
                  {activeHospital.city}, {activeHospital.state || 'India'} • {activeHospital.type || 'Super Specialty Hospital'} • Hotline: {activeHospital.phone || '24/7 Desk'}
                </p>
              </div>
            </div>

            <Link
              to={`/hospitals/${activeHospital.id}`}
              target="_blank"
              className="btn btn-sm"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', border: 'none', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <span>View Public Page</span>
              <ExternalLink size={14} />
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '0.85rem 1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#A5B4FC' }}>Registered Doctors</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>{hospitalDoctors.length}</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '0.85rem 1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#A5B4FC' }}>Active Wards</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#ffffff' }}>{hospitalWards.length}</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '0.85rem 1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#A5B4FC' }}>Ward Beds Available</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#34D399' }}>
                {hospitalWards.reduce((sum, w) => sum + (w.availableBeds || 0), 0)} / {hospitalWards.reduce((sum, w) => sum + (w.totalBeds || 0), 0) || activeHospital.totalBeds}
              </div>
            </div>
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', padding: '0.85rem 1rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.75rem', color: '#A5B4FC' }}>24/7 Emergency</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: activeHospital.emergencyServices ? '#38BDF8' : '#F87171' }}>
                {activeHospital.emergencyServices ? 'Operational' : 'Off-duty'}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('doctors')}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activeTab === 'doctors' ? '#7C3AED' : 'transparent',
              color: activeTab === 'doctors' ? '#ffffff' : 'var(--text-dark)',
              fontWeight: '700',
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Stethoscope size={18} />
            <span>Manage Doctors ({hospitalDoctors.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('wards')}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activeTab === 'wards' ? '#7C3AED' : 'transparent',
              color: activeTab === 'wards' ? '#ffffff' : 'var(--text-dark)',
              fontWeight: '700',
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Bed size={18} />
            <span>Wards & Bed Capacity ({hospitalWards.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('details')}
            style={{
              padding: '0.75rem 1.25rem',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: activeTab === 'details' ? '#7C3AED' : 'transparent',
              color: activeTab === 'details' ? '#ffffff' : 'var(--text-dark)',
              fontWeight: '700',
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease'
            }}
          >
            <Building2 size={18} />
            <span>Hospital Details & Profile</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: DOCTORS MANAGEMENT                                      */}
        {/* ============================================================== */}
        {activeTab === 'doctors' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-dark)', margin: 0 }}>
                  Hospital Clinical Doctors
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                  Register, edit, or manage doctors practicing at {activeHospital.name}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDoctorModal(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Plus size={16} />
                <span>Add Doctor to Hospital</span>
              </button>
            </div>

            {hospitalDoctors.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Stethoscope size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>No Doctors Registered Yet</h3>
                <p style={{ fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                  Add your clinical specialists and surgeons so patients can book appointments.
                </p>
                <button type="button" onClick={() => setShowDoctorModal(true)} className="btn btn-primary btn-sm">
                  <Plus size={16} />
                  <span>Register First Doctor</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {hospitalDoctors.map(doc => (
                  <div key={doc.id} className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                          <img
                            src={doc.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80"}
                            alt={doc.name}
                            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #EDE9FE' }}
                          />
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary-dark)', margin: 0 }}>
                              {doc.name}
                            </h3>
                            <div style={{ fontSize: '0.8rem', color: '#7C3AED', fontWeight: '600' }}>
                              {doc.specialization}
                            </div>
                          </div>
                        </div>

                        <span style={{ fontSize: '0.75rem', backgroundColor: '#EDE9FE', color: '#6D28D9', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                          {doc.department || 'General'}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                        🎓 {doc.qualification || 'MBBS'} • ⏳ {doc.experience || `${doc.experienceYears || 5}+ Years`}
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-dark)', marginBottom: '0.65rem', display: 'flex', gap: '1rem' }}>
                        <span>💰 Fee: <strong>₹{doc.fee}</strong></span>
                        <span>🕒 {doc.availableTime || doc.availableHours || '09:00 - 13:00'}</span>
                      </div>

                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                        {doc.about?.slice(0, 110) || 'Clinical expert providing patient consultations.'}...
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                      <Link to={`/doctors/${doc.id}`} target="_blank" style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <span>View Profile</span>
                        <ExternalLink size={13} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDeleteDoctor(doc.id, doc.name)}
                        style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: '600' }}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: WARDS & BED MANAGEMENT                                  */}
        {/* ============================================================== */}
        {activeTab === 'wards' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-dark)', margin: 0 }}>
                  Hospital Wards & Bed Capacity Ledger
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                  Register new wards, manage ICU & general beds, adjust real-time availability, and set daily ward charges.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowWardModal(true)}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
              >
                <Plus size={16} />
                <span>Add New Ward</span>
              </button>
            </div>

            {hospitalWards.length === 0 ? (
              <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Bed size={40} style={{ margin: '0 auto 1rem auto', opacity: 0.4 }} />
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)' }}>No Wards Configured</h3>
                <p style={{ fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                  Set up wards (such as ICU, Coronary Care, Deluxe Suites, or General Pediatric) to track bed inventory.
                </p>
                <button type="button" onClick={() => setShowWardModal(true)} className="btn btn-primary btn-sm">
                  <Plus size={16} />
                  <span>Create First Ward</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
                {hospitalWards.map(ward => {
                  const occupancyRatio = ward.totalBeds > 0 ? ((ward.totalBeds - ward.availableBeds) / ward.totalBeds) * 100 : 0;
                  return (
                    <div key={ward.id} className="card" style={{ padding: '1.5rem', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                          <div>
                            <span style={{ fontSize: '0.72rem', backgroundColor: '#EDE9FE', color: '#6D28D9', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                              {ward.category || 'Inpatient Ward'}
                            </span>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-dark)', margin: '0.35rem 0 0 0' }}>
                              {ward.name}
                            </h3>
                          </div>

                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: '700', 
                            padding: '3px 8px', 
                            borderRadius: '999px',
                            backgroundColor: ward.availableBeds > 0 ? '#DCFCE7' : '#FEE2E2',
                            color: ward.availableBeds > 0 ? '#15803D' : '#B91C1C'
                          }}>
                            {ward.availableBeds > 0 ? `${ward.availableBeds} Available` : 'Full'}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                          📍 {ward.floor || 'Main Block'} • 👩‍⚕️ Lead: <strong>{ward.headNurse || 'Sister In-Charge'}</strong>
                        </div>

                        {/* Bed Progress Bar */}
                        <div style={{ marginBottom: '1rem', backgroundColor: '#F1F5F9', padding: '0.75rem', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                            <span>Bed Occupancy:</span>
                            <span style={{ color: 'var(--primary-dark)' }}>
                              {ward.totalBeds - ward.availableBeds} / {ward.totalBeds} Occupied ({Math.round(occupancyRatio)}%)
                            </span>
                          </div>
                          <div style={{ height: '7px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${occupancyRatio}%`,
                                height: '100%',
                                backgroundColor: occupancyRatio > 85 ? '#EF4444' : '#10B981',
                                transition: 'width 0.3s ease'
                              }}
                            />
                          </div>

                          {/* Quick Adjust Buttons */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem', fontSize: '0.78rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Quick Bed Adjust:</span>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button
                                type="button"
                                onClick={() => handleQuickAdjustBed(ward, -1)}
                                style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)', background: '#ffffff', cursor: 'pointer', fontWeight: '700' }}
                                title="Occupy 1 bed"
                              >
                                - 1 Bed
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickAdjustBed(ward, 1)}
                                style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)', background: '#ffffff', cursor: 'pointer', fontWeight: '700' }}
                                title="Free up 1 bed"
                              >
                                + 1 Bed
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Facilities tags */}
                        {ward.facilities && ward.facilities.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
                            {ward.facilities.map((fac, idx) => (
                              <span key={idx} style={{ fontSize: '0.7rem', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-dark)' }}>
                                ✓ {fac}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                        <div style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
                          ₹{ward.dailyCharge} <span style={{ fontSize: '0.72rem', fontWeight: '500', color: 'var(--text-muted)' }}>/ day</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteWard(ward.id, ward.name)}
                          style={{ border: 'none', background: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: '600' }}
                        >
                          <Trash2 size={14} />
                          <span>Delete Ward</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: HOSPITAL DETAILS & INFRASTRUCTURE                       */}
        {/* ============================================================== */}
        {activeTab === 'details' && (
          <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--primary-dark)', margin: 0 }}>
                Hospital Infrastructure & Details
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0.2rem 0 0 0' }}>
                Update official contact numbers, emergency readiness, bed capacities, and hospital overview.
              </p>
            </div>

            <form onSubmit={handleSaveDetails}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <div className="form-group">
                  <label className="form-label form-label-req">Hospital Name</label>
                  <input
                    type="text"
                    value={detailsForm.name}
                    onChange={(e) => setDetailsForm({ ...detailsForm, name: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Hospital Classification / Type</label>
                  <input
                    type="text"
                    value={detailsForm.type}
                    onChange={(e) => setDetailsForm({ ...detailsForm, type: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">City</label>
                  <input
                    type="text"
                    value={detailsForm.city}
                    onChange={(e) => setDetailsForm({ ...detailsForm, city: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Official Address</label>
                  <input
                    type="text"
                    value={detailsForm.address}
                    onChange={(e) => setDetailsForm({ ...detailsForm, address: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">General Hotline / Reception Phone</label>
                  <input
                    type="text"
                    value={detailsForm.phone}
                    onChange={(e) => setDetailsForm({ ...detailsForm, phone: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Trauma Hotline (24/7)</label>
                  <input
                    type="text"
                    value={detailsForm.emergencyPhone}
                    onChange={(e) => setDetailsForm({ ...detailsForm, emergencyPhone: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Official Email</label>
                  <input
                    type="email"
                    value={detailsForm.email}
                    onChange={(e) => setDetailsForm({ ...detailsForm, email: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Official Website</label>
                  <input
                    type="url"
                    value={detailsForm.website}
                    onChange={(e) => setDetailsForm({ ...detailsForm, website: e.target.value })}
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Total Hospital Bed Capacity</label>
                  <input
                    type="number"
                    value={detailsForm.totalBeds}
                    onChange={(e) => setDetailsForm({ ...detailsForm, totalBeds: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Dedicated ICU Beds</label>
                  <input
                    type="number"
                    value={detailsForm.icuBeds}
                    onChange={(e) => setDetailsForm({ ...detailsForm, icuBeds: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Consultation Fee Range</label>
                  <input
                    type="text"
                    value={detailsForm.consultationFeeRange}
                    onChange={(e) => setDetailsForm({ ...detailsForm, consultationFeeRange: e.target.value })}
                    className="form-control"
                    placeholder="e.g. ₹500 - ₹1,000"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div style={{ backgroundColor: '#F8FAFC', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={detailsForm.emergencyServices}
                    onChange={(e) => setDetailsForm({ ...detailsForm, emergencyServices: e.target.checked })}
                  />
                  <span>24/7 Emergency & Trauma Active</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={detailsForm.pharmacyAvailable}
                    onChange={(e) => setDetailsForm({ ...detailsForm, pharmacyAvailable: e.target.checked })}
                  />
                  <span>In-House Pharmacy Open</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.88rem' }}>
                  <input
                    type="checkbox"
                    checked={detailsForm.ambulanceAvailable}
                    onChange={(e) => setDetailsForm({ ...detailsForm, ambulanceAvailable: e.target.checked })}
                  />
                  <span>24/7 Ambulance Fleet Ready</span>
                </label>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Hospital Clinical Overview & Accreditations</label>
                <textarea
                  rows={4}
                  value={detailsForm.description}
                  onChange={(e) => setDetailsForm({ ...detailsForm, description: e.target.value })}
                  className="form-control"
                  placeholder="Describe your facility specialties, surgical centers of excellence, NABH accreditation..."
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.75rem 1.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Save size={18} />
                <span>Save Hospital Details</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL: ADD DOCTOR TO HOSPITAL                                  */}
      {/* ============================================================== */}
      {showDoctorModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-dark)', margin: 0 }}>
                  Add Doctor to {activeHospital.name}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Fill in doctor credentials and consultation terms.</span>
              </div>
              <button type="button" onClick={() => setShowDoctorModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddDoctor}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group">
                  <label className="form-label form-label-req">Doctor Full Name</label>
                  <input
                    type="text"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Dr. Ramesh Gupta"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Specialization</label>
                  <input
                    type="text"
                    value={doctorForm.specialization}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Interventional Cardiologist"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Department</label>
                  <select
                    value={doctorForm.department}
                    onChange={(e) => setDoctorForm({ ...doctorForm, department: e.target.value })}
                    className="form-control"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Emergency Care">Emergency Care</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Qualifications</label>
                  <input
                    type="text"
                    value={doctorForm.qualification}
                    onChange={(e) => setDoctorForm({ ...doctorForm, qualification: e.target.value })}
                    className="form-control"
                    placeholder="e.g. MBBS, MD, DM"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Experience (Years)</label>
                  <input
                    type="number"
                    value={doctorForm.experienceYears}
                    onChange={(e) => setDoctorForm({ ...doctorForm, experienceYears: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    value={doctorForm.fee}
                    onChange={(e) => setDoctorForm({ ...doctorForm, fee: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Available Days</label>
                  <input
                    type="text"
                    value={doctorForm.availableDays}
                    onChange={(e) => setDoctorForm({ ...doctorForm, availableDays: e.target.value })}
                    className="form-control"
                    placeholder="Monday - Friday"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Available Time</label>
                  <input
                    type="text"
                    value={doctorForm.availableHours}
                    onChange={(e) => setDoctorForm({ ...doctorForm, availableHours: e.target.value })}
                    className="form-control"
                    placeholder="09:00 AM - 01:00 PM"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="text"
                    value={doctorForm.contact}
                    onChange={(e) => setDoctorForm({ ...doctorForm, contact: e.target.value })}
                    className="form-control"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    className="form-control"
                    placeholder="doctor@hospital.com"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">About Doctor / Clinical Focus</label>
                <textarea
                  rows={2}
                  value={doctorForm.about}
                  onChange={(e) => setDoctorForm({ ...doctorForm, about: e.target.value })}
                  className="form-control"
                  placeholder="Key expertise, surgical procedures, clinical background..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowDoctorModal(false)} className="btn btn-outline-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Register Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD NEW WARD ("new word and details about them")         */}
      {/* ============================================================== */}
      {showWardModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="card" style={{ width: '100%', maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', backgroundColor: '#ffffff', boxShadow: 'var(--shadow-xl)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-dark)', margin: 0 }}>
                  Add New Ward to {activeHospital.name}
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Configure ward category, bed counts, and nursing leadership.</span>
              </div>
              <button type="button" onClick={() => setShowWardModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddWard}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label form-label-req">Ward Name</label>
                  <input
                    type="text"
                    value={wardForm.name}
                    onChange={(e) => setWardForm({ ...wardForm, name: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Intensive Coronary Care Unit (ICCU)"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Ward Category / Type</label>
                  <select
                    value={wardForm.category}
                    onChange={(e) => setWardForm({ ...wardForm, category: e.target.value })}
                    className="form-control"
                  >
                    <option value="ICU / Critical Care">ICU / Critical Care</option>
                    <option value="Cardiac Care Unit (CCU)">Cardiac Care Unit (CCU)</option>
                    <option value="Neonatal ICU (NICU)">Neonatal ICU (NICU)</option>
                    <option value="Pediatric Ward">Pediatric Ward</option>
                    <option value="General Ward">General Ward</option>
                    <option value="Semi-Private Ward">Semi-Private Ward</option>
                    <option value="Deluxe Private Suite">Deluxe Private Suite</option>
                    <option value="Emergency / Trauma Triage">Emergency / Trauma Triage</option>
                    <option value="Post-Surgical Recovery">Post-Surgical Recovery</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Floor & Location</label>
                  <input
                    type="text"
                    value={wardForm.floor}
                    onChange={(e) => setWardForm({ ...wardForm, floor: e.target.value })}
                    className="form-control"
                    placeholder="e.g. 3rd Floor, West Wing"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Total Beds in Ward</label>
                  <input
                    type="number"
                    value={wardForm.totalBeds}
                    onChange={(e) => setWardForm({ ...wardForm, totalBeds: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Available Beds Right Now</label>
                  <input
                    type="number"
                    value={wardForm.availableBeds}
                    onChange={(e) => setWardForm({ ...wardForm, availableBeds: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label form-label-req">Daily Charge (₹ / Day)</label>
                  <input
                    type="number"
                    value={wardForm.dailyCharge}
                    onChange={(e) => setWardForm({ ...wardForm, dailyCharge: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Head Nurse / Ward In-Charge</label>
                  <input
                    type="text"
                    value={wardForm.headNurse}
                    onChange={(e) => setWardForm({ ...wardForm, headNurse: e.target.value })}
                    className="form-control"
                    placeholder="e.g. Sr. Manisha Dave"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Ward Features & Equipment (comma separated)</label>
                <input
                  type="text"
                  value={wardForm.facilities}
                  onChange={(e) => setWardForm({ ...wardForm, facilities: e.target.value })}
                  className="form-control"
                  placeholder="24/7 Oxygen, Telemetry, Ventilator Support, Attendant Couch"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setShowWardModal(false)} className="btn btn-outline-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Ward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default HospitalPortal;
