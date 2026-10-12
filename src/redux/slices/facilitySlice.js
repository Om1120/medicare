import { createSlice } from '@reduxjs/toolkit';
import { getStoredData, setStoredData, STORAGE_KEYS } from '../../utils/localStorage';
import defaultFacilities from '../../data/facilities.json';

const initialFacilities = getStoredData(STORAGE_KEYS.FACILITIES, defaultFacilities);

const facilitySlice = createSlice({
  name: 'facilities',
  initialState: {
    items: initialFacilities,
    facilities: initialFacilities,
    selectedCategory: '',
    searchQuery: '',
    loading: false,
    error: null
  },
  reducers: {
    setFacilityCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setFacilitySearch: (state, action) => {
      state.searchQuery = action.payload;
    },
    addFacility: (state, action) => {
      const newFacility = {
        ...action.payload,
        id: action.payload.id || `fac-${Date.now()}`
      };
      state.items.unshift(newFacility);
      state.facilities = state.items;
      setStoredData(STORAGE_KEYS.FACILITIES, state.items);
    },
    updateFacility: (state, action) => {
      const index = state.items.findIndex(f => f.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
        state.facilities = state.items;
        setStoredData(STORAGE_KEYS.FACILITIES, state.items);
      }
    },
    deleteFacility: (state, action) => {
      state.items = state.items.filter(f => f.id !== action.payload);
      state.facilities = state.items;
      setStoredData(STORAGE_KEYS.FACILITIES, state.items);
    }
  }
});

export const {
  setFacilityCategory,
  setFacilitySearch,
  addFacility,
  updateFacility,
  deleteFacility
} = facilitySlice.actions;

export default facilitySlice.reducer;
