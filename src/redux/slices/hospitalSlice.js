import { createSlice } from '@reduxjs/toolkit';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../../utils/localStorage';
import defaultHospitals from '../../data/hospitals.json';

const initialHospitals = getStoredData(STORAGE_KEYS.HOSPITALS, defaultHospitals);

const hospitalSlice = createSlice({
  name: 'hospitals',
  initialState: {
    items: initialHospitals,
    hospitals: initialHospitals, // compatibility alias
    selectedHospital: null,
    searchQuery: '',
    selectedCity: '',
    selectedSpecialty: '',
    emergencyOnly: false,
    maxDistanceKm: null,
    sortBy: 'relevance', // 'distance' | 'rating' | 'fee_asc' | 'relevance'
    loading: false,
    error: null
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    setSelectedSpecialty: (state, action) => {
      state.selectedSpecialty = action.payload;
    },
    setEmergencyOnly: (state, action) => {
      state.emergencyOnly = action.payload;
    },
    setMaxDistanceKm: (state, action) => {
      state.maxDistanceKm = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetHospitalFilters: (state) => {
      state.searchQuery = '';
      state.selectedCity = '';
      state.selectedSpecialty = '';
      state.emergencyOnly = false;
      state.maxDistanceKm = null;
      state.sortBy = 'relevance';
    },
    setSelectedHospital: (state, action) => {
      state.selectedHospital = action.payload;
    },
    addHospital: (state, action) => {
      const newHospital = {
        ...action.payload,
        id: action.payload.id || `hosp-${Date.now()}`,
        lastUpdated: new Date().toISOString().slice(0, 10),
        verified: true
      };
      state.items.unshift(newHospital);
      state.hospitals = state.items;
      setStoredData(STORAGE_KEYS.HOSPITALS, state.items);
    },
    updateHospital: (state, action) => {
      const index = state.items.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload,
          lastUpdated: new Date().toISOString().slice(0, 10)
        };
        state.hospitals = state.items;
        setStoredData(STORAGE_KEYS.HOSPITALS, state.items);
      }
    },
    deleteHospital: (state, action) => {
      state.items = state.items.filter(h => h.id !== action.payload);
      state.hospitals = state.items;
      setStoredData(STORAGE_KEYS.HOSPITALS, state.items);
    }
  }
});

export const {
  setSearchQuery,
  setSelectedCity,
  setSelectedSpecialty,
  setEmergencyOnly,
  setMaxDistanceKm,
  setSortBy,
  resetHospitalFilters,
  setSelectedHospital,
  addHospital,
  updateHospital,
  deleteHospital
} = hospitalSlice.actions;

export default hospitalSlice.reducer;
