import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import hospitalReducer from './slices/hospitalSlice';
import doctorReducer from './slices/doctorSlice';
import departmentReducer from './slices/departmentSlice';
import facilityReducer from './slices/facilitySlice';
import patientReducer from './slices/patientSlice';
import appointmentReducer from './slices/appointmentSlice';
import serviceReducer from './slices/serviceSlice';
import billReducer from './slices/billSlice';
import paymentReducer from './slices/paymentSlice';
import comparisonReducer from './slices/comparisonSlice';
import locationReducer from './slices/locationSlice';
import wardReducer from './slices/wardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hospitals: hospitalReducer,
    doctors: doctorReducer,
    departments: departmentReducer,
    facilities: facilityReducer,
    patients: patientReducer,
    appointments: appointmentReducer,
    services: serviceReducer,
    bills: billReducer,
    payments: paymentReducer,
    comparison: comparisonReducer,
    location: locationReducer,
    wards: wardReducer
  }
});

export default store;
