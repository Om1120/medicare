import { createSlice } from '@reduxjs/toolkit';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../../utils/localStorage';
import { DEFAULT_PRIORITIES } from '../../services/comparisonService';

const initialHospCompare = getStoredData(STORAGE_KEYS.COMPARISON_HOSPITALS, []);
const initialDocCompare = getStoredData(STORAGE_KEYS.COMPARISON_DOCTORS, []);

const comparisonSlice = createSlice({
  name: 'comparison',
  initialState: {
    hospitalIds: Array.isArray(initialHospCompare) ? initialHospCompare : [],
    doctorIds: Array.isArray(initialDocCompare) ? initialDocCompare : [],
    priorities: DEFAULT_PRIORITIES,
    activeTab: 'hospitals' // 'hospitals' | 'doctors'
  },
  reducers: {
    addHospitalToCompare: (state, action) => {
      const id = action.payload;
      if (!state.hospitalIds.includes(id) && state.hospitalIds.length < 4) {
        state.hospitalIds.push(id);
        setStoredData(STORAGE_KEYS.COMPARISON_HOSPITALS, state.hospitalIds);
      }
    },
    removeHospitalFromCompare: (state, action) => {
      state.hospitalIds = state.hospitalIds.filter(id => id !== action.payload);
      setStoredData(STORAGE_KEYS.COMPARISON_HOSPITALS, state.hospitalIds);
    },
    clearHospitalComparison: (state) => {
      state.hospitalIds = [];
      setStoredData(STORAGE_KEYS.COMPARISON_HOSPITALS, []);
    },
    addDoctorToCompare: (state, action) => {
      const id = action.payload;
      if (!state.doctorIds.includes(id) && state.doctorIds.length < 4) {
        state.doctorIds.push(id);
        setStoredData(STORAGE_KEYS.COMPARISON_DOCTORS, state.doctorIds);
      }
    },
    removeDoctorFromCompare: (state, action) => {
      state.doctorIds = state.doctorIds.filter(id => id !== action.payload);
      setStoredData(STORAGE_KEYS.COMPARISON_DOCTORS, state.doctorIds);
    },
    clearDoctorComparison: (state) => {
      state.doctorIds = [];
      setStoredData(STORAGE_KEYS.COMPARISON_DOCTORS, []);
    },
    setPriorities: (state, action) => {
      state.priorities = { ...state.priorities, ...action.payload };
    },
    resetPriorities: (state) => {
      state.priorities = DEFAULT_PRIORITIES;
    },
    setActiveComparisonTab: (state, action) => {
      state.activeTab = action.payload;
    }
  }
});

export const {
  addHospitalToCompare,
  removeHospitalFromCompare,
  clearHospitalComparison,
  addDoctorToCompare,
  removeDoctorFromCompare,
  clearDoctorComparison,
  setPriorities,
  resetPriorities,
  setActiveComparisonTab
} = comparisonSlice.actions;

export default comparisonSlice.reducer;
