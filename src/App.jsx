import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { setUserCoords } from './redux/slices/locationSlice';
import { getUserLocation } from './services/locationService';

// Public Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AIHealthAssistant from './components/AIHealthAssistant';
import AppSplashScreen from './components/AppSplashScreen';
import DoctorLoginModal from './components/DoctorLoginModal';
import toast from 'react-hot-toast';

// Public Pages
import Home from './pages/Home';
import Hospitals from './pages/Hospitals';
import HospitalDetails from './pages/HospitalDetails';
import Compare from './pages/Compare';
import Emergency from './pages/Emergency';
import Departments from './pages/Departments';
import Doctors from './pages/Doctors';
import DoctorDetails from './pages/DoctorDetails';
import Services from './pages/Services';
import Facilities from './pages/Facilities';
import HealthInformation from './pages/HealthInformation';
import About from './pages/About';
import Contact from './pages/Contact';
import BookAppointment from './pages/BookAppointment';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import HospitalLogin from './pages/hospital/HospitalLogin';
import HospitalPortal from './pages/hospital/HospitalPortal';

// Patient Portal Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientRecords from './pages/patient/PatientRecords';
import PatientBills from './pages/patient/PatientBills';
import PatientPayments from './pages/patient/PatientPayments';
import PatientProfile from './pages/patient/PatientProfile';
import PatientSaved from './pages/patient/PatientSaved';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHospitals from './pages/admin/AdminHospitals';
import AdminFacilities from './pages/admin/AdminFacilities';
import AdminDoctors from './pages/admin/AdminDoctors';
import AdminDepartments from './pages/admin/AdminDepartments';
import AdminPatients from './pages/admin/AdminPatients';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminServices from './pages/admin/AdminServices';
import AdminBills from './pages/admin/AdminBills';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSettings from './pages/admin/AdminSettings';

// Scroll to top on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout for Public Pages
const PublicLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

// Layout for Protected Portals
const PortalLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);

  useEffect(() => {
    // 1. Initial Logo splash screen
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 850);

    // 2. Real Location Auto-Detection via Browser GPS & Real IP API
    getUserLocation()
      .then((coords) => {
        if (coords && coords.latitude && coords.longitude) {
          dispatch(setUserCoords(coords));
        }
      })
      .catch((err) => console.info("Location detection initialized:", err));

    // 3. Keyboard Shortcuts:
    // - Alt + A: Quick Admin Login
    // - Ctrl + H: Quick Add Hospital in Admin Panel
    // - Ctrl + D: Hospital & Clinical Portal Sign In / Management
    const handleKeyDown = (e) => {
      // Alt + A: Admin Login
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        navigate('/login?admin=1');
      }

      // Ctrl + H: Add Hospital
      if ((e.ctrlKey || e.metaKey) && (e.key === 'h' || e.key === 'H')) {
        e.preventDefault();
        navigate('/admin/hospitals?add=1');
      }

      // Ctrl + D: Hospital / Clinical Portal
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        setDoctorModalOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, navigate]);

  if (isInitialLoading) {
    return <AppSplashScreen />;
  }

  return (
    <>
      <ScrollToTop />
      <DoctorLoginModal
        isOpen={doctorModalOpen}
        onClose={() => setDoctorModalOpen(false)}
      />
      <AIHealthAssistant />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: {
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            fontSize: '0.88rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)'
          }
        }}
      />

      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/hospitals" element={<Hospitals />} />
          <Route path="/hospitals/:id" element={<HospitalDetails />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/facilities" element={<Facilities />} />
          <Route path="/health-information" element={<HealthInformation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/hospital/login" element={<HospitalLogin />} />
          <Route path="/hospital/portal" element={<HospitalPortal />} />
        </Route>

        {/* Patient Portal Protected Routes */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={['patient', 'admin']}>
              <PortalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/patient/dashboard" replace />} />
          <Route path="dashboard" element={<PatientDashboard />} />
          <Route path="appointments" element={<PatientAppointments />} />
          <Route path="saved" element={<PatientSaved />} />
          <Route path="records" element={<PatientRecords />} />
          <Route path="bills" element={<PatientBills />} />
          <Route path="payments" element={<PatientPayments />} />
          <Route path="profile" element={<PatientProfile />} />
        </Route>

        {/* Admin Portal Protected Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PortalLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="hospitals" element={<AdminHospitals />} />
          <Route path="facilities" element={<AdminFacilities />} />
          <Route path="doctors" element={<AdminDoctors />} />
          <Route path="departments" element={<AdminDepartments />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="bills" element={<AdminBills />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
