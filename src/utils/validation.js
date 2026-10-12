import * as Yup from 'yup';

// Doctor Validation Schema
export const doctorValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Doctor name must be at least 3 characters')
    .required('Doctor name is required'),
  specialization: Yup.string()
    .min(3, 'Specialization must be at least 3 characters')
    .required('Specialization is required'),
  department: Yup.string()
    .required('Department selection is required'),
  qualification: Yup.string()
    .required('Qualifications are required (e.g., MBBS, MD)'),
  experience: Yup.string()
    .required('Experience is required (e.g., 10+ Years)'),
  fee: Yup.number()
    .typeError('Fee must be a valid number')
    .positive('Fee must be greater than 0')
    .required('Consultation fee is required'),
  contact: Yup.string()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Enter a valid contact number')
    .required('Contact number is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email address is required'),
  availableTime: Yup.string()
    .required('Available timing is required'),
  roomNumber: Yup.string()
    .required('Room / Wing allocation is required')
});

// Department Validation Schema
export const departmentValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Department name must be at least 3 characters')
    .required('Department name is required'),
  description: Yup.string()
    .min(15, 'Description should be at least 15 characters')
    .required('Description is required'),
  headDoctor: Yup.string()
    .required('Head doctor is required'),
  location: Yup.string()
    .required('Location / Wing is required'),
  status: Yup.string()
    .oneOf(['Active', 'Inactive'])
    .required('Status is required')
});

// Patient Validation Schema
export const patientValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Patient name is required'),
  age: Yup.number()
    .typeError('Age must be a valid number')
    .positive('Age must be greater than 0')
    .max(120, 'Age cannot exceed 120')
    .required('Age is required'),
  gender: Yup.string()
    .oneOf(['Male', 'Female', 'Other'], 'Please select a gender')
    .required('Gender is required'),
  contact: Yup.string()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Enter a valid phone number')
    .required('Contact number is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email address is required'),
  address: Yup.string()
    .min(5, 'Address is too short')
    .required('Address is required')
});

// Appointment Booking Validation Schema
export const appointmentBookingSchema = Yup.object().shape({
  doctorId: Yup.string().required('Please select a doctor'),
  date: Yup.string().required('Please select an appointment date'),
  time: Yup.string().required('Please choose a time slot'),
  patientName: Yup.string()
    .min(2, 'Patient name must be at least 2 characters')
    .required('Patient name is required'),
  age: Yup.number()
    .typeError('Age must be a number')
    .min(1, 'Age must be at least 1')
    .max(120, 'Age cannot exceed 120')
    .required('Age is required'),
  gender: Yup.string().required('Please select gender'),
  patientContact: Yup.string()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Valid phone number required')
    .required('Contact number is required'),
  patientEmail: Yup.string()
    .email('Valid email address required')
    .required('Email is required'),
  reason: Yup.string()
    .min(5, 'Please provide a brief reason for the visit (min 5 characters)')
    .required('Reason for visit is required')
});

// Service Validation Schema
export const serviceValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, 'Service name must be at least 3 characters')
    .required('Service name is required'),
  category: Yup.string().required('Category is required'),
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  price: Yup.number()
    .typeError('Price must be a number')
    .positive('Price must be positive')
    .required('Price is required'),
  duration: Yup.string().required('Turnaround time / duration is required'),
  status: Yup.string().required('Status is required')
});

// Bill Validation Schema
export const billValidationSchema = Yup.object().shape({
  patientName: Yup.string().required('Patient name is required'),
  doctorName: Yup.string().required('Doctor name is required'),
  department: Yup.string().required('Department is required'),
  consultationFee: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Fee cannot be negative')
    .required('Consultation fee is required'),
  testCharges: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Test charges cannot be negative')
    .required('Test charges required'),
  otherCharges: Yup.number()
    .typeError('Must be a number')
    .min(0, 'Other charges cannot be negative')
    .default(0),
  paymentStatus: Yup.string().oneOf(['Paid', 'Pending']).required('Payment status is required')
});

// Contact Form Schema
export const contactFormSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Name must be at least 2 characters').required('Full Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  phone: Yup.string().matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/, 'Enter a valid phone number').required('Phone is required'),
  subject: Yup.string().min(4, 'Subject must be at least 4 characters').required('Subject is required'),
  message: Yup.string().min(10, 'Message must be at least 10 characters').required('Message is required')
});

// Login Schema
export const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(5, 'Password must be at least 5 characters').required('Password is required'),
  rememberMe: Yup.boolean()
});
