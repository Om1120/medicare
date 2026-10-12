import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Building2, Users, Bed, Clock } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { addDepartment, updateDepartment, deleteDepartment } from '../../redux/slices/departmentSlice';
import toast from 'react-hot-toast';

const initialDeptState = {
  id: '',
  name: '',
  headOfDepartment: '',
  totalDoctors: 4,
  totalBeds: 25,
  description: '',
  icon: 'HeartPulse',
  location: 'Block A, 2nd Floor',
  contactExtension: '201'
};

const AdminDepartments = () => {
  const { departments } = useSelector(state => state.departments);
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialDeptState);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      ...initialDeptState,
      id: `dept-${Date.now()}`
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setIsEditing(true);
    setFormData(dept);
    setModalOpen(true);
  };

  const handleDeleteClick = (dept) => {
    setSelectedDept(dept);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedDept) {
      dispatch(deleteDepartment(selectedDept.id));
      toast.success(`Department ${selectedDept.name} deleted.`);
      setDeleteModalOpen(false);
      setSelectedDept(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Department name is required');
      return;
    }

    if (isEditing) {
      dispatch(updateDepartment(formData));
      toast.success(`Department ${formData.name} updated successfully!`);
    } else {
      dispatch(addDepartment(formData));
      toast.success(`Department ${formData.name} added successfully!`);
    }
    setModalOpen(false);
  };

  const columns = [
    {
      header: 'Department Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <strong style={{ color: 'var(--primary-dark)', fontSize: '0.95rem' }}>{row.name}</strong>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{row.location || 'Main Building'}</div>
        </div>
      )
    },
    {
      header: 'Head of Dept (HOD)',
      accessor: 'headOfDepartment',
      render: (row) => <span style={{ fontWeight: '600' }}>{row.headOfDepartment || 'Dr. Assigned HOD'}</span>
    },
    {
      header: 'Staff & Capacity',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)' }}>
            <Users size={14} /> {row.totalDoctors || 3} Doctors
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--teal)' }}>
            <Bed size={14} /> {row.totalBeds || 20} Beds
          </span>
        </div>
      )
    },
    {
      header: 'Ext.',
      accessor: 'contactExtension',
      render: (row) => <span className="badge badge-neutral">Ext. {row.contactExtension || '101'}</span>
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
            title="Edit Department"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            style={{ padding: '0.35rem 0.55rem', color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
            onClick={() => handleDeleteClick(row)}
            title="Delete Department"
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
      <main className="admin-main" aria-label="Admin Departments Management">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
              Departments Management
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Configure hospital divisions, clinical departments, bed capacity, and HODs.
            </p>
          </div>

          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add Department</span>
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <DataTable
            columns={columns}
            data={departments}
            searchKey={['name', 'headOfDepartment', 'location']}
            searchPlaceholder="Search departments..."
            emptyMessage="No departments found."
          />
        </div>

        {/* Add/Edit Department Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={isEditing ? 'Edit Department' : 'Create New Department'}
          maxWidth="600px"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Department Name *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. Neurology & Neurosurgery"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Head of Department (HOD)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Dr. Rajesh Verma"
                  value={formData.headOfDepartment}
                  onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Physical Location / Floor</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Block B, 3rd Floor"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Total Doctors</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.totalDoctors}
                  onChange={(e) => setFormData({ ...formData, totalDoctors: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Total Beds</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.totalBeds}
                  onChange={(e) => setFormData({ ...formData, totalBeds: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Ext.</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="205"
                  value={formData.contactExtension}
                  onChange={(e) => setFormData({ ...formData, contactExtension: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description & Overview</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Department capabilities, diagnostic setups and specializations..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Save Department' : 'Create Department'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Department"
          message={`Are you sure you want to delete ${selectedDept?.name}?`}
          confirmText="Yes, Delete"
          confirmVariant="danger"
        />

      </main>
    </div>
  );
};

export default AdminDepartments;
