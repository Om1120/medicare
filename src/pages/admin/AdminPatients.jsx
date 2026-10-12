import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Eye, User, Phone, Mail, AlertTriangle, Activity, Calendar } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { addPatient, updatePatient, deletePatient } from '../../redux/slices/patientSlice';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const initialPatientState = {
  id: '',
  name: '',
  age: 30,
  gender: 'Male',
  bloodGroup: 'O+',
  contact: '+91 98765 00000',
  email: '',
  address: '',
  emergencyContact: '',
  allergies: 'None',
  medicalHistory: '',
  lastVisit: new Date().toISOString().split('T')[0]
};

const AdminPatients = () => {
  const { patients } = useSelector(state => state.patients);
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialPatientState);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      ...initialPatientState,
      id: `pat-${Date.now()}`
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (pat) => {
    setIsEditing(true);
    setFormData(pat);
    setModalOpen(true);
  };

  const handleOpenView = (pat) => {
    setSelectedPatient(pat);
    setViewModalOpen(true);
  };

  const handleDeleteClick = (pat) => {
    setSelectedPatient(pat);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPatient) {
      dispatch(deletePatient(selectedPatient.id));
      toast.success(`Patient record ${selectedPatient.name} deleted.`);
      setDeleteModalOpen(false);
      setSelectedPatient(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) {
      toast.error('Patient Name and Contact number are required');
      return;
    }

    if (isEditing) {
      dispatch(updatePatient(formData));
      toast.success(`Patient record for ${formData.name} updated!`);
    } else {
      dispatch(addPatient(formData));
      toast.success(`New patient ${formData.name} registered!`);
    }
    setModalOpen(false);
  };

  const columns = [
    {
      header: 'Patient ID',
      accessor: 'id',
      render: (row) => <strong style={{ color: 'var(--primary-dark)', fontSize: '0.85rem' }}>{row.id}</strong>
    },
    {
      header: 'Patient Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.age} yrs • {row.gender}</div>
        </div>
      )
    },
    {
      header: 'Blood Group',
      accessor: 'bloodGroup',
      render: (row) => <span className="badge badge-primary">{row.bloodGroup || 'O+'}</span>
    },
    {
      header: 'Contact Info',
      accessor: 'contact',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{row.contact}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.email || 'N/A'}</div>
        </div>
      )
    },
    {
      header: 'Last Visit',
      accessor: 'lastVisit',
      render: (row) => <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{formatDate(row.lastVisit)}</span>
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            style={{ padding: '0.35rem 0.55rem' }}
            onClick={() => handleOpenView(row)}
            title="View Patient Record"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            style={{ padding: '0.35rem 0.55rem' }}
            onClick={() => handleOpenEdit(row)}
            title="Edit Patient"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            style={{ padding: '0.35rem 0.55rem', color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
            onClick={() => handleDeleteClick(row)}
            title="Delete Patient"
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
      <main className="admin-main" aria-label="Admin Patients Directory">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
              Patient Directory & Records
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Hospital patient database, medical records, blood groups, and emergency contacts.
            </p>
          </div>

          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Register New Patient</span>
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <DataTable
            columns={columns}
            data={patients}
            searchKey={['name', 'id', 'contact', 'email', 'bloodGroup']}
            searchPlaceholder="Search patients by name, ID, phone..."
            filterOptions={[
              { label: 'Male', value: 'Male' },
              { label: 'Female', value: 'Female' }
            ]}
            filterKey="gender"
            filterPlaceholder="All Genders"
            emptyMessage="No patient records found."
          />
        </div>

        {/* View Patient Details Modal */}
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="Patient Medical Profile"
          maxWidth="600px"
        >
          {selectedPatient && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: '800' }}>
                  {selectedPatient.name?.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--primary-dark)', fontSize: '1.2rem' }}>{selectedPatient.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ID: {selectedPatient.id} • {selectedPatient.age} yrs • {selectedPatient.gender} • <strong style={{ color: 'var(--teal)' }}>{selectedPatient.bloodGroup}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Contact Phone</span>
                  <strong>{selectedPatient.contact}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Email</span>
                  <strong>{selectedPatient.email || 'None registered'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Emergency Contact</span>
                  <strong>{selectedPatient.emergencyContact || 'N/A'}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Last Recorded Visit</span>
                  <strong>{formatDate(selectedPatient.lastVisit)}</strong>
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem', marginBottom: '0.2rem' }}>Home Address</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-dark)' }}>{selectedPatient.address || 'Not provided'}</p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--danger)', display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Known Allergies</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-dark)' }}>{selectedPatient.allergies || 'No known allergies'}</p>
              </div>

              <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <span style={{ color: 'var(--primary)', display: 'block', fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Medical History & Notes</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-dark)' }}>{selectedPatient.medicalHistory || 'No past surgical or chronic conditions noted.'}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline-primary" onClick={() => setViewModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Add/Edit Patient Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={isEditing ? 'Edit Patient Record' : 'Register New Patient'}
          maxWidth="650px"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Ramesh Chandra"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Contact *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-select"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="patient@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Phone</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+91 98765 11111"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Street address, city"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Known Allergies</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Penicillin, Peanuts, None"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Medical History / Past Conditions</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Any chronic illness, previous surgeries..."
                value={formData.medicalHistory}
                onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Save Record' : 'Register Patient'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Patient Record"
          message={`Are you sure you want to permanently delete records for ${selectedPatient?.name}?`}
          confirmText="Yes, Delete"
          confirmVariant="danger"
        />

      </main>
    </div>
  );
};

export default AdminPatients;
