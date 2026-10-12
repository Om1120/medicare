import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  CheckCircle, 
  ShieldCheck, 
  Lock, 
  FileText,
  AlertCircle
} from 'lucide-react';
import Modal from './Modal';
import { markBillAsPaid } from '../redux/slices/billSlice';
import { addPayment } from '../redux/slices/paymentSlice';
import { formatCurrency, generateId } from '../utils/helpers';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, bill }) => {
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState('UPI / QR Code');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  if (!bill) return null;

  const handlePay = async () => {
    setIsProcessing(true);

    try {
      const response = await paymentService.createPayment({
        billId: bill.id,
        patientId: bill.patientId || 'pat-1',
        patientName: bill.patientName,
        amount: bill.total,
        paymentMethod: paymentMethod
      });

      if (response.success) {
        const paymentRecord = {
          id: response.transactionId || generateId('PAY-2026'),
          billId: bill.id,
          patientId: bill.patientId || 'pat-1',
          patientName: bill.patientName,
          amount: bill.total,
          paymentDate: new Date().toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
          }),
          paymentMethod: paymentMethod,
          transactionRef: response.transactionId,
          status: 'Successful'
        };

        // Update Bill and Add Payment in Redux & LocalStorage
        dispatch(markBillAsPaid(bill.id));
        dispatch(addPayment(paymentRecord));

        setIsProcessing(false);
        setPaymentSuccess(paymentRecord);
        toast.success('Payment completed successfully.');
      } else {
        toast.error('Payment processing failed. Please try again.');
        setIsProcessing(false);
      }
    } catch (err) {
      toast.error('Payment gateway error. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setPaymentSuccess(null);
    setIsProcessing(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={paymentSuccess ? 'Payment Confirmed' : 'Hospital Payment Gateway'}
      maxWidth="550px"
    >
      {paymentSuccess ? (
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto'
            }}
          >
            <CheckCircle size={38} />
          </div>

          <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
            Payment Confirmed
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Transaction completed and medical invoice updated.
          </p>

          {/* Receipt Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.65rem', borderBottom: '1px dashed var(--border)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Transaction ID</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--primary-dark)' }}>{paymentSuccess.id}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px dashed var(--border)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Bill Reference</span>
              <strong style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>{paymentSuccess.billId}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px dashed var(--border)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Amount Paid</span>
              <strong style={{ fontSize: '1.05rem', color: 'var(--success)' }}>{formatCurrency(paymentSuccess.amount)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0', borderBottom: '1px dashed var(--border)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Payment Method</span>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{paymentSuccess.paymentMethod}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.65rem' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Status</span>
              <span className="badge badge-success">{paymentSuccess.status}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleClose}
              style={{ minWidth: '160px' }}
            >
              Done / Close
            </button>
          </div>
        </div>
      ) : (
        <div>
          {/* Bill Summary Banner */}
          <div
            style={{
              backgroundColor: 'var(--primary-light)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem',
              border: '1px solid #c8e3f0'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Patient: <strong>{bill.patientName}</strong></span>
              <span className="badge badge-warning">{bill.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Department: {bill.department || 'Clinical Care'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Doctor: {bill.doctorName}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Due</span>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
                  {formatCurrency(bill.total)}
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown items */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '0.4rem' }}>
              Fee Breakdown
            </span>
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Consultation Fee</span>
                <span>{formatCurrency(bill.consultationFee)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Diagnostic / Test Charges</span>
                <span>{formatCurrency(bill.testCharges)}</span>
              </div>
              {bill.otherCharges > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Hospital Facility Charges</span>
                  <span>{formatCurrency(bill.otherCharges)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px dashed var(--border)', fontWeight: '700' }}>
                <span>Total Payable</span>
                <span style={{ color: 'var(--primary)' }}>{formatCurrency(bill.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-dark)', display: 'block', marginBottom: '0.5rem' }}>
              Select Payment Method
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI / QR Code')}
                style={{
                  padding: '0.85rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${paymentMethod === 'UPI / QR Code' ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: paymentMethod === 'UPI / QR Code' ? 'var(--primary-light)' : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  color: paymentMethod === 'UPI / QR Code' ? 'var(--primary-dark)' : 'var(--text-body)'
                }}
              >
                <Smartphone size={20} color={paymentMethod === 'UPI / QR Code' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Credit/Debit Card')}
                style={{
                  padding: '0.85rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${paymentMethod === 'Credit/Debit Card' ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: paymentMethod === 'Credit/Debit Card' ? 'var(--primary-light)' : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  color: paymentMethod === 'Credit/Debit Card' ? 'var(--primary-dark)' : 'var(--text-body)'
                }}
              >
                <CreditCard size={20} color={paymentMethod === 'Credit/Debit Card' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Hospital Desk')}
                style={{
                  padding: '0.85rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: `2px solid ${paymentMethod === 'Hospital Desk' ? 'var(--primary)' : 'var(--border)'}`,
                  backgroundColor: paymentMethod === 'Hospital Desk' ? 'var(--primary-light)' : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.35rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  color: paymentMethod === 'Hospital Desk' ? 'var(--primary-dark)' : 'var(--text-body)'
                }}
              >
                <Building size={20} color={paymentMethod === 'Hospital Desk' ? 'var(--primary)' : 'var(--text-muted)'} />
                <span>Desk Payment</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.85rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', fontSize: '0.78rem', color: '#166534' }}>
            <ShieldCheck size={16} style={{ flexShrink: 0 }} />
            <span>256-bit encrypted healthcare payment processing.</span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-teal btn-sm"
              onClick={handlePay}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Payment...' : `Pay ${formatCurrency(bill.total)}`}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PaymentModal;
