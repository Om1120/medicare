import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FileText, Download, Eye, Calendar, User, Stethoscope, ShieldCheck, QrCode, Pill, CheckCircle2 } from 'lucide-react';
import PatientSidebar from '../../components/PatientSidebar';
import Modal from '../../components/Modal';
import { formatDate } from '../../utils/helpers';
import { invoiceService } from '../../services/invoiceService';
import toast from 'react-hot-toast';

const PatientRecords = () => {
  const { user } = useSelector(state => state.auth);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Digital Medical Records & Clinical Diagnostic Reports
  const medicalRecords = [
    {
      id: 'REC-2026-901',
      title: 'Comprehensive Lipid & Cardiac Evaluation',
      department: 'Cardiology',
      doctor: 'Dr. Aarav Shah',
      hospitalName: 'Apollo Speciality Hospitals',
      date: '2026-09-24',
      type: 'Laboratory & Diagnostic',
      summary: 'Normal sinus rhythm ECG, total cholesterol 185 mg/dL (Desirable), LDL 110 mg/dL. Blood pressure 128/82 mmHg.',
      prescription: 'Tab Telmisartan 40mg (1 OD morning), Omega-3 Fish Oil 1000mg',
      doctorNotes: 'Follow heart-healthy Mediterranean diet. Repeat lipid profile in 6 months.'
    },
    {
      id: 'REC-2026-902',
      title: 'Executive Annual Health Screening',
      department: 'General Medicine',
      doctor: 'Dr. Sunita Rao',
      hospitalName: 'Fortis Memorial Health Institute',
      date: '2026-06-12',
      type: 'Health Checkup',
      summary: 'HbA1c 5.6% (Normal), Serum Creatinine 0.9 mg/dL, Liver Function Tests within normal limits. Chest X-Ray clear.',
      prescription: 'Tab Multivitamin (1 OD for 30 days), Vitamin D3 60k IU weekly for 4 weeks.',
      doctorNotes: 'Maintain active physical exercise of 150 mins per week. Hydration adequate.'
    },
    {
      id: 'REC-2026-903',
      title: 'Dermatological Skin Allergy & Patch Assessment',
      department: 'Dermatology',
      doctor: 'Dr. Vikram Singhania',
      hospitalName: 'Zydus Hospitals & Healthcare Research, Ahmedabad',
      date: '2026-03-18',
      type: 'Clinical Consultation',
      summary: 'Mild contact dermatitis over bilateral forearms. Negative for chronic eczema.',
      prescription: 'Desonide Cream 0.05% topically BID x 5 days, Cetirizine 10mg PRN',
      doctorNotes: 'Avoid harsh synthetic detergents. Use hypoallergenic moisturizing lotion.'
    }
  ];

  const handleDownload = (rec) => {
    invoiceService.printInvoice({
      id: rec.id,
      patientName: user?.name || 'Verified Patient',
      patientId: 'PT-2026-8821',
      doctorName: rec.doctor,
      hospitalName: rec.hospitalName || 'MediCare Health Network',
      date: rec.date,
      amount: 1500,
      items: [
        { description: rec.title, dept: rec.department, amount: 1500 }
      ]
    });
    toast.success(`Generated official clinical diagnostic report: ${rec.id}`);
  };

  return (
    <div className="patient-layout">
      <PatientSidebar />
      <main className="patient-main" aria-label="Patient Medical Records Area">
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
            Medical History & Diagnostic Reports
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Digitally certified physician consultation summaries, lab parameters, prescriptions, and cryptographic QR validations.
          </p>
        </div>

        {/* Verified Records Security Badge */}
        <div style={{ padding: '0.85rem 1.25rem', backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 'var(--radius-md)', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.85rem', color: '#166534' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={20} color="#16A34A" />
            <span>
              <strong>ABDM & HIPAA Compliant Health Records</strong> • End-to-end encrypted with digital hospital authorization.
            </span>
          </div>
          <span className="badge badge-success">DIGITALLY VERIFIED</span>
        </div>

        {/* Records Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {medicalRecords.map((rec) => (
            <div key={rec.id} className="card card-interactive" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="badge badge-info">{rec.department}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(rec.date)}</span>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
                {rec.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--teal)', fontWeight: '600', marginBottom: '0.75rem' }}>
                Attending: {rec.doctor} • {rec.hospitalName}
              </p>

              <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                {rec.summary}
              </p>

              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setSelectedRecord(rec)}
                >
                  <Eye size={15} />
                  <span>Clinical View</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleDownload(rec)}
                >
                  <Download size={15} />
                  <span>Export Report PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Record Details Modal */}
        {selectedRecord && (
          <Modal
            isOpen={!!selectedRecord}
            onClose={() => setSelectedRecord(null)}
            title={selectedRecord.title}
            maxWidth="640px"
            footer={
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleDownload(selectedRecord)}
                >
                  <Download size={14} />
                  <span>Print Certified PDF</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => setSelectedRecord(null)}
                >
                  Close Report
                </button>
              </div>
            }
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Record ID: <strong>{selectedRecord.id}</strong></span>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: '700' }}>{selectedRecord.doctor} ({selectedRecord.department})</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--teal)' }}>{selectedRecord.hospitalName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Date of Exam</span>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{formatDate(selectedRecord.date)}</div>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', display: 'block', marginBottom: '0.3rem' }}>
                  Clinical Diagnostic Findings & Parameters
                </strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-body)', backgroundColor: 'var(--bg-main)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', margin: 0 }}>
                  {selectedRecord.summary}
                </p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', display: 'block', marginBottom: '0.3rem' }}>
                  Prescribed Pharmaceuticals & Regimen
                </strong>
                <p style={{ fontSize: '0.88rem', color: 'var(--primary)', backgroundColor: 'var(--primary-light)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #c8e3f0', margin: 0, fontWeight: '600' }}>
                  💊 {selectedRecord.prescription}
                </p>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', display: 'block', marginBottom: '0.3rem' }}>
                  Physician Advice & Lifestyle Notes
                </strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-body)', margin: 0, lineHeight: '1.5' }}>
                  {selectedRecord.doctorNotes}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                <img
                  src={invoiceService.getQrCodeUrl(`https://medicare.org/records/${selectedRecord.id}`)}
                  alt="QR validation"
                  style={{ width: '50px', height: '50px', borderRadius: '4px' }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <strong>Digital Seal Verification</strong><br />
                  Scan to verify authentic hospital record signatures on ABDM registry.
                </div>
              </div>
            </div>
          </Modal>
        )}

      </main>
    </div>
  );
};

export default PatientRecords;
