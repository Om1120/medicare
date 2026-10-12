import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Eye, CheckCircle2, Trash2, Receipt, AlertCircle, Printer, Download } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { addBill, markBillAsPaid, deleteBill } from '../../redux/slices/billSlice';
import { addPayment } from '../../redux/slices/paymentSlice';
import { formatDate, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminBills = () => {
  const { bills } = useSelector(state => state.bills);
  const { patients } = useSelector(state => state.patients);
  const { doctors } = useSelector(state => state.doctors);
  const dispatch = useDispatch();

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    patientName: patients[0]?.name || 'Rahul Sharma',
    doctorName: doctors[0]?.name || 'Dr. Aarav Shah',
    department: doctors[0]?.department || 'Cardiology',
    consultationFee: 800,
    testCharges: 1000,
    otherCharges: 200,
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
  });

  const handleOpenView = (bill) => {
    setSelectedBill(bill);
    setViewModalOpen(true);
  };

  const handleMarkPaid = (bill) => {
    dispatch(markBillAsPaid(bill.id));
    
    // Also record transaction in payments ledger
    const newPayment = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      billId: bill.id,
      patientName: bill.patientName,
      patientId: bill.patientId || 'pat-1',
      amount: bill.total,
      paymentMethod: 'Admin Cash / Counter Receipt',
      transactionRef: `TXN-OFFLINE-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Success',
      date: new Date().toISOString().split('T')[0]
    };
    dispatch(addPayment(newPayment));

    toast.success(`Invoice #${bill.id} marked as Paid & Payment logged.`);
  };

  const handleDeleteClick = (bill) => {
    setSelectedBill(bill);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedBill) {
      dispatch(deleteBill(selectedBill.id));
      toast.success(`Bill #${selectedBill.id} removed.`);
      setDeleteModalOpen(false);
      setSelectedBill(null);
    }
  };

  const handleCreateBill = (e) => {
    e.preventDefault();
    const consultation = Number(formData.consultationFee) || 0;
    const test = Number(formData.testCharges) || 0;
    const other = Number(formData.otherCharges) || 0;
    const total = consultation + test + other;

    const newBill = {
      id: `BILL-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientId: 'pat-1',
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      department: formData.department,
      consultationFee: consultation,
      testCharges: test,
      otherCharges: other,
      total,
      paymentStatus: 'Pending',
      date: new Date().toISOString().split('T')[0],
      dueDate: formData.dueDate,
      items: [
        { name: 'Specialist Consultation Fee', amount: consultation },
        { name: 'Diagnostic & Laboratory Investigations', amount: test },
        { name: 'Hospital Consumables / Admin Charges', amount: other }
      ].filter(item => item.amount > 0)
    };

    dispatch(addBill(newBill));
    toast.success(`New Invoice #${newBill.id} generated!`);
    setCreateModalOpen(false);
  };

  const columns = [
    {
      header: 'Invoice #',
      accessor: 'id',
      render: (row) => <strong style={{ color: 'var(--primary-dark)', fontSize: '0.85rem' }}>{row.id}</strong>
    },
    {
      header: 'Patient',
      accessor: 'patientName',
      render: (row) => <strong style={{ color: 'var(--text-dark)' }}>{row.patientName}</strong>
    },
    {
      header: 'Doctor / Dept',
      accessor: 'doctorName',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.88rem', fontWeight: '600' }}>{row.doctorName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--teal)' }}>{row.department}</div>
        </div>
      )
    },
    {
      header: 'Date & Due',
      accessor: 'date',
      render: (row) => (
        <div>
          <div style={{ fontSize: '0.85rem' }}>{formatDate(row.date)}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due: {formatDate(row.dueDate)}</div>
        </div>
      )
    },
    {
      header: 'Total Amount',
      accessor: 'total',
      render: (row) => <strong style={{ color: 'var(--primary-dark)', fontSize: '1rem' }}>{formatCurrency(row.total)}</strong>
    },
    {
      header: 'Status',
      accessor: 'paymentStatus',
      render: (row) => (
        <span className={`badge ${row.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
          {row.paymentStatus}
        </span>
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
            onClick={() => handleOpenView(row)}
            title="View Invoice"
          >
            <Eye size={14} />
          </button>
          {row.paymentStatus === 'Pending' && (
            <button
              type="button"
              className="btn btn-outline-teal btn-sm"
              style={{ padding: '0.35rem 0.55rem', color: 'var(--teal)', borderColor: 'var(--teal)' }}
              onClick={() => handleMarkPaid(row)}
              title="Mark Paid & Collect"
            >
              <CheckCircle2 size={14} />
            </button>
          )}
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            style={{ padding: '0.35rem 0.55rem', color: 'var(--danger)', borderColor: 'var(--danger-bg)' }}
            onClick={() => handleDeleteClick(row)}
            title="Delete Bill"
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
      <main className="admin-main" aria-label="Admin Hospital Invoices & Billing Panel">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
              Billing & Invoices Management
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Generate patient invoices, track pending medical dues, and verify settlement status.
            </p>
          </div>

          <button type="button" className="btn btn-primary" onClick={() => setCreateModalOpen(true)}>
            <Plus size={16} />
            <span>Generate Patient Invoice</span>
          </button>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <DataTable
            columns={columns}
            data={bills}
            searchKey={['id', 'patientName', 'doctorName', 'department']}
            searchPlaceholder="Search invoices by patient or ID..."
            filterOptions={[
              { label: 'Pending', value: 'Pending' },
              { label: 'Paid', value: 'Paid' }
            ]}
            filterKey="paymentStatus"
            filterPlaceholder="All Payment Statuses"
            emptyMessage="No billing records found."
          />
        </div>

        {/* View Invoice Modal */}
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title={`Hospital Tax Invoice #${selectedBill?.id}`}
          maxWidth="600px"
        >
          {selectedBill && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h3 style={{ margin: 0, color: 'var(--primary-dark)', fontSize: '1.2rem' }}>MediCare Super Specialty Hospital</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>104 Medical Enclave, New Delhi • GSTIN: 07AAACH1234F1Z8</div>
                </div>
                <span className={`badge ${selectedBill.paymentStatus === 'Paid' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '0.85rem' }}>
                  {selectedBill.paymentStatus}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Billed To (Patient)</span>
                  <strong>{selectedBill.patientName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Attending Doctor</span>
                  <strong>{selectedBill.doctorName} ({selectedBill.department})</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Bill Date</span>
                  <strong>{formatDate(selectedBill.date)}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Due Date</span>
                  <strong>{formatDate(selectedBill.dueDate)}</strong>
                </div>
              </div>

              {/* Itemized breakdown table */}
              <table className="table" style={{ marginTop: '0.5rem', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg-main)' }}>
                    <th>Service / Item Description</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td style={{ textAlign: 'right', fontWeight: '600' }}>{formatCurrency(item.amount)}</td>
                    </tr>
                  )) || (
                    <tr>
                      <td>Hospital Medical Consultation & Care</td>
                      <td style={{ textAlign: 'right' }}>{formatCurrency(selectedBill.total)}</td>
                    </tr>
                  )}
                  <tr style={{ borderTop: '2px solid var(--border)', fontWeight: '800' }}>
                    <td style={{ color: 'var(--primary-dark)', fontSize: '1rem' }}>Grand Total (INR)</td>
                    <td style={{ textAlign: 'right', color: 'var(--primary-dark)', fontSize: '1.1rem' }}>{formatCurrency(selectedBill.total)}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => window.print()}>
                  <Printer size={15} />
                  <span>Print Receipt</span>
                </button>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => setViewModalOpen(false)}>
                  Done
                </button>
              </div>
            </div>
          )}
        </Modal>

        {/* Generate Invoice Modal */}
        <Modal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          title="Generate New Patient Invoice"
          maxWidth="600px"
        >
          <form onSubmit={handleCreateBill} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                <label className="form-label">Doctor *</label>
                <select
                  className="form-select"
                  value={formData.doctorName}
                  onChange={(e) => {
                    const doc = doctors.find(d => d.name === e.target.value);
                    setFormData({
                      ...formData,
                      doctorName: e.target.value,
                      department: doc ? doc.department : formData.department,
                      consultationFee: doc ? doc.consultationFee : formData.consultationFee
                    });
                  }}
                >
                  {doctors.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.department})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Due Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Consultation Fee</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Diagnostics / Tests</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.testCharges}
                  onChange={(e) => setFormData({ ...formData, testCharges: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Other / Admin Fee</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.otherCharges}
                  onChange={(e) => setFormData({ ...formData, otherCharges: Number(e.target.value) })}
                />
              </div>
            </div>

            <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', color: 'var(--primary-dark)' }}>Calculated Total:</span>
              <strong style={{ fontSize: '1.25rem', color: 'var(--primary-dark)' }}>
                {formatCurrency((Number(formData.consultationFee) || 0) + (Number(formData.testCharges) || 0) + (Number(formData.otherCharges) || 0))}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setCreateModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Invoice
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Invoice"
          message={`Are you sure you want to delete invoice #${selectedBill?.id}?`}
          confirmText="Yes, Delete"
          confirmVariant="danger"
        />

      </main>
    </div>
  );
};

export default AdminBills;
