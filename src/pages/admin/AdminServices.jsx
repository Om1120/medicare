import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Stethoscope, Activity, CheckCircle, Clock } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { addService, updateService, deleteService } from '../../redux/slices/serviceSlice';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const initialServiceState = {
  id: '',
  name: '',
  category: 'Diagnostics',
  description: '',
  price: 1500,
  duration: 'Same Day',
  status: 'Available',
  icon: 'Activity'
};

const AdminServices = () => {
  const { services } = useSelector(state => state.services);
  const dispatch = useDispatch();

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialServiceState);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      ...initialServiceState,
      id: `srv-${Date.now()}`
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setIsEditing(true);
    setFormData(srv);
    setModalOpen(true);
  };

  const handleDeleteClick = (srv) => {
    setSelectedService(srv);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedService) {
      dispatch(deleteService(selectedService.id));
      toast.success(`Service ${selectedService.name} deleted.`);
      setDeleteModalOpen(false);
      setSelectedService(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Service Name and Price are required');
      return;
    }

    if (isEditing) {
      dispatch(updateService(formData));
      toast.success(`Service ${formData.name} updated!`);
    } else {
      dispatch(addService(formData));
      toast.success(`Service ${formData.name} added!`);
    }
    setModalOpen(false);
  };

  const columns = [
    {
      header: 'Service Name',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>{row.name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {row.description}
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      render: (row) => <span className="badge badge-primary">{row.category}</span>
    },
    {
      header: 'Price (INR)',
      accessor: 'price',
      render: (row) => <strong style={{ color: 'var(--teal)', fontSize: '0.95rem' }}>{formatCurrency(row.price)}</strong>
    },
    {
      header: 'Turnaround Time',
      accessor: 'duration',
      render: (row) => <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{row.duration}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`badge ${row.status === 'Available' ? 'badge-success' : 'badge-danger'}`}>
          {row.status || 'Available'}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            style={{ padding: '0.35rem 0.55rem' }}
            onClick={() => handleOpenEdit(row)}
            title="Edit Service"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            style={{ padding: '0.35rem 0.55rem', color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
            onClick={() => handleDeleteClick(row)}
            title="Delete Service"
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
      <main className="admin-main" aria-label="Admin Clinical Services Panel">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
              Hospital Clinical Services & Tariffs
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Manage diagnostic packages, radiology, lab tests, and clinical procedure tariffs.
            </p>
          </div>

          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} />
            <span>Add New Service</span>
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <DataTable
            columns={columns}
            data={services}
            searchKey={['name', 'category', 'description']}
            searchPlaceholder="Search services..."
            filterOptions={[
              { label: 'Consultation', value: 'Consultation' },
              { label: 'Diagnostics', value: 'Diagnostics' },
              { label: 'Laboratory', value: 'Laboratory' },
              { label: 'Radiology', value: 'Radiology' },
              { label: 'Surgical', value: 'Surgical' }
            ]}
            filterKey="category"
            filterPlaceholder="All Categories"
            emptyMessage="No clinical services found."
          />
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={isEditing ? 'Edit Clinical Service' : 'Add Clinical Service / Package'}
          maxWidth="600px"
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Service / Test Name *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="e.g. 128-Slice Cardiac CT Angiography"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Diagnostics">Diagnostics</option>
                  <option value="Laboratory">Laboratory</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Surgical">Surgical</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Standard Price (INR) *</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration / Report SLA</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 2 Hours / Same Day"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description & Inclusions</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Details of what this medical test or service entails..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Save Service' : 'Create Service'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Service"
          message={`Are you sure you want to remove ${selectedService?.name}?`}
          confirmText="Yes, Delete"
          confirmVariant="danger"
        />

      </main>
    </div>
  );
};

export default AdminServices;
