import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShieldCheck, Plus, Search, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import ConfirmationModal from '../../components/ConfirmationModal';
import AdminSidebar from '../../components/AdminSidebar';
import { addFacility, updateFacility, deleteFacility } from '../../redux/slices/facilitySlice';
import toast from 'react-hot-toast';

const AdminFacilities = () => {
  const dispatch = useDispatch();
  const { items: facilities } = useSelector(state => state.facilities);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFac, setEditingFac] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Critical Care',
    description: '',
    capacity: '',
    availability: '24/7'
  });

  const filteredFacilities = useMemo(() => {
    return facilities.filter(f => {
      const matchSearch = !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = !selectedCat || f.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [facilities, searchTerm, selectedCat]);

  const handleOpenAdd = () => {
    setEditingFac(null);
    setFormData({ name: '', category: 'Critical Care', description: '', capacity: '', availability: '24/7' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f) => {
    setEditingFac(f);
    setFormData(f);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingFac) {
      dispatch(updateFacility({ ...editingFac, ...formData }));
      toast.success('Facility updated successfully.');
    } else {
      dispatch(addFacility({ ...formData, id: `fac-${Date.now()}` }));
      toast.success('New facility added.');
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (deletingId) {
      dispatch(deleteFacility(deletingId));
      toast.success('Facility deleted.');
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', margin: 0 }}>
              Hospital Facilities & Infrastructure
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
              Manage ICU units, diagnostic laboratories, modular OTs, pharmacies, and emergency equipment.
            </p>
          </div>
          <button type="button" onClick={handleOpenAdd} className="btn btn-primary btn-sm">
            <Plus size={16} />
            <span>Add Facility</span>
          </button>
        </div>

        {/* Filter */}
        <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
            <div style={{ width: '200px' }}>
              <select
                className="form-select"
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Critical Care">Critical Care</option>
                <option value="Surgical Care">Surgical Care</option>
                <option value="Diagnostics">Diagnostics</option>
                <option value="Emergency">Emergency</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Inpatient Rooms">Inpatient Rooms</option>
                <option value="Patient Amenities">Patient Amenities</option>
              </select>
            </div>
          </div>
        </div>

        {/* Facilities Table */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Facility Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Capacity / Specs</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFacilities.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.name}</strong></td>
                  <td>
                    <span style={{ fontSize: '0.78rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.15rem 0.5rem', borderRadius: '3px' }}>
                      {f.category}
                    </span>
                  </td>
                  <td style={{ maxWidth: '300px', fontSize: '0.84rem' }}>{f.description}</td>
                  <td>{f.capacity}</td>
                  <td>{f.availability}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button type="button" onClick={() => handleOpenEdit(f)} className="btn btn-outline-primary btn-sm">
                        <Edit size={14} />
                      </button>
                      <button type="button" onClick={() => setDeletingId(f.id)} className="btn btn-outline-secondary btn-sm" style={{ color: 'var(--danger)' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingFac ? "Edit Facility" : "Add Clinical Facility"}
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label form-label-req">Facility Name</label>
              <input
                type="text"
                className="form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label form-label-req">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Critical Care">Critical Care</option>
                <option value="Surgical Care">Surgical Care</option>
                <option value="Diagnostics">Diagnostics</option>
                <option value="Emergency">Emergency</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Inpatient Rooms">Inpatient Rooms</option>
                <option value="Patient Amenities">Patient Amenities</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label form-label-req">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Capacity</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 40 Beds"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Availability</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 24/7"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-footer" style={{ padding: '1rem 0 0 0' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingFac ? "Save Changes" : "Create Facility"}
              </button>
            </div>
          </form>
        </Modal>

        <ConfirmationModal
          isOpen={Boolean(deletingId)}
          onClose={() => setDeletingId(null)}
          onConfirm={handleDelete}
          title="Delete Facility Record"
          message="Are you sure you want to remove this facility from the hospital directory?"
        />
      </main>
    </div>
  );
};

export default AdminFacilities;
