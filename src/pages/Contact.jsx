import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  PhoneCall, 
  Building2, 
  Navigation
} from 'lucide-react';
import { contactService } from '../services/contactService';
import toast from 'react-hot-toast';

const contactFormSchema = Yup.object({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: Yup.string().email('Please enter a valid email').required('Email is required'),
  phone: Yup.string().matches(/^[0-9+\s-]{8,15}$/, 'Please enter a valid phone number').required('Phone number is required'),
  subject: Yup.string().min(3, 'Subject is required').required('Subject is required'),
  message: Yup.string().min(10, 'Message must be at least 10 characters').required('Message is required')
});

const Contact = () => {
  const [submittedRef, setSubmittedRef] = useState(null);

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  const handleContactSubmit = async (values, { resetForm, setSubmitting }) => {
    setSubmitting(true);
    try {
      const response = await contactService.submitInquiry(values);
      setSubmittedRef(response.referenceId);
      setSubmitting(false);
      resetForm();
      toast.success('Inquiry submitted successfully. A representative will contact you.');
    } catch (err) {
      setSubmitting(false);
      toast.error('Unable to send inquiry. Please try again.');
    }
  };

  return (
    <div className="contact-page" style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <span className="section-subtitle">Get in Touch</span>
          <h1 className="section-title">Contact MediCare Health Network</h1>
          <p className="section-description">
            We are here to answer inquiries, guide hospital discovery, and provide 24/7 emergency dispatch support.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'flex-start', marginBottom: '4rem' }}>
          
          {/* Left Column: Contact Information Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--primary)', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>Central Network Office</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
                    MediCare Healthcare Complex, SG Highway, Thaltej, Ahmedabad 380054, Gujarat
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--danger)', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PhoneCall size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>24/7 Emergency Dispatch</h3>
                  <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', margin: 0, fontWeight: '700' }}>
                    Emergency Helpline: 108 / 102
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                    Trauma Desk Hotline: +91 22 4589 1099
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid var(--teal)', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--teal-light)', color: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Mail size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>Email Inquiries</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    General: contact@medicare.health
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    Support: helpdesk@medicare.health
                  </p>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', borderLeft: '4px solid #F59E0B', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', backgroundColor: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>Service Hours</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    OPD Directory & Helpdesk: 08:00 AM – 08:00 PM (Monday to Saturday)
                  </p>
                  <p style={{ color: 'var(--success)', fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>
                    Emergency Casualty Care: 24 Hours / 365 Days
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-md)', backgroundColor: '#ffffff' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
              Send an Inquiry or Feedback
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Have a question about hospital departments, doctor scheduling, or health packages? Fill out the form below.
            </p>

            {submittedRef && (
              <div style={{ backgroundColor: 'var(--success-bg)', border: '1px solid rgba(34,160,107,0.3)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem' }}>
                <CheckCircle2 size={20} />
                <span>Your message has been submitted. Reference ID: <strong>{submittedRef}</strong></span>
              </div>
            )}

            <Formik
              initialValues={initialValues}
              validationSchema={contactFormSchema}
              onSubmit={handleContactSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label form-label-req">Your Full Name</label>
                      <Field name="name" className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`} placeholder="e.g. Rahul Sharma" />
                      <ErrorMessage name="name" component="div" className="form-error" />
                    </div>

                    <div className="form-group">
                      <label className="form-label form-label-req">Email Address</label>
                      <Field name="email" type="email" className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`} placeholder="name@example.com" />
                      <ErrorMessage name="email" component="div" className="form-error" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label form-label-req">Phone Number</label>
                      <Field name="phone" className={`form-control ${touched.phone && errors.phone ? 'is-invalid' : ''}`} placeholder="+91 98765 43210" />
                      <ErrorMessage name="phone" component="div" className="form-error" />
                    </div>

                    <div className="form-group">
                      <label className="form-label form-label-req">Subject / Category</label>
                      <Field as="select" name="subject" className={`form-select ${touched.subject && errors.subject ? 'is-invalid' : ''}`}>
                        <option value="">Select an inquiry topic</option>
                        <option value="Hospital Facilities Inquiry">Hospital Facilities Inquiry</option>
                        <option value="Doctor Availability / Appointment">Doctor Availability / Appointment</option>
                        <option value="Diagnostic Test Pricing">Diagnostic Test Pricing</option>
                        <option value="Cashless Insurance TPA Help">Cashless Insurance TPA Help</option>
                        <option value="General Feedback">General Feedback</option>
                      </Field>
                      <ErrorMessage name="subject" component="div" className="form-error" />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.75rem' }}>
                    <label className="form-label form-label-req">Your Message</label>
                    <Field as="textarea" name="message" rows="5" className={`form-control ${touched.message && errors.message ? 'is-invalid' : ''}`} placeholder="Please provide specific details regarding your inquiry..." />
                    <ErrorMessage name="message" component="div" className="form-error" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.85rem' }}
                  >
                    <Send size={16} />
                    <span>{isSubmitting ? 'Sending Inquiry...' : 'Submit Message'}</span>
                  </button>

                </Form>
              )}
            </Formik>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Contact;
