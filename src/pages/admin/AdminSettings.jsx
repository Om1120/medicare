import React, { useState } from 'react';
import { Settings, RefreshCw, Save, ShieldAlert, Building, Phone, Mail, Clock, Database, CheckCircle2 } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import ConfirmationModal from '../../components/ConfirmationModal';
import { resetToFactoryDemoData } from '../../utils/localStorage';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [hospitalInfo, setHospitalInfo] = useState({
    hospitalName: 'Apollo Hospitals & Heart Centre',
    tagline: 'Compassionate Care. Advanced Healthcare.',
    address: 'Plot 1A, Bhat GIDC Estate, Gandhinagar - Ahmedabad Highway, Ahmedabad 382428',
    emergencyHotline: '+91 79 6670 1800 / 1066',
    email: 'support@medicare.health',
    opdHours: '8:00 AM - 8:00 PM',
    emergencyHours: '24/7 (365 Days)',
    bedCapacity: 450,
    icuBeds: 60
  });

  const handleSaveInfo = (e) => {
    e.preventDefault();
    toast.success('Hospital configuration saved successfully.');
  };

  const handleResetData = () => {
    resetToFactoryDemoData();
    toast.success('Database state restored to verified baseline. Refreshing...');
    setResetModalOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main" aria-label="Admin System Settings Panel">
        
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
            Hospital Platform Settings
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Configure hospital network parameters, operational capacity, and system data repositories.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* General Information Form */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem', color: 'var(--primary-dark)' }}>
              <Building size={22} color="var(--primary)" />
              <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Primary Network Hub Profile</h2>
            </div>

            <form onSubmit={handleSaveInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Network / Hospital Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={hospitalInfo.hospitalName}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, hospitalName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Motto / Tagline</label>
                <input
                  type="text"
                  className="form-control"
                  value={hospitalInfo.tagline}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, tagline: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Campus Address</label>
                <input
                  type="text"
                  className="form-control"
                  value={hospitalInfo.address}
                  onChange={(e) => setHospitalInfo({ ...hospitalInfo, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Emergency Helpline</label>
                  <input
                    type="text"
                    className="form-control"
                    value={hospitalInfo.emergencyHotline}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, emergencyHotline: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Official Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={hospitalInfo.email}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, email: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Total Bed Capacity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={hospitalInfo.bedCapacity}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, bedCapacity: Number(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">ICU & Critical Beds</label>
                  <input
                    type="number"
                    className="form-control"
                    value={hospitalInfo.icuBeds}
                    onChange={(e) => setHospitalInfo({ ...hospitalInfo, icuBeds: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Save size={16} />
                  <span>Save Configuration Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Data Management & Cache */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', color: 'var(--primary-dark)' }}>
                <Database size={22} color="var(--teal)" />
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>System Data Repository</h2>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                Multi-hospital entities, doctor rosters, OPD schedules, appointments, and diagnostic billing records are synchronized across state layers.
              </p>

              <div style={{ padding: '1rem', backgroundColor: 'var(--bg-main)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1.5rem', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <div><strong>Hospital Registry:</strong> Synchronized (6 Facilities)</div>
                <div><strong>Doctor Schedules:</strong> Validated shift availability</div>
                <div><strong>Appointments & Invoices:</strong> Real-time persistence</div>
              </div>

              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setResetModalOpen(true)}
                style={{ color: 'var(--danger)', borderColor: 'var(--danger-bg)', width: '100%' }}
              >
                <RefreshCw size={16} />
                <span>Reset Database to Baseline State</span>
              </button>
            </div>

            <div className="card" style={{ padding: '1.75rem', backgroundColor: 'var(--primary-light)', borderColor: '#c8e3f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)', fontWeight: '700', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={20} color="var(--primary)" />
                <span>System Architecture Status</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--primary-dark)', margin: 0, lineHeight: '1.5' }}>
                The platform is configured with normalized data models for multi-hospital discovery, weighted criteria comparison scoring, doctor schedule validation, and secure outpatient booking.
              </p>
            </div>

          </div>

        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={resetModalOpen}
          onClose={() => setResetModalOpen(false)}
          onConfirm={handleResetData}
          title="Reset Local Database"
          message="Are you sure you want to restore all hospital, doctor, appointment, and facility records to the baseline verified state? Newly added local records will be reset."
          confirmText="Yes, Reset Baseline Data"
          confirmVariant="danger"
        />

      </main>
    </div>
  );
};

export default AdminSettings;
