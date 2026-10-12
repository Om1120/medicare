import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { User, Mail, Phone, MapPin, Heart, Shield, Save, CheckCircle2 } from 'lucide-react';
import PatientSidebar from '../../components/PatientSidebar';
import { updateUserProfile } from '../../redux/slices/authSlice';
import { updatePatient } from '../../redux/slices/patientSlice';
import { patientValidationSchema } from '../../utils/validation';
import toast from 'react-hot-toast';

const PatientProfile = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const initialValues = {
    name: user?.name || 'Rahul Sharma',
    age: user?.age || 34,
    gender: user?.gender || 'Male',
    contact: user?.contact || '+91 98111 22334',
    email: user?.email || 'patient@medicare.health',
    bloodGroup: user?.bloodGroup || 'O+',
    address: user?.address || '42 Green Avenue, Flat 3B, Delhi',
    allergies: user?.allergies || 'Penicillin',
    medicalHistory: user?.medicalHistory || 'Mild hypertension, annual wellness checks'
  };

  const handleProfileSave = (values, { setSubmitting }) => {
    setSubmitting(true);
    setTimeout(() => {
      dispatch(updateUserProfile(values));
      if (user?.id) {
        dispatch(updatePatient({ id: user.id, ...values }));
      }
      setSubmitting(false);
      toast.success('Patient profile updated successfully!');
    }, 400);
  };

  return (
    <div className="patient-layout">
      <PatientSidebar />
      <main className="patient-main" aria-label="Patient Profile Area">
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
            Patient Profile Settings
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Manage your personal contact info, medical history notes, and emergency profile.
          </p>
        </div>

        <div className="card" style={{ padding: '2rem', maxWidth: '800px' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={patientValidationSchema}
            onSubmit={handleProfileSave}
            enableReinitialize
          >
            {({ touched, errors, isSubmitting }) => (
              <Form>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                  Personal Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label form-label-req">Full Name</label>
                    <Field
                      name="name"
                      className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="name" component="div" className="form-error" />
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-req">Email Address</label>
                    <Field
                      name="email"
                      type="email"
                      className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="email" component="div" className="form-error" />
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-req">Contact Phone</label>
                    <Field
                      name="contact"
                      className={`form-control ${touched.contact && errors.contact ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="contact" component="div" className="form-error" />
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-req">Age</label>
                    <Field
                      name="age"
                      type="number"
                      className={`form-control ${touched.age && errors.age ? 'is-invalid' : ''}`}
                    />
                    <ErrorMessage name="age" component="div" className="form-error" />
                  </div>

                  <div className="form-group">
                    <label className="form-label form-label-req">Gender</label>
                    <Field as="select" name="gender" className="form-select">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Field>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <Field as="select" name="bloodGroup" className="form-select">
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </Field>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                  <label className="form-label form-label-req">Residential Address</label>
                  <Field
                    name="address"
                    className={`form-control ${touched.address && errors.address ? 'is-invalid' : ''}`}
                  />
                  <ErrorMessage name="address" component="div" className="form-error" />
                </div>

                <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '1.25rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                  Clinical Background
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                  <div className="form-group">
                    <label className="form-label">Known Drug / Food Allergies</label>
                    <Field
                      name="allergies"
                      className="form-control"
                      placeholder="e.g. Penicillin, Peanuts"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Medical History Summary</label>
                    <Field
                      as="textarea"
                      name="medicalHistory"
                      rows="2"
                      className="form-textarea"
                      placeholder="e.g. Hypertension, Asthma"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    <Save size={16} />
                    <span>{isSubmitting ? 'Saving Profile...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

      </main>
    </div>
  );
};

export default PatientProfile;
