import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, Plus, Clock, UserCheck, XCircle, AlertCircle } from 'lucide-react';
import PatientSidebar from '../../components/PatientSidebar';
import DataTable from '../../components/DataTable';
import ConfirmationModal from '../../components/ConfirmationModal';
import { updateAppointmentStatus } from '../../redux/slices/appointmentSlice';
import { formatDate, formatCurrency, getStatusBadgeClass } from '../../utils/helpers';
import toast from 'react-hot-toast';

const PatientAppointments = () => {
  const { user } = useSelector(state => state.auth);
  const { appointments } = useSelector(state => state.appointments);
  const dispatch = useDispatch();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const patientEmail = user?.email || 'patient@demo.com';
  const patientAppointments = appointments.filter(
    a => a.patientEmail?.toLowerCase() === patientEmail.toLowerCase() || a.patientName?.toLowerCase() === user?.name?.toLowerCase() || a.patientId === 'pat-1'
  );

  const handleCancelClick = (apt) => {
    setSelectedAppointment(apt);
    setCancelModalOpen(true);
  };

  const confirmCancel = () => {
    if (selectedAppointment) {
      dispatch(updateAppointmentStatus({ id: selectedAppointment.id, status: 'Cancelled' }));
      toast.success('Appointment cancelled successfully.');
      setCancelModalOpen(false);
      setSelectedAppointment(null);
    }
  };

  const columns = [
    {
      header: 'Ticket ID',
      accessor: 'id',
      render: (row) => <strong style={{ color: 'var(--primary-dark)', fontSize: '0.85rem' }}>{row.id}</strong>
    },
    {
      header: 'Doctor & Dept',
      accessor: 'doctorName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{row.doctorName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--teal)' }}>{row.department}</div>
        </div>
      )
    },
    {
      header: 'Date & Time',
      accessor: 'date',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600' }}>{formatDate(row.date)}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{row.time}</div>
        </div>
      )
    },
    {
      header: 'Reason',
      accessor: 'reason',
      render: (row) => (
        <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '200px', display: 'inline-block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {row.reason || 'General Consultation'}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <span className={`badge ${getStatusBadgeClass(row.status)}`}>
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {row.status === 'Confirmed' || row.status === 'Pending' ? (
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              style={{ color: 'var(--danger)', borderColor: 'var(--danger-bg)', padding: '0.25rem 0.6rem', fontSize: '0.78rem' }}
              onClick={() => handleCancelClick(row)}
            >
              Cancel
            </button>
          ) : (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>—</span>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="patient-layout">
      <PatientSidebar />
      <main className="patient-main" aria-label="Patient Appointments Area">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
              My Appointments
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Track past and upcoming consultations with MediCare specialists.
            </p>
          </div>

          <Link to="/book-appointment" className="btn btn-primary">
            <Plus size={16} />
            <span>Book New Appointment</span>
          </Link>
        </div>

        {/* Appointments Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <DataTable
            columns={columns}
            data={patientAppointments}
            searchKey={['doctorName', 'department', 'id']}
            searchPlaceholder="Search by doctor or ID..."
            filterOptions={[
              { label: 'Confirmed', value: 'Confirmed' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Completed', value: 'Completed' },
              { label: 'Cancelled', value: 'Cancelled' }
            ]}
            emptyMessage="You have no recorded appointments matching your search."
          />
        </div>

        {/* Cancel Confirmation Dialog */}
        <ConfirmationModal
          isOpen={cancelModalOpen}
          onClose={() => setCancelModalOpen(false)}
          onConfirm={confirmCancel}
          title="Cancel Appointment"
          message={`Are you sure you want to cancel your appointment with ${selectedAppointment?.doctorName} on ${formatDate(selectedAppointment?.date)} at ${selectedAppointment?.time}?`}
          confirmText="Yes, Cancel Booking"
          confirmVariant="danger"
        />

      </main>
    </div>
  );
};

export default PatientAppointments;
