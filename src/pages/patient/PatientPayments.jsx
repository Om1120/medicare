import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CreditCard, Printer, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import PatientSidebar from '../../components/PatientSidebar';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/helpers';

const PatientPayments = () => {
  const { user } = useSelector(state => state.auth);
  const { payments } = useSelector(state => state.payments);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const patientPayments = payments.filter(
    p => p.patientName?.toLowerCase() === user?.name?.toLowerCase() || p.patientId === 'pat-1' || p.patientId === user?.id
  );

  const columns = [
    {
      header: 'Payment ID',
      accessor: 'id',
      render: (row) => <strong style={{ color: 'var(--primary-dark)', fontSize: '0.85rem' }}>{row.id}</strong>
    },
    {
      header: 'Bill Reference',
      accessor: 'billId',
      render: (row) => <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{row.billId}</span>
    },
    {
      header: 'Amount Paid',
      accessor: 'amount',
      render: (row) => (
        <strong style={{ fontSize: '0.98rem', color: 'var(--success)' }}>
          {formatCurrency(row.amount)}
        </strong>
      )
    },
    {
      header: 'Payment Method',
      accessor: 'paymentMethod',
      render: (row) => (
        <span className="badge badge-neutral" style={{ fontSize: '0.78rem' }}>
          {row.paymentMethod}
        </span>
      )
    },
    {
      header: 'Date & Time',
      accessor: 'paymentDate',
      render: (row) => <span style={{ fontSize: '0.85rem' }}>{row.paymentDate}</span>
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
      header: 'Receipt',
      render: (row) => (
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          style={{ padding: '0.25rem 0.65rem', fontSize: '0.78rem' }}
          onClick={() => setSelectedReceipt(row)}
        >
          <Eye size={14} />
          <span>Receipt</span>
        </button>
      )
    }
  ];

  return (
    <div className="patient-layout">
      <PatientSidebar />
      <main className="patient-main" aria-label="Patient Payments Area">
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
            Payment Transactions & Receipts
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Transaction history, payment references, and official billing receipts.
          </p>
        </div>

        {/* Payments Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <DataTable
            columns={columns}
            data={patientPayments}
            searchKey={['id', 'billId', 'paymentMethod']}
            searchPlaceholder="Search by payment or bill ID..."
            filterOptions={[
              { label: 'UPI / QR Code', value: 'UPI / QR Code' },
              { label: 'Credit/Debit Card', value: 'Credit/Debit Card' },
              { label: 'Hospital Desk', value: 'Hospital Desk' }
            ]}
            filterKey="paymentMethod"
            emptyMessage="No payment transaction records found."
          />
        </div>

        {/* Receipt Modal */}
        {selectedReceipt && (
          <Modal
            isOpen={!!selectedReceipt}
            onClose={() => setSelectedReceipt(null)}
            title="Official Payment Receipt"
            maxWidth="500px"
            footer={
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => window.print()}
                >
                  <Printer size={15} />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setSelectedReceipt(null)}
                >
                  Done
                </button>
              </div>
            }
          >
            <div style={{ padding: '0.5rem 0' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={40} color="var(--success)" style={{ margin: '0 auto 0.5rem auto' }} />
                <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', margin: 0 }}>
                  MediCare Healthcare Network Receipt
                </h3>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Verified Clinical Invoicing System
                </span>
              </div>

              <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Receipt ID:</span>
                  <strong>{selectedReceipt.id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Bill ID:</span>
                  <span>{selectedReceipt.billId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Patient Name:</span>
                  <strong>{selectedReceipt.patientName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment Date:</span>
                  <span>{selectedReceipt.paymentDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Method:</span>
                  <span>{selectedReceipt.paymentMethod}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Ref Code:</span>
                  <span style={{ fontSize: '0.75rem' }}>{selectedReceipt.transactionRef || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
                  <span>Total Paid:</span>
                  <span style={{ color: 'var(--success)' }}>{formatCurrency(selectedReceipt.amount)}</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                This receipt is officially issued for medical consultation and outpatient services.
              </div>
            </div>
          </Modal>
        )}

      </main>
    </div>
  );
};

export default PatientPayments;
