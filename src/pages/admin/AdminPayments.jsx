import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { CreditCard, Eye, CheckCircle2, DollarSign, Download, Printer, ShieldCheck } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { formatDate, formatCurrency } from '../../utils/helpers';

const AdminPayments = () => {
  const { payments } = useSelector(state => state.payments);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const totalCollected = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const handleOpenReceipt = (payment) => {
    setSelectedPayment(payment);
    setViewModalOpen(true);
  };

  const columns = [
    {
      header: 'Receipt ID',
      accessor: 'id',
      render: (row) => <strong style={{ color: 'var(--primary-dark)', fontSize: '0.85rem' }}>{row.id}</strong>
    },
    {
      header: 'Patient Name',
      accessor: 'patientName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{row.patientName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Bill #{row.billId}</div>
        </div>
      )
    },
    {
      header: 'Amount Paid',
      accessor: 'amount',
      render: (row) => <strong style={{ color: 'var(--success)', fontSize: '1rem' }}>{formatCurrency(row.amount)}</strong>
    },
    {
      header: 'Payment Method',
      accessor: 'paymentMethod',
      render: (row) => <span className="badge badge-primary">{row.paymentMethod}</span>
    },
    {
      header: 'Date & Time',
      accessor: 'paymentDate',
      render: (row) => <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{row.paymentDate || row.date}</span>
    },
    {
      header: 'Transaction Ref',
      accessor: 'transactionRef',
      render: (row) => <span style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-dark)' }}>{row.transactionRef}</span>
    },
    {
      header: 'Actions',
      render: (row) => (
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          style={{ padding: '0.35rem 0.55rem' }}
          onClick={() => handleOpenReceipt(row)}
          title="View Electronic Receipt"
        >
          <Eye size={14} />
        </button>
      )
    }
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main" aria-label="Admin Payment Transactions Ledger">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
              Payment Transactions & Settlement
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              Electronic ledger of patient fee payments, digital receipts, and revenue reconciliation.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--primary-light)', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid #c8e3f0' }}>
            <DollarSign size={24} color="var(--primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Total Collections</div>
              <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-dark)' }}>{formatCurrency(totalCollected)}</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <DataTable
            columns={columns}
            data={payments}
            searchKey={['id', 'patientName', 'billId', 'transactionRef', 'paymentMethod']}
            searchPlaceholder="Search payments by txn ID, patient, bill..."
            filterOptions={[
              { label: 'UPI / QR Code', value: 'UPI / QR Code' },
              { label: 'Credit/Debit Card', value: 'Credit/Debit Card' },
              { label: 'Net Banking', value: 'Net Banking' },
              { label: 'Hospital Desk', value: 'Hospital Desk' }
            ]}
            filterKey="paymentMethod"
            filterPlaceholder="All Payment Methods"
            emptyMessage="No payment records found."
          />
        </div>

        {/* View Receipt Modal */}
        <Modal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="Electronic Payment Voucher"
          maxWidth="520px"
        >
          {selectedPayment && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ textAlign: 'center', padding: '1.25rem', backgroundColor: 'var(--success-bg)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(34, 160, 107, 0.2)' }}>
                <CheckCircle2 size={40} color="var(--success)" style={{ margin: '0 auto 0.5rem auto' }} />
                <h3 style={{ margin: 0, color: 'var(--success)', fontSize: '1.25rem' }}>Payment Successful</h3>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--primary-dark)', marginTop: '0.35rem' }}>
                  {formatCurrency(selectedPayment.amount)}
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Transaction Reference: {selectedPayment.transactionRef}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.88rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Patient Name</span>
                  <strong>{selectedPayment.patientName}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Invoice ID</span>
                  <strong>{selectedPayment.billId}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Payment Channel</span>
                  <strong>{selectedPayment.paymentMethod}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Processed Timestamp</span>
                  <strong>{selectedPayment.paymentDate || selectedPayment.date}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-main)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <ShieldCheck size={18} color="var(--teal)" />
                <span>Verified digital healthcare invoice transaction record.</span>
              </div>

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

      </main>
    </div>
  );
};

export default AdminPayments;
