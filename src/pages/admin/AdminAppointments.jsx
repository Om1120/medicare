import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit, Trash2, Eye, Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { updateAppointmentStatus, deleteAppointment, addAppointment } from '../../redux/slices/appointmentSlice';
import { formatDate, formatCurrency, getStatusBadgeClass } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminAppointments = () => {
  const { appointments } = useSelector(state => state.appointments);
  const { doctors } = useSelector(state => state.doctors);
  const { departments } = useSelector(state => state.departments);
  const dispatch = useDispatch();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientContact: '+91 98765 00000',
    doctorId: doctors[0]?.id || '',
    doctorName: doctors[0]?.name || '',
    department: doctors[0]?.department || 'Cardiology',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM',
    reason: '',
    fee: doctors[0]?.consultationFee || 800,
    status: 'Confirmed'
  });

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateAppointmentStatus({ id, status: newStatus }));
    toast.success(`Appointment #${id} status updated to ${newStatus}`);
  };

  const handleView = (apt) => {
    setSelectedAppointment(apt);
    setViewModalOpen(true);
  };

  const handleDelete = (apt) => {
    setSelectedAppointment(apt);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAppointment) {
      dispatch(deleteAppointment(selectedAppointment.id));
      toast.success(`Appointment #${selectedAppointment.id} deleted.`);
      setDeleteModalOpen(false);
      setSelectedAppointment(null);
    }
  };

  const handleDoctorChange = (e) => {
    const docId = e.target.value;
    const doc = doctors.find(d => d.id === docId);
    if (doc) {
      setFormData({
        ...formData,
        doctorId: doc.id,
        doctorName: doc.name,
        department: doc.department,
        fee: doc.consultationFee
      });
    }
  };

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.date || !formData.time) {
      toast.error('Please enter patient name and choose consultation timing');
      return;
    }

    const newApt = {
      ...formData,
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingDate: new Date().toISOString().split('T')[0]
    };

    dispatch(addAppointment(newApt));
    toast.success(`Appointment #${newApt.id} scheduled successfully!`);
    setAddModalOpen(false);
  };

  const columns = [
    {
      header: 'Ticket #',
      accessor: 'id',
      render: (row) => <strong style={{ color: 'var(--primary-dark)', fontSize: '0.85rem' }}>{row.id}</strong>
    },
    {
      header: 'Patient Details',
      accessor: 'patientName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{row.patientName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.patientContact}</div>
        </div>
      )
    },
    {
      header: 'Doctor & Dept',
      accessor: 'doctorName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600' }}>{row.doctorName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--teal)' }}>{row.department}</div>
        </div>
      )
    },
    {
      header: 'Schedule',
      accessor: 'date',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>{formatDate(row.date)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.time}</div>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <select
          className={`badge ${getStatusBadgeClass(row.status)}`}
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          style={{ border: 'none', cursor: 'pointer', outline: 'none', fontWeight: '700' }}
        >
          <option value="Confirmed">Confirmed</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            style={{ padding: '0.35rem 0.55rem' }}
            onClick={() => handleView(row)}
            title="View Details"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            style={{ padding: '0.35rem 0.55rem', color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
            onClick={() => handleDelete(row)}
            title="Delete Appointment"
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
      <main className="admin-main" aria-label="Admin Appointment Schedule Management">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
              Appointments Management
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Review outpatient schedules, update visit statuses, and assign doctors.
            </p>
          </div>

          <button type="button" className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
            <Plus size={16} />
            <span>Schedule Appointment</span>
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <DataTable
            columns={columns}
            data={appointments}
            searchKey={['id', 'patientName', 'doctorName', 'department', 'patientContact']}
            searchPlaceholder="Search by patient, doctor, ticket..."
            filterOptions={[
              { label: 'Confirmed', value: 'Confirmed' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Completed', value: 'Completed' },
              { label: 'Cancelled', value: 'Cancelled' }
            ]}
            filterKey="status"
            filterPlaceholder="All Statuses"
            emptyMessage="No appointments found."
          />
        </div>

        {/* View Appointment Details Modal */}
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Appointment Pass #${selectedAppointment?.id}`}
          maxWidth="550px"
        >
          {selectedAppointment && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--primary-light)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>Token Status</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-dark)' }}>{selectedAppointment.status}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Estimated Fee</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--teal)' }}>{formatCurrency(selectedAppointment.fee || 800)}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Patient Name</span>
                  <strong>{selectedAppointment.patientName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Patient Phone</span>
                  <strong>{selectedAppointment.patientContact}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Assigned Specialist</span>
                  <strong>{selectedAppointment.doctorName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Department</span>
                  <strong>{selectedAppointment.department}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Consultation Date</span>
                  <strong>{formatDate(selectedAppointment.date)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Time Slot</span>
                  <strong>{selectedAppointment.time}</strong>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem', marginBottom: '0.2rem' }}>Reason for Consultation / Symptoms</span>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-dark)' }}>{selectedAppointment.reason || 'General Health Examination & Consultation'}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline-primary" onClick={() => setViewModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Schedule New Appointment Modal */}
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Direct Appointment Booking"
          maxWidth="600px"
        >
          <form onSubmit={handleCreateAppointment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Patient Name *</label>
              <input
                type="text"
                className="form-control"
                required
                placeholder="Patient's full name"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Phone Contact *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="+91 98765 00000"
                  value={formData.patientContact}
                  onChange={(e) => setFormData({ ...formData, patientContact: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="patient@example.com"
                  value={formData.patientEmail}
                  onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Select Specialist Doctor *</label>
              <select
                className="form-select"
                value={formData.doctorId}
                onChange={handleDoctorChange}
              >
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.department} - ₹{d.consultationFee})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  className="form-control"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot *</label>
                <select
                  className="form-select"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                >
                  {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Reason / Clinical Notes</label>
              <input
                type="text"
                className="form-control"
                placeholder="Reason for visit"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setAddModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Confirm Booking
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Appointment"
          message={`Are you sure you want to cancel and remove appointment ticket #${selectedAppointment?.id}?`}
          confirmText="Yes, Delete"
          confirmVariant="danger"
        />

      </main>
    </div>
  );
};

export default AdminAppointments;
