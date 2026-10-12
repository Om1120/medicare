import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, UserCheck, Star, Stethoscope, Phone, Mail, Award, CheckCircle } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { addDoctor, updateDoctor, deleteDoctor } from '../../redux/slices/doctorSlice';
import toast from 'react-hot-toast';

const initialFormState = {
  id: '',
  name: '',
  hospitalId: 'hosp-001',
  hospitalName: 'Apollo Hospitals & Heart Centre',
  department: 'Cardiology',
  specialization: '',
  qualification: 'MBBS, MD',
  experience: '5+ years',
  rating: 4.8,
  reviewsCount: 24,
  consultationFee: 800,
  availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  timing: '09:00 AM - 01:00 PM',
  roomNo: 'OPD 101',
  email: '',
  phone: '+91 98765 43210',
  bio: '',
  image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
};

const AdminDoctors = () => {
  const { doctors } = useSelector(state => state.doctors);
  const { departments } = useSelector(state => state.departments);
  const hospitals = useSelector(state => state.hospitals?.items || state.hospitals?.hospitals || []);
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      ...initialFormState,
      id: `doc-${Date.now()}`,
      hospitalId: hospitals?.[0]?.id || 'hosp-001',
      hospitalName: hospitals?.[0]?.name || 'Apollo Hospitals & Heart Centre'
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (doc) => {
    setIsEditing(true);
    setFormData(doc);
    setModalOpen(true);
  };

  const handleDeleteClick = (doc) => {
    setSelectedDoctor(doc);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDoctor) {
      dispatch(deleteDoctor(selectedDoctor.id));
      toast.success(`Doctor ${selectedDoctor.name} removed successfully.`);
      setDeleteModalOpen(false);
      setSelectedDoctor(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.department || !formData.specialization) {
      toast.error('Please fill all required fields');
      return;
    }

    const selectedHosp = hospitals.find(h => h.id === formData.hospitalId);
    const doctorData = {
      ...formData,
      hospitalName: selectedHosp ? selectedHosp.name : formData.hospitalName
    };

    if (isEditing) {
      dispatch(updateDoctor(doctorData));
      toast.success(`Doctor ${formData.name} updated successfully!`);
    } else {
      dispatch(addDoctor(doctorData));
      toast.success(`Doctor ${formData.name} added successfully!`);
    }
    setModalOpen(false);
  };

  const columns = [
    {
      header: 'Doctor',
      accessor: 'name',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <img
            src={row.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'}
            alt={row.name}
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{row.name}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{row.qualification}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Hospital & Dept',
      accessor: 'hospitalName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', fontSize: '0.84rem', color: 'var(--primary)' }}>
            {row.hospitalName || 'Main Hospital'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
            <span className="badge badge-primary">{row.department}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.specialization}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Experience',
      accessor: 'experience',
      render: (row) => <span style={{ fontSize: '0.85rem' }}>{row.experience}</span>
    },
    {
      header: 'Fee & Timing',
      accessor: 'consultationFee',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--teal)' }}>₹{row.consultationFee}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.timing}</div>
        </div>
      )
    },
    {
      header: 'Rating',
      accessor: 'rating',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: '700', color: '#D97706' }}>
          <Star size={15} fill="#D97706" />
          <span>{row.rating}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '400' }}>({row.reviewsCount})</span>
        </div>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            style={{ padding: '0.35rem 0.55rem' }}
            onClick={() => handleOpenEdit(row)}
            title="Edit Doctor"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            style={{ padding: '0.35rem 0.55rem', color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
            onClick={() => handleDeleteClick(row)}
            title="Delete Doctor"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main" aria-label="Admin Doctors Management Panel">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
              Doctors Management
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Add, update credentials, change OPD schedules, and manage medical faculty.
            </p>
          </div>

          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add New Doctor</span>
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <DataTable
            columns={columns}
            data={doctors}
            searchKey={['name', 'department', 'specialization', 'qualification']}
            searchPlaceholder="Search doctors by name, specialty..."
            filterOptions={departments.map(d => ({ label: d.name, value: d.name }))}
            filterKey="department"
            filterPlaceholder="All Departments"
            emptyMessage="No doctors found matching criteria."
          />
        </div>

        {/* Add/Edit Doctor Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={isEditing ? 'Edit Doctor Profile' : 'Add New Medical Specialist'}
          maxWidth="700px"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Associated Hospital *</label>
              <select
                className="form-select"
                value={formData.hospitalId}
                onChange={(e) => {
                  const hId = e.target.value;
                  const hObj = hospitals.find(h => h.id === hId);
                  setFormData({ ...formData, hospitalId: hId, hospitalName: hObj ? hObj.name : '' });
                }}
              >
                {hospitals.map(h => (
                  <option key={h.id} value={h.id}>{h.name} ({h.city})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Dr. Rajesh Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Department *</label>
                <select
                  className="form-select"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Specialization *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Interventional Cardiologist"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Qualifications</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. MBBS, MD, DM (Cardiology)"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Experience</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 14+ years"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Consultation Fee (INR)</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="800"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Room / OPD No.</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="OPD 204"
                  value={formData.roomNo}
                  onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">OPD Timings</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 10:00 AM - 02:00 PM"
                  value={formData.timing}
                  onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Email / Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. dr.verma@medicare.health"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Doctor Bio / Summary</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Brief summary of doctor's clinical expertise and focus areas..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Save Changes' : 'Add Doctor'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Remove Doctor"
          message={`Are you sure you want to delete ${selectedDoctor?.name}? This action will permanently remove the doctor from the directory.`}
          confirmText="Yes, Remove Doctor"
          confirmVariant="danger"
        />

      </main>
    </div>
  );
};

export default AdminDoctors;
