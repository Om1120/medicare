import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  Activity, 
  Bed, 
  Clock, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from '../../components/Modal';
import ConfirmationModal from '../../components/ConfirmationModal';
import AdminSidebar from '../../components/AdminSidebar';
import { addHospital, updateHospital, deleteHospital } from '../../redux/slices/hospitalSlice';
import toast from 'react-hot-toast';

const hospitalValidationSchema = Yup.object({
  name: Yup.string().min(3, 'Hospital name is required').required('Name is required'),
  city: Yup.string().required('City is required'),
  address: Yup.string().required('Address is required'),
  type: Yup.string().required('Hospital type is required'),
  totalBeds: Yup.number().min(1, 'Enter total beds').required('Total beds is required'),
  icuBeds: Yup.number().min(0, 'Enter ICU beds').required('ICU beds is required'),
  consultationFeeRange: Yup.string().required('Fee range is required (e.g. ₹500 - ₹1,000)'),
  phone: Yup.string().required('Phone number is required'),
  emergencyOpen24x7: Yup.boolean()
});

const AdminHospitals = () => {
  const dispatch = useDispatch();
  const { items: hospitals } = useSelector(state => state.hospitals);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHospital, setEditingHospital] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Trigger Add Hospital if query parameter is present (e.g. from global shortcut)
  useEffect(() => {
    if (searchParams.get('add') === '1' || searchParams.get('action') === 'new') {
      setEditingHospital(null);
      setIsModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Local shortcut for Ctrl + H / Cmd + H to open Add Hospital modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        setEditingHospital(null);
        setIsModalOpen(true);
        toast('Opening Add Hospital form...', { icon: '🏥' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter(h => {
      const matchesSearch = !searchTerm ||
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.type.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCity = !selectedCityFilter || h.city.toLowerCase() === selectedCityFilter.toLowerCase();
      return matchesSearch && matchesCity;
    });
  }, [hospitals, searchTerm, selectedCityFilter]);

  const handleOpenAdd = () => {
    setEditingHospital(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (h) => {
    setEditingHospital(h);
    setIsModalOpen(true);
  };

  const handleSave = (values, { setSubmitting }) => {
    if (editingHospital) {
      dispatch(updateHospital({ ...editingHospital, ...values }));
      toast.success('Hospital record updated successfully.');
    } else {
      const newRecord = {
        ...values,
        id: `hosp-${Date.now()}`,
        slug: values.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        specialties: ["General Medicine", "Cardiology", "Orthopedics"],
        departments: ["dept-1", "dept-2"],
        emergencyServices: values.emergencyOpen24x7 || false,
        verified: true,
        dataSource: "Hospital Administrator Entry",
        lastUpdated: new Date().toISOString().slice(0, 10),
        image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80"
      };
      dispatch(addHospital(newRecord));
      toast.success('New hospital facility registered.');
    }
    setIsModalOpen(false);
    setSubmitting(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      dispatch(deleteHospital(deletingId));
      toast.success('Hospital record archived.');
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', margin: 0 }}>
              Hospital Facility Management
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0.25rem 0 0 0' }}>
              Manage registered healthcare centers, emergency capabilities, infrastructure, and accreditations.
            </p>
          </div>

          <button 
            type="button" 
            onClick={handleOpenAdd} 
            className="btn btn-primary btn-sm"
            title="Shortcut: Ctrl + H"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} />
            <span>Register New Hospital</span>
            <kbd style={{ 
              fontSize: '0.7rem', 
              background: 'rgba(255, 255, 255, 0.25)', 
              color: '#ffffff', 
              padding: '2px 6px', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              letterSpacing: '0.5px'
            }}>
              Ctrl + H
            </kbd>
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Hospitals</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-dark)' }}>{hospitals.length}</div>
          </div>
          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>24/7 Emergency Units</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--danger)' }}>
              {hospitals.filter(h => h.emergencyServices).length}
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Inpatient Beds</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--teal)' }}>
              {hospitals.reduce((acc, h) => acc + (h.totalBeds || 0), 0)}
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total ICU Capacity</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)' }}>
              {hospitals.reduce((acc, h) => acc + (h.icuBeds || 0), 0)}
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                placeholder="Search hospital by name, city, or type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
            </div>
            <div style={{ width: '180px' }}>
              <select
                className="form-select"
                value={selectedCityFilter}
                onChange={(e) => setSelectedCityFilter(e.target.value)}
              >
                <option value="">All Cities</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Surat">Surat</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Gandhinagar">Gandhinagar</option>
                <option value="Rajkot">Rajkot</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hospital Records Table */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Hospital Facility</th>
                <th>City & Location</th>
                <th>Type</th>
                <th>Beds / ICU</th>
                <th>Emergency Desk</th>
                <th>OPD Fee Range</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredHospitals.map(h => (
                <tr key={h.id}>
                  <td>
                    <strong>{h.name}</strong>
                    {h.verified && (
                      <div style={{ fontSize: '0.72rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <ShieldCheck size={12} />
                        <span>Verified</span>
                      </div>
                    )}
                  </td>
                  <td>{h.address}, {h.city}</td>
                  <td>
                    <span style={{ fontSize: '0.76rem', backgroundColor: 'var(--primary-light)', color: 'var(--primary-dark)', padding: '0.15rem 0.45rem', borderRadius: '3px' }}>
                      {h.type}
                    </span>
                  </td>
                  <td>
                    <div><strong>{h.totalBeds}</strong> Total</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--teal)' }}>{h.icuBeds} ICU Beds</div>
                  </td>
                  <td>
                    <span className={`badge ${h.emergencyServices ? 'badge-success' : 'badge-neutral'}`}>
                      {h.emergencyServices ? '24/7 Active' : 'OPD Only'}
                    </span>
                  </td>
                  <td><strong>{h.consultationFeeRange}</strong></td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <Link to={`/hospitals/${h.id}`} className="btn btn-outline-secondary btn-sm" title="View Public Page">
                        <Eye size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(h)}
                        className="btn btn-outline-primary btn-sm"
                        title="Edit Hospital"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(h.id)}
                        className="btn btn-outline-secondary btn-sm"
                        style={{ color: 'var(--danger)' }}
                        title="Archive Hospital"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingHospital ? "Edit Hospital Facility" : "Register New Hospital Facility"}
        >
          <Formik
            initialValues={{
              name: editingHospital?.name || '',
              city: editingHospital?.city || 'Ahmedabad',
              address: editingHospital?.address || '',
              type: editingHospital?.type || 'Multi-Specialty Hospital',
              totalBeds: editingHospital?.totalBeds || 200,
              icuBeds: editingHospital?.icuBeds || 30,
              consultationFeeRange: editingHospital?.consultationFeeRange || '₹500 - ₹1,000',
              phone: editingHospital?.phone || '+91 79 0000 0000',
              emergencyOpen24x7: editingHospital?.emergencyOpen24x7 ?? true
            }}
            validationSchema={hospitalValidationSchema}
            onSubmit={handleSave}
          >
            {({ isSubmitting }) => (
              <Form>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label form-label-req">Hospital Name</label>
                    <Field name="name" className="form-control" placeholder="e.g. City General Hospital" />
                    <ErrorMessage name="name" component="div" className="form-error" />
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-req">City / Region</label>
                    <Field as="select" name="city" className="form-select">
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Surat">Surat</option>
                      <option value="Vadodara">Vadodara</option>
                      <option value="Gandhinagar">Gandhinagar</option>
                      <option value="Rajkot">Rajkot</option>
                    </Field>
                    <ErrorMessage name="city" component="div" className="form-error" />
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-req">Facility Type</label>
                    <Field name="type" className="form-control" placeholder="e.g. Tertiary Care Hospital" />
                    <ErrorMessage name="type" component="div" className="form-error" />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label form-label-req">Full Address</label>
                    <Field name="address" className="form-control" placeholder="Street, Sector, Area..." />
                    <ErrorMessage name="address" component="div" className="form-error" />
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-req">Total Operational Beds</label>
                    <Field name="totalBeds" type="number" className="form-control" />
                    <ErrorMessage name="totalBeds" component="div" className="form-error" />
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-req">ICU Beds Capacity</label>
                    <Field name="icuBeds" type="number" className="form-control" />
                    <ErrorMessage name="icuBeds" component="div" className="form-error" />
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-req">OPD Consultation Fee Range</label>
                    <Field name="consultationFeeRange" className="form-control" placeholder="₹600 - ₹1,200" />
                    <ErrorMessage name="consultationFeeRange" component="div" className="form-error" />
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-req">Desk Phone Number</label>
                    <Field name="phone" className="form-control" placeholder="+91 22 1234 5678" />
                    <ErrorMessage name="phone" component="div" className="form-error" />
                  </div>

                  <div className="form-group" style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Field type="checkbox" name="emergencyOpen24x7" id="emerg" />
                    <label htmlFor="emerg" style={{ fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}>
                      24/7 Level-1 Emergency & Trauma Unit Active
                    </label>
                  </div>
                </div>

                <div className="modal-footer" style={{ padding: '1rem 0 0 0', margin: 0 }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-outline-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                    {isSubmitting ? "Saving..." : editingHospital ? "Save Changes" : "Create Record"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={Boolean(deletingId)}
          onClose={() => setDeletingId(null)}
          onConfirm={handleConfirmDelete}
          title="Archive Hospital Record"
          message="Are you sure you want to archive this hospital record? It will no longer appear in public hospital search results."
        />

      </main>
    </div>
  );
};

export default AdminHospitals;
