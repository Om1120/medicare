import defaultHospitals from '../data/hospitals.json';
import defaultDoctors from '../data/doctors.json';
import defaultDepartments from '../data/departments.json';
import defaultPatients from '../data/patients.json';
import defaultAppointments from '../data/appointments.json';
import defaultServices from '../data/services.json';
import defaultFacilities from '../data/facilities.json';
import defaultBills from '../data/bills.json';
import defaultPayments from '../data/payments.json';
import defaultWards from '../data/wards.json';

export const STORAGE_KEYS = {
  HOSPITALS: 'hospital_hospitals',
  DOCTORS: 'hospital_doctors',
  DEPARTMENTS: 'hospital_departments',
  PATIENTS: 'hospital_patients',
  APPOINTMENTS: 'hospital_appointments',
  SERVICES: 'hospital_services',
  FACILITIES: 'hospital_facilities',
  BILLS: 'hospital_bills',
  PAYMENTS: 'hospital_payments',
  WARDS: 'hospital_wards',
  USER: 'hospital_user',
  SAVED_HOSPITALS: 'hospital_saved_hospitals',
  SAVED_DOCTORS: 'hospital_saved_doctors',
  COMPARISON_HOSPITALS: 'hospital_comparison_hospitals',
  COMPARISON_DOCTORS: 'hospital_comparison_doctors'
};

// Seed LocalStorage with initial verified datasets if empty
export const initializeLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.WARDS)) {
    localStorage.setItem(STORAGE_KEYS.WARDS, JSON.stringify(defaultWards));
  }
  if (!localStorage.getItem(STORAGE_KEYS.HOSPITALS)) {
    localStorage.setItem(STORAGE_KEYS.HOSPITALS, JSON.stringify(defaultHospitals));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DOCTORS)) {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(defaultDoctors));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DEPARTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(defaultDepartments));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(defaultPatients));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(defaultAppointments));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(defaultServices));
  }
  if (!localStorage.getItem(STORAGE_KEYS.FACILITIES)) {
    localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(defaultFacilities));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BILLS)) {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(defaultBills));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(defaultPayments));
  }
};

// Generic read
export const getStoredData = (key, fallback = []) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    const parsed = JSON.parse(item);
    
    // Auto-migrate: If cached hospitals contain stale Mumbai data, reset to latest Gujarat/Ahmedabad dataset
    if (key === STORAGE_KEYS.HOSPITALS && Array.isArray(parsed)) {
      const hasOldMumbai = parsed.some(h => 
        (h.city || '').toLowerCase() === 'mumbai' || 
        (h.state || '').toLowerCase() === 'maharashtra' ||
        h.id === 'hosp-1'
      );
      if (hasOldMumbai || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEYS.HOSPITALS, JSON.stringify(fallback));
        return fallback;
      }
    }
    return parsed;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return fallback;
  }
};

// Generic save
export const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};

// Reset to factory repository records
export const resetToFactoryDemoData = () => {
  localStorage.setItem(STORAGE_KEYS.HOSPITALS, JSON.stringify(defaultHospitals));
  localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(defaultDoctors));
  localStorage.setItem(STORAGE_KEYS.DEPARTMENTS, JSON.stringify(defaultDepartments));
  localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(defaultPatients));
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(defaultAppointments));
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(defaultServices));
  localStorage.setItem(STORAGE_KEYS.FACILITIES, JSON.stringify(defaultFacilities));
  localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(defaultBills));
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(defaultPayments));
};
