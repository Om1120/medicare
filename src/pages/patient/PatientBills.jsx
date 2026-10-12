import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Receipt, CreditCard, CheckCircle, Clock, AlertCircle, Printer, Download, ShieldCheck } from 'lucide-react';
import PatientSidebar from '../../components/PatientSidebar';
import DataTable from '../../components/DataTable';
import PaymentModal from '../../components/PaymentModal';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/helpers';
import { invoiceService } from '../../services/invoiceService';
import toast from 'react-hot-toast';

const PatientBills = () => {
  const { user } = useSelector(state => state.auth);
  const { bills } = useSelector(state => state.bills);

  const [activeBillToPay, setActiveBillToPay] = useState(null);

  const patientBills = bills.filter(
    b => b.patientName?.toLowerCase() === user?.name?.toLowerCase() || b.patientId === 'pat-1' || b.patientId === user?.id
  );

  const handlePrintInvoice = (bill) => {
    invoiceService.printInvoice({
      id: bill.id,
      patientName: bill.patientName || user?.name || 'Verified Patient',
      patientId: bill.patientId || 'PT-2026-8821',
      doctorName: bill.doctorName,
      hospitalName: bill.hospitalName || 'MediCare Super Speciality Health',
      date: bill.date,
      amount: bill.total || 1500,
      paymentMethod: bill.paymentMethod || 'Online Gateway (UPI/Card)',
      items: [
        { description: 'Specialist Doctor Consultation & Clinical Assessment', dept: bill.department || 'Clinical OPD', amount: bill.consultationFee || 500 },
        { description: 'Laboratory Diagnostic & Medical Imaging', dept: 'Diagnostics', amount: bill.testCharges || 1000 },
        ...(bill.otherCharges > 0 ? [{ description: 'Hospital Facility & Registration Fee', dept: 'Administration', amount: bill.otherCharges }] : [])
      ]
    });
    toast.success(`Generated official GST tax invoice: ${bill.id}`);
  };

  const columns = [
    {
      header: 'Invoice #',
      accessor: 'id',
      render: (row) => <strong style={{ color: 'var(--primary-dark)', fontSize: '0.85rem' }}>{row.id}</strong>
    },
    {
      header: 'Consultation & Doctor',
      accessor: 'doctorName',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '700', color: 'var(--text-dark)' }}>{row.doctorName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--teal)' }}>{row.department || 'Clinical OPD'}</div>
        </div>
      )
    },
    {
      header: 'Date',
      accessor: 'date',
      render: (row) => formatDate(row.date)
    },
    {
      header: 'Fee Breakdown',
      render: (row) => (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div>Consultation: {formatCurrency(row.consultationFee)}</div>
          <div>Tests/Procedures: {formatCurrency(row.testCharges)}</div>
          {row.otherCharges > 0 && <div>Other: {formatCurrency(row.otherCharges)}</div>}
        </div>
      )
    },
    {
      header: 'Total Amount',
      accessor: 'total',
      render: (row) => (
        <strong style={{ fontSize: '1rem', color: 'var(--primary-dark)' }}>
          {formatCurrency(row.total)}
        </strong>
      )
    },
    {
      header: 'Status',
      accessor: 'paymentStatus',
      render: (row) => (
        <span className={`badge ${getStatusBadgeClass(row.paymentStatus)}`}>
          {row.paymentStatus}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {row.paymentStatus === 'Pending' ? (
            <button
              type="button"
              className="btn btn-teal btn-sm"
              style={{ padding: '0.3rem 0.8rem', fontSize: '0.82rem' }}
              onClick={() => setActiveBillToPay(row)}
            >
              <CreditCard size={14} />
              <span>Pay Now</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              style={{ padding: '0.3rem 0.65rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              onClick={() => handlePrintInvoice(row)}
              title="Download Certified Tax Invoice PDF"
            >
              <Printer size={13} />
              <span>Invoice PDF</span>
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="patient-layout">
      <PatientSidebar />
      <main className="patient-main" aria-label="Patient Invoices Area">
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
            Invoices & Hospital Bills
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Official itemized medical invoices with live payment settlement and GST tax receipts.
          </p>
        </div>

        {/* Transparent Medical Billing Info */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--teal)', textTransform: 'uppercase' }}>
              Standard OPD Invoicing Architecture
            </span>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', margin: '0.2rem 0' }}>
              Transparent Healthcare Billing
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
              Consultation Fee: ₹500 | Diagnostic Assessment: ₹1,000 | Standard Total: ₹1,500
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#166534', backgroundColor: '#F0FDF4', padding: '0.5rem 0.85rem', borderRadius: '6px', border: '1px solid #BBF7D0' }}>
            <ShieldCheck size={18} color="#16A34A" />
            <span>Digital Cryptographic QR Seals on all settled tax invoices</span>
          </div>
        </div>

        {/* Bills Table */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <DataTable
            columns={columns}
            data={patientBills}
            searchKey={['id', 'doctorName', 'department']}
            searchPlaceholder="Search bills by invoice # or doctor..."
            filterOptions={[
              { label: 'Paid', value: 'Paid' },
              { label: 'Pending', value: 'Pending' }
            ]}
            filterKey="paymentStatus"
            emptyMessage="No billing records found."
          />
        </div>

        {/* Live Payment Checkout Gateway Modal */}
        <PaymentModal
          isOpen={!!activeBillToPay}
          onClose={() => setActiveBillToPay(null)}
          bill={activeBillToPay}
        />

      </main>
    </div>
  );
};

export default PatientBills;
