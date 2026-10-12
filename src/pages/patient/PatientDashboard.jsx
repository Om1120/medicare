import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Calendar, 
  FileText, 
  Receipt, 
  CreditCard, 
  Clock, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Plus,
  HeartPulse,
  Bookmark,
  ShieldCheck,
  Stethoscope,
  PhoneCall,
  User,
  MapPin,
  Sparkles
} from 'lucide-react';
import PatientSidebar from '../../components/PatientSidebar';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/helpers';

const PatientDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const appointments = useSelector(state => state.appointments?.appointments || state.appointments?.items || []);
  const bills = useSelector(state => state.bills?.bills || state.bills?.items || []);
  const payments = useSelector(state => state.payments?.payments || state.payments?.items || []);

  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const safeBills = Array.isArray(bills) ? bills : [];
  const safePayments = Array.isArray(payments) ? payments : [];

  // Filter for logged in patient (or fallback to pat-1 / all patient appointments)
  const patientEmail = (user?.email || 'patient@medicare.health').toLowerCase();
  const userName = (user?.name || '').toLowerCase();
  const userId = user?.id || 'pat-1';

  const patientAppointments = safeAppointments.filter(a => {
    if (!a) return false;
    const aEmail = (a.patientEmail || '').toLowerCase();
    const aName = (a.patientName || '').toLowerCase();
    return aEmail === patientEmail || (userName && aName === userName) || a.patientId === userId || a.patientId === 'pat-1';
  });

  const upcomingAppointments = patientAppointments.filter(a => a?.status === 'Confirmed' || a?.status === 'Pending');
  const completedAppointments = patientAppointments.filter(a => a?.status === 'Completed');

  const patientBills = safeBills.filter(b => {
    if (!b) return false;
    const bName = (b.patientName || '').toLowerCase();
    return (userName && bName === userName) || b.patientId === userId || b.patientId === 'pat-1';
  });
  const pendingBills = patientBills.filter(b => b?.paymentStatus === 'Pending');
  const totalPendingAmount = pendingBills.reduce((acc, curr) => acc + (Number(curr?.total) || 0), 0);

  const patientPayments = safePayments.filter(p => {
    if (!p) return false;
    const pName = (p.patientName || '').toLowerCase();
    return (userName && pName === userName) || p.patientId === userId || p.patientId === 'pat-1';
  });

  return (
    <div className="patient-layout">
      <PatientSidebar />
      <main className="patient-main" aria-label="Patient Dashboard Area">
        
        {/* Welcome Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0B6E99 0%, #084966 60%, #16A6A3 100%)',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem 2.25rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 10px 25px rgba(11, 110, 153, 0.22)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Subtle background glow effect */}
          <div style={{ position: 'absolute', right: '-40px', top: '-40px', width: '220px', height: '220px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(22, 166, 163, 0.4) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '640px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', color: '#E0F2FE', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '0.65rem' }}>
              <ShieldCheck size={14} color="#38BDF8" />
              <span>Verified Patient Portal</span>
            </div>
            <h1 style={{ color: '#ffffff', fontSize: '1.95rem', margin: '0.1rem 0 0.5rem 0', fontWeight: '800', lineHeight: 1.2 }}>
              Welcome back, {user?.name || 'Rahul Sharma'}!
            </h1>
            <p style={{ color: '#EAF6FB', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
              Manage your doctor consultations, outpatient tickets, hospital bills, and medical history in one unified healthcare hub.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link to="/book-appointment" className="btn btn-teal" style={{ boxShadow: '0 4px 14px rgba(22, 166, 163, 0.4)' }}>
              <Plus size={16} />
              <span>Book Appointment</span>
            </Link>
            <Link to="/patient/records" className="btn btn-outline-light" style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}>
              <FileText size={16} />
              <span>Health Records</span>
            </Link>
          </div>
        </div>

        {/* Dashboard Statistics Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.25rem' }}>
          
          <div className="stat-card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div className="stat-value">{upcomingAppointments.length}</div>
              <div className="stat-label">Upcoming Appointments</div>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeft: '4px solid var(--success)' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="stat-value">{completedAppointments.length}</div>
              <div className="stat-label">Completed Consultations</div>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeft: '4px solid #F59E0B' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--warning-bg)', color: '#B45309' }}>
              <Receipt size={24} />
            </div>
            <div>
              <div className="stat-value">{pendingBills.length}</div>
              <div className="stat-label">
                {pendingBills.length > 0 ? `Pending (${formatCurrency(totalPendingAmount)})` : 'Pending Invoices'}
              </div>
            </div>
          </div>

          <div className="stat-card" style={{ borderLeft: '4px solid var(--teal)' }}>
            <div className="stat-icon" style={{ backgroundColor: 'var(--teal-light)', color: 'var(--teal)' }}>
              <CreditCard size={24} />
            </div>
            <div>
              <div className="stat-value">{patientPayments.length}</div>
              <div className="stat-label">Payment Receipts</div>
            </div>
          </div>

        </div>

        {/* Main Content Split: Consultation Spotlight & Bills Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', marginBottom: '2.25rem' }}>
          
          {/* Upcoming Appointment Spotlight Card */}
          <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stethoscope size={20} color="var(--primary)" />
                <h2 style={{ fontSize: '1.18rem', color: 'var(--primary-dark)', margin: 0, fontWeight: '700' }}>
                  Next Scheduled Consultation
                </h2>
              </div>
              <Link to="/patient/appointments" style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--primary)' }}>
                View All ({patientAppointments.length})
              </Link>
            </div>

            {upcomingAppointments.length > 0 ? (
              (() => {
                const nextApt = upcomingAppointments[0];
                return (
                  <div style={{ 
                    backgroundColor: '#F8FAFC', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-lg)', 
                    padding: '1.4rem', 
                    flex: 1, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                        <div>
                          <strong style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', display: 'block' }}>
                            {nextApt.doctorName}
                          </strong>
                          <span style={{ fontSize: '0.82rem', color: 'var(--teal)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                            {nextApt.department || 'General Medicine'}
                          </span>
                        </div>
                        <span className={`badge ${getStatusBadgeClass(nextApt.status)}`} style={{ padding: '0.3rem 0.75rem', fontSize: '0.76rem' }}>
                          {nextApt.status}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.86rem', color: 'var(--text-body)', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <Clock size={16} color="var(--primary)" />
                          <span style={{ fontWeight: '700', color: 'var(--text-dark)' }}>
                            {formatDate(nextApt.date)} • {nextApt.time || '10:00 AM'}
                          </span>
                        </div>
                        
                        {nextApt.reason && (
                          <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', paddingLeft: '0.25rem' }}>
                            <strong>Purpose:</strong> {nextApt.reason}
                          </div>
                        )}

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', paddingLeft: '0.25rem' }}>
                          <MapPin size={14} color="var(--teal)" />
                          <span>Outpatient Clinic Complex (OPD) • Ticket #{nextApt.id}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.85rem', borderTop: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                        Fee: {nextApt.fee ? formatCurrency(nextApt.fee) : 'Covered under PMJAY / Free'}
                      </span>
                      <Link to="/patient/appointments" className="btn btn-outline-primary btn-sm">
                        <span>Ticket Details</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem', color: 'var(--text-muted)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={36} color="var(--teal)" style={{ marginBottom: '0.75rem', opacity: 0.8 }} />
                <h3 style={{ fontSize: '1rem', color: 'var(--primary-dark)', margin: '0 0 0.35rem 0' }}>No Upcoming Consultations</h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                  You currently have no scheduled appointments. Book a slot with top specialists in Gujarat.
                </p>
                <Link to="/book-appointment" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                  <Plus size={14} />
                  <span>Book Consultation Slot</span>
                </Link>
              </div>
            )}
          </div>

          {/* Pending Bills & Billing Overview Spotlight Card */}
          <div className="card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Receipt size={20} color="#B45309" />
                <h2 style={{ fontSize: '1.18rem', color: 'var(--primary-dark)', margin: 0, fontWeight: '700' }}>
                  Medical Invoices & Bills
                </h2>
              </div>
              <Link to="/patient/bills" style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--primary)' }}>
                All Invoices ({patientBills.length})
              </Link>
            </div>

            {pendingBills.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
                {pendingBills.slice(0, 2).map(bill => (
                  <div
                    key={bill.id}
                    style={{
                      padding: '1.1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <div>
                      <strong style={{ fontSize: '0.94rem', color: 'var(--primary-dark)', display: 'block' }}>
                        {bill.doctorName || 'Clinical Consultation'}
                      </strong>
                      <span style={{ fontSize: '0.78rem', color: '#92400E', fontWeight: '600' }}>
                        Invoice #{bill.id} • {formatDate(bill.date)}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.12rem', fontWeight: '800', color: '#92400E' }}>
                        {formatCurrency(bill.total)}
                      </div>
                      <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>Pending</span>
                    </div>
                  </div>
                ))}

                <div style={{ marginTop: 'auto', paddingTop: '0.85rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Total Pending: <strong style={{ color: '#92400E' }}>{formatCurrency(totalPendingAmount)}</strong>
                  </div>
                  <Link to="/patient/bills" className="btn btn-teal btn-sm">
                    <span>Review & Pay Invoices</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem', color: 'var(--text-muted)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border)', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={36} color="var(--success)" style={{ marginBottom: '0.75rem' }} />
                <h3 style={{ fontSize: '1rem', color: 'var(--primary-dark)', margin: '0 0 0.35rem 0' }}>All Invoices Settled</h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                  No outstanding hospital invoices or diagnostic payments at this time.
                </p>
                <Link to="/patient/bills" className="btn btn-outline-secondary btn-sm" style={{ marginTop: '1rem' }}>
                  View Payment Receipts
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* Quick Health Shortcuts Grid */}
        <div style={{ marginBottom: '2.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--primary-dark)', marginBottom: '1rem', fontWeight: '700' }}>
            Quick Healthcare Services
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            
            <Link 
              to="/patient/records" 
              className="card" 
              style={{ 
                padding: '1.25rem', 
                textDecoration: 'none', 
                color: 'inherit', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                transition: 'all 0.2s ease',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#E0F2FE', color: '#0369A1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <FileText size={22} />
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--primary-dark)', display: 'block' }}>Diagnostic Records</strong>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Lab reports, ECG, scans</span>
              </div>
            </Link>

            <Link 
              to="/patient/saved" 
              className="card" 
              style={{ 
                padding: '1.25rem', 
                textDecoration: 'none', 
                color: 'inherit', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                transition: 'all 0.2s ease',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bookmark size={22} />
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--primary-dark)', display: 'block' }}>Saved Favorites</strong>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Preferred hospitals & doctors</span>
              </div>
            </Link>

            <Link 
              to="/doctors" 
              className="card" 
              style={{ 
                padding: '1.25rem', 
                textDecoration: 'none', 
                color: 'inherit', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                transition: 'all 0.2s ease',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Stethoscope size={22} />
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', color: 'var(--primary-dark)', display: 'block' }}>Specialist Directory</strong>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Browse verified doctors</span>
              </div>
            </Link>

            <Link 
              to="/emergency" 
              className="card" 
              style={{ 
                padding: '1.25rem', 
                textDecoration: 'none', 
                color: 'inherit', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem',
                transition: 'all 0.2s ease',
                border: '1px solid #FECACA',
                backgroundColor: '#FFF5F5'
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <PhoneCall size={22} />
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', color: '#B91C1C', display: 'block' }}>Emergency 24/7</strong>
                <span style={{ fontSize: '0.76rem', color: '#DC2626' }}>Call 108 • ICU & Trauma</span>
              </div>
            </Link>

          </div>
        </div>

        {/* Patient Care & Assistance Notice */}
        <div style={{ 
          padding: '1.15rem 1.4rem', 
          backgroundColor: '#F0F9FF', 
          border: '1px solid #BAE6FD', 
          borderRadius: 'var(--radius-lg)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem', 
          fontSize: '0.84rem', 
          color: '#0369A1' 
        }}>
          <AlertCircle size={22} color="#0284C7" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong>Need assistance with your booking or medical records?</strong> Our clinical helpdesk is available 24 hours a day at <strong>+91 79 4000 1000</strong> or visit the nearest MediCare outpatient counter.
          </div>
          <Link to="/emergency" className="btn btn-outline-primary btn-sm" style={{ flexShrink: 0 }}>
            Emergency Care
          </Link>
        </div>

      </main>
    </div>
  );
};

export default PatientDashboard;
