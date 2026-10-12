import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../../utils/localStorage';
import defaultDoctors from '../../data/doctors.json';

const storedDoctors = getStoredData(STORAGE_KEYS.DOCTORS, defaultDoctors);

const initialState = {
  items: storedDoctors,
  doctors: storedDoctors, // compatibility alias
  selectedDoctor: null,
  loading: false,
  error: null
};

const doctorSlice = createSlice({
  name: 'doctors',
  initialState,
  reducers: {
    setDoctors: (state, action) => {
      state.items = action.payload;
      state.doctors = action.payload;
      setStoredData(STORAGE_KEYS.DOCTORS, action.payload);
    },
    addDoctor: (state, action) => {
      const newDoc = {
        ...action.payload,
        id: action.payload.id || `doc-${Date.now()}`
      };
      state.items.unshift(newDoc);
      state.doctors.unshift(newDoc);
      setStoredData(STORAGE_KEYS.DOCTORS, state.items);
    },
    updateDoctor: (state, action) => {
      const index = state.items.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        state.doctors[index] = action.payload;
        setStoredData(STORAGE_KEYS.DOCTORS, state.items);
      }
    },
    deleteDoctor: (state, action) => {
      state.items = state.items.filter(d => d.id !== action.payload);
      state.doctors = state.doctors.filter(d => d.id !== action.payload);
      setStoredData(STORAGE_KEYS.DOCTORS, state.items);
    },
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    }
  }
});

export const { setDoctors, addDoctor, updateDoctor, deleteDoctor, setSelectedDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
