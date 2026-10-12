import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../../utils/localStorage';
import defaultAppointments from '../../data/appointments.json';

const initialState = {
  appointments: getStoredData(STORAGE_KEYS.APPOINTMENTS, defaultAppointments),
  lastBookedAppointment: null,
  loading: false,
  error: null
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.appointments = action.payload;
      setStoredData(STORAGE_KEYS.APPOINTMENTS, action.payload);
    },
    addAppointment: (state, action) => {
      state.appointments.unshift(action.payload);
      state.lastBookedAppointment = action.payload;
      setStoredData(STORAGE_KEYS.APPOINTMENTS, state.appointments);
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
        setStoredData(STORAGE_KEYS.APPOINTMENTS, state.appointments);
      }
    },
    updateAppointmentStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.appointments.findIndex(a => a.id === id);
      if (index !== -1) {
        state.appointments[index].status = status;
        setStoredData(STORAGE_KEYS.APPOINTMENTS, state.appointments);
      }
    },
    deleteAppointment: (state, action) => {
      state.appointments = state.appointments.filter(a => a.id !== action.payload);
      setStoredData(STORAGE_KEYS.APPOINTMENTS, state.appointments);
    },
    clearLastBookedAppointment: (state) => {
      state.lastBookedAppointment = null;
    }
  }
});

export const {
  setAppointments,
  addAppointment,
  updateAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  clearLastBookedAppointment
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
