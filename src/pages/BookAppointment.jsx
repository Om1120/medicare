import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  Building2, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  Check, 
  ShieldCheck,
  Stethoscope,
  DollarSign
} from 'lucide-react';
import { addAppointment } from '../redux/slices/appointmentSlice';
import { isDoctorWorkingOnDate, getSlotAvailability, DAY_NAMES } from '../services/availabilityService';
import { notificationService } from '../services/notificationService';
import { invoiceService } from '../services/invoiceService';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  patientName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Patient full name is required'),
  age: Yup.number()
    .typeError('Age must be a valid number')
    .min(1, 'Please enter a valid age')
    .max(120, 'Please enter a valid age')
    .required('Age is required'),
  gender: Yup.string().required('Please select gender'),
  contact: Yup.string()
    .matches(/^[0-9+\s-]{8,15}$/, 'Please enter a valid phone number')
    .required('Contact number is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  reason: Yup.string()
    .min(5, 'Please provide a brief reason for the consultation (at least 5 characters)')
    .required('Reason for visit is required')
});

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: allHospitals } = useSelector(state => state.hospitals);
  const { items: allDoctors } = useSelector(state => state.doctors);
  const { items: allAppointments } = useSelector(state => state.appointments);
  const { user, isAuthenticated } = useSelector(state => state.auth);

  // Read URL query parameters if pre-selected
  const initialHospId = searchParams.get('hospitalId') || (allHospitals[0]?.id || '');
  const initialDocId = searchParams.get('doctorId') || '';
  const initialDept = searchParams.get('department') || '';

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedHospitalId, setSelectedHospitalId] = useState(initialHospId);
  const [selectedDepartment, setSelectedDepartment] = useState(initialDept);
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDocId);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedApt, setConfirmedApt] = useState(null);

  const selectedHospital = allHospitals.find(h => h.id === selectedHospitalId);

  // Doctors available at the selected hospital
  const availableDoctorsAtHospital = useMemo(() => {
    return allDoctors.filter(d => 
      d.hospitalId === selectedHospitalId || (d.hospitalIds && d.hospitalIds.includes(selectedHospitalId))
    );
  }, [allDoctors, selectedHospitalId]);

  // Unique departments for selected hospital
  const hospitalDepartments = useMemo(() => {
    const depts = new Set(availableDoctorsAtHospital.map(d => d.department));
    return Array.from(depts);
  }, [availableDoctorsAtHospital]);

  // Doctors filtered by hospital + department
  const filteredDoctors = useMemo(() => {
    if (!selectedDepartment) return availableDoctorsAtHospital;
    return availableDoctorsAtHospital.filter(d => d.department === selectedDepartment);
  }, [availableDoctorsAtHospital, selectedDepartment]);

  const selectedDoctor = allDoctors.find(d => d.id === selectedDoctorId);

  // Auto-select first doctor if doctor query param present
  useEffect(() => {
    if (initialDocId) {
      const doc = allDoctors.find(d => d.id === initialDocId);
      if (doc) {
        setSelectedDoctorId(doc.id);
        setSelectedHospitalId(doc.hospitalId);
        setSelectedDepartment(doc.department);
      }
    }
  }, [initialDocId, allDoctors]);

  // Calculate slot availability
  const slotOptions = useMemo(() => {
    if (!selectedDoctor || !selectedDate) return [];
    return getSlotAvailability(selectedDoctor, selectedDate, allAppointments);
  }, [selectedDoctor, selectedDate, allAppointments]);

  // Handle Date Selection validation
  const handleDateChange = (e) => {
    const val = e.target.value;
    setSelectedDate(val);
    setSelectedTimeSlot('');

    if (selectedDoctor && val) {
      const isWorking = isDoctorWorkingOnDate(selectedDoctor, val);
      if (!isWorking) {
        const dayName = DAY_NAMES[new Date(val).getDay()];
        toast.error(`${selectedDoctor.name} is not scheduled on ${dayName}. Scheduled days: ${(selectedDoctor.availableDays || []).join(', ')}`);
      }
    }
  };

  // Min date is tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  // Max date is 60 days ahead
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateString = maxDate.toISOString().split('T')[0];

  const handleFinalSubmit = (values, { setSubmitting }) => {
    if (!selectedHospital || !selectedDoctor || !selectedDate || !selectedTimeSlot) {
      toast.error('Please complete all selection steps.');
      setSubmitting(false);
      return;
    }

    const appointmentId = `APT-${Date.now().toString().slice(-6)}`;
    const newAppointment = {
      id: appointmentId,
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      department: selectedDoctor.department,
      date: selectedDate,
      time: selectedTimeSlot,
      patientName: values.patientName,
      patientEmail: values.email,
      patientContact: values.contact,
      age: values.age,
      gender: values.gender,
      reason: values.reason,
      fee: selectedDoctor.fee,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    dispatch(addAppointment(newAppointment));
    setConfirmedApt(newAppointment);
    setIsSuccess(true);
    setSubmitting(false);

    // Multi-channel notification dispatch
    notificationService.dispatchMultiChannelAlert({
      type: 'appointment',
      recipient: values.contact,
      data: {
        hospitalName: selectedHospital.name,
        doctorName: selectedDoctor.name,
        date: selectedDate,
        time: selectedTimeSlot,
        patientName: values.patientName,
        id: appointmentId
      }
    });

    toast.success('Consultation appointment confirmed! Dispatching SMS & WhatsApp alerts.');
  };

  const handlePrintSlip = () => {
    if (!confirmedApt) return;
    invoiceService.printInvoice({
      id: confirmedApt.id,
      patientName: confirmedApt.patientName,
      patientId: 'PT-2026-8821',
      doctorName: confirmedApt.doctorName,
      hospitalName: confirmedApt.hospitalName,
      date: confirmedApt.date,
      amount: confirmedApt.fee || 500,
      items: [
        { description: `OPD Specialist Consultation - Dr. ${confirmedApt.doctorName}`, dept: confirmedApt.department, amount: confirmedApt.fee || 500 }
      ]
    });
  };

  if (isSuccess && confirmedApt) {
    const waLink = notificationService.generateWhatsAppLink(confirmedApt.patientContact || '919876543210', confirmedApt);

    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '720px' }}>
        <div className="card" style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#ffffff', border: '1px solid var(--border)', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
            <CheckCircle2 size={36} />
          </div>

          <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-dark)', marginBottom: '0.4rem' }}>
            Appointment Confirmed & Dispatched
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            Your consultation token has been generated and multi-channel notifications have been dispatched.
          </p>

          <div style={{ backgroundColor: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', textAlign: 'left', marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Token Reference:</span>
              <strong style={{ color: 'var(--primary-dark)', fontSize: '0.95rem' }}>{confirmedApt.id}</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Hospital:</span>
                <strong>{confirmedApt.hospitalName}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Doctor / Specialist:</span>
                <strong>{confirmedApt.doctorName}</strong> ({confirmedApt.department})
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Date & Scheduled Time:</span>
                <strong>{confirmedApt.date} at {confirmedApt.time}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Patient Name:</span>
                <strong>{confirmedApt.patientName}</strong> (Age {confirmedApt.age}, {confirmedApt.gender})
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.78rem' }}>Consultation Fee:</span>
                <strong style={{ color: 'var(--primary)' }}>{formatCurrency(confirmedApt.fee)}</strong>
              </div>
            </div>
          </div>

          {/* Action Row: WhatsApp, PDF Print, View Dashboard */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm"
              style={{ backgroundColor: '#25D366', color: '#ffffff', fontWeight: '700' }}
            >
              💬 Send to WhatsApp
            </a>
            <button
              type="button"
              onClick={handlePrintSlip}
              className="btn btn-outline-primary btn-sm"
            >
              🖨️ Print Token / Slip
            </button>
            <Link to="/patient/appointments" className="btn btn-primary btn-sm">
              View in My Appointments
            </Link>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Please present this confirmation token at the reception counter 15 minutes prior to appointment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Step Indicator Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--teal)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Consultation Scheduling Flow
          </span>
          <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-dark)', margin: '0.25rem 0' }}>
            Book a Doctor Consultation
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Select your preferred hospital, specialist, validated working date, and open time slot.
          </p>

          {/* Stepper Dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            {[
              { num: 1, label: '1. Select Hospital' },
              { num: 2, label: '2. Select Specialist' },
              { num: 3, label: '3. Date & Time' },
              { num: 4, label: '4. Patient Info' }
            ].map(step => (
              <div
                key={step.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.86rem',
                  fontWeight: '700',
                  color: currentStep === step.num ? 'var(--primary)' : currentStep > step.num ? 'var(--success)' : 'var(--text-muted)'
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: currentStep === step.num ? 'var(--primary)' : currentStep > step.num ? 'var(--success)' : '#e2e8f0',
                    color: currentStep >= step.num ? '#ffffff' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.76rem'
                  }}
                >
                  {currentStep > step.num ? <Check size={14} /> : step.num}
                </div>
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 1: SELECT HOSPITAL */}
        {currentStep === 1 && (
          <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
              Step 1: Choose Hospital Facility
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {allHospitals.map(h => {
                const isSelected = selectedHospitalId === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      setSelectedHospitalId(h.id);
                      setSelectedDoctorId('');
                      setSelectedDepartment('');
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--teal)', fontWeight: '700', textTransform: 'uppercase' }}>{h.city}</span>
                      {isSelected && <Check size={16} color="var(--primary)" />}
                    </div>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--primary-dark)' }}>{h.name}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.address}</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                disabled={!selectedHospitalId}
                onClick={() => setCurrentStep(2)}
                className="btn btn-primary"
              >
                <span>Continue to Select Specialist</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT SPECIALIST / DOCTOR */}
        {currentStep === 2 && (
          <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', margin: 0 }}>
                Step 2: Choose Department & Doctor
              </h3>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                Hospital: <strong style={{ color: 'var(--primary-dark)' }}>{selectedHospital?.name}</strong>
              </div>
            </div>

            {/* Department Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedDepartment('')}
                className={`btn btn-sm ${!selectedDepartment ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                All Departments
              </button>
              {hospitalDepartments.map((dept, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDepartment(dept)}
                  className={`btn btn-sm ${selectedDepartment === dept ? 'btn-primary' : 'btn-outline-secondary'}`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Doctor Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {filteredDoctors.map(doc => {
                const isSelected = selectedDoctorId === doc.id;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDoctorId(doc.id)}
                    style={{
                      textAlign: 'left',
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '0.75rem',
                      alignItems: 'flex-start'
                    }}
                  >
                    <img
                      src={doc.image}
                      alt={doc.name}
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ fontSize: '0.98rem', color: 'var(--primary-dark)', display: 'block' }}>{doc.name}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--teal)', fontWeight: '600', display: 'block' }}>{doc.specialization}</span>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>{doc.experience} exp • {formatCurrency(doc.fee)}</span>
                      <div style={{ fontSize: '0.72rem', color: 'var(--primary)', marginTop: '0.3rem', fontWeight: '500' }}>
                        Days: {(doc.availableDays || []).join(', ')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button type="button" onClick={() => setCurrentStep(1)} className="btn btn-outline-secondary">
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={!selectedDoctorId}
                onClick={() => setCurrentStep(3)}
                className="btn btn-primary"
              >
                <span>Continue to Date & Time</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DATE & TIME SLOT SELECTION */}
        {currentStep === 3 && (
          <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
              Step 3: Select Working Date & Available Slot
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Consulting: <strong style={{ color: 'var(--primary-dark)' }}>{selectedDoctor?.name}</strong> ({selectedDoctor?.specialization}) at <strong>{selectedHospital?.name}</strong>.
            </p>

            {/* Date Input */}
            <div className="form-group" style={{ maxWidth: '360px', marginBottom: '1.75rem' }}>
              <label className="form-label form-label-req">Consultation Date</label>
              <input
                type="date"
                className="form-control"
                min={minDateString}
                max={maxDateString}
                value={selectedDate}
                onChange={handleDateChange}
              />
              <div className="form-hint">
                Doctor available days: <strong>{(selectedDoctor?.availableDays || []).join(', ')}</strong>
              </div>
            </div>

            {/* Available Time Slots */}
            {selectedDate && (
              <div>
                <label className="form-label form-label-req">Available Time Slots for {selectedDate}</label>
                
                {slotOptions.length === 0 || !isDoctorWorkingOnDate(selectedDoctor, selectedDate) ? (
                  <div style={{ padding: '1rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
                    <AlertCircle size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
                    {selectedDoctor?.name} does not have clinical shifts scheduled on this date ({DAY_NAMES[new Date(selectedDate).getDay()]}). Please pick a scheduled day.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.65rem', marginBottom: '2rem' }}>
                    {slotOptions.map((slot, i) => {
                      const isBooked = slot.status === 'booked';
                      const isSelected = selectedTimeSlot === slot.time;
                      return (
                        <button
                          key={i}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setSelectedTimeSlot(slot.time)}
                          style={{
                            padding: '0.65rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            border: `1.5px solid ${isSelected ? 'var(--primary)' : isBooked ? '#e2e8f0' : 'var(--border)'}`,
                            backgroundColor: isSelected ? 'var(--primary)' : isBooked ? '#f8fafc' : '#ffffff',
                            color: isSelected ? '#ffffff' : isBooked ? '#a0aec0' : 'var(--text-dark)',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            textAlign: 'center'
                          }}
                          title={slot.reason}
                        >
                          <div>{slot.time}</div>
                          <div style={{ fontSize: '0.68rem', opacity: 0.85 }}>
                            {isBooked ? 'Reserved' : 'Available'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
              <button type="button" onClick={() => setCurrentStep(2)} className="btn btn-outline-secondary">
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
              <button
                type="button"
                disabled={!selectedDate || !selectedTimeSlot || !isDoctorWorkingOnDate(selectedDoctor, selectedDate)}
                onClick={() => setCurrentStep(4)}
                className="btn btn-primary"
              >
                <span>Continue to Patient Details</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PATIENT DETAILS & CONFIRMATION */}
        {currentStep === 4 && (
          <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>
              Step 4: Patient Details & Booking Confirmation
            </h3>

            {/* Booking Summary Box */}
            <div
              style={{
                backgroundColor: 'var(--primary-light)',
                border: '1px solid #c8e2f0',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginBottom: '1.75rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                fontSize: '0.88rem'
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.76rem' }}>Hospital</span>
                <strong>{selectedHospital?.name}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.76rem' }}>Doctor</span>
                <strong>{selectedDoctor?.name}</strong> ({selectedDoctor?.specialization})
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.76rem' }}>Date & Slot</span>
                <strong>{selectedDate} at {selectedTimeSlot}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.76rem' }}>Consultation Fee</span>
                <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>{formatCurrency(selectedDoctor?.fee)}</strong>
              </div>
            </div>

            {/* Formik Form for Patient Info */}
            <Formik
              initialValues={{
                patientName: user?.name || '',
                age: user?.age || '',
                gender: user?.gender || 'Male',
                contact: user?.phone || '',
                email: user?.email || '',
                reason: ''
              }}
              validationSchema={validationSchema}
              onSubmit={handleFinalSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    
                    <div className="form-group">
                      <label className="form-label form-label-req">Patient Full Name</label>
                      <Field name="patientName" className="form-control" placeholder="e.g. Rahul Sharma" />
                      <ErrorMessage name="patientName" component="div" className="form-error" />
                    </div>

                    <div className="form-group">
                      <label className="form-label form-label-req">Age</label>
                      <Field name="age" type="number" className="form-control" placeholder="e.g. 34" />
                      <ErrorMessage name="age" component="div" className="form-error" />
                    </div>

                    <div className="form-group">
                      <label className="form-label form-label-req">Gender</label>
                      <Field as="select" name="gender" className="form-select">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Field>
                      <ErrorMessage name="gender" component="div" className="form-error" />
                    </div>

                    <div className="form-group">
                      <label className="form-label form-label-req">Contact Phone Number</label>
                      <Field name="contact" className="form-control" placeholder="+91 98765 43210" />
                      <ErrorMessage name="contact" component="div" className="form-error" />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label form-label-req">Email Address (for confirmation ticket)</label>
                      <Field name="email" type="email" className="form-control" placeholder="patient@example.com" />
                      <ErrorMessage name="email" component="div" className="form-error" />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label form-label-req">Reason for Consultation / Symptoms</label>
                      <Field as="textarea" name="reason" rows="3" className="form-control" placeholder="Briefly describe your symptoms or routine follow-up reason..." />
                      <ErrorMessage name="reason" component="div" className="form-error" />
                    </div>

                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                    <button type="button" onClick={() => setCurrentStep(3)} className="btn btn-outline-secondary">
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary">
                      <CheckCircle2 size={16} />
                      <span>{isSubmitting ? "Confirming..." : "Confirm & Save Appointment"}</span>
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookAppointment;
