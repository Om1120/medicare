import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../../utils/localStorage';
import defaultPatients from '../../data/patients.json';

const initialState = {
  patients: getStoredData(STORAGE_KEYS.PATIENTS, defaultPatients),
  selectedPatient: null,
  loading: false,
  error: null
};

const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    setPatients: (state, action) => {
      state.patients = action.payload;
      setStoredData(STORAGE_KEYS.PATIENTS, action.payload);
    },
    addPatient: (state, action) => {
      state.patients.unshift(action.payload);
      setStoredData(STORAGE_KEYS.PATIENTS, state.patients);
    },
    updatePatient: (state, action) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
        setStoredData(STORAGE_KEYS.PATIENTS, state.patients);
      }
    },
    deletePatient: (state, action) => {
      state.patients = state.patients.filter(p => p.id !== action.payload);
      setStoredData(STORAGE_KEYS.PATIENTS, state.patients);
    },
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
    }
  }
});

export const { setPatients, addPatient, updatePatient, deletePatient, setSelectedPatient } = patientSlice.actions;
export default patientSlice.reducer;
