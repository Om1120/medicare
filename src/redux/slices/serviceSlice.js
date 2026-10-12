import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../../utils/localStorage';
import defaultServices from '../../data/services.json';

const stored = getStoredData(STORAGE_KEYS.SERVICES, defaultServices);

const initialState = {
  items: stored,
  services: stored,
  loading: false,
  error: null
};

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices: (state, action) => {
      state.services = action.payload;
      state.items = action.payload;
      setStoredData(STORAGE_KEYS.SERVICES, action.payload);
    },
    addService: (state, action) => {
      state.services.unshift(action.payload);
      state.items = state.services;
      setStoredData(STORAGE_KEYS.SERVICES, state.services);
    },
    updateService: (state, action) => {
      const index = state.services.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = action.payload;
        state.items = state.services;
        setStoredData(STORAGE_KEYS.SERVICES, state.services);
      }
    },
    deleteService: (state, action) => {
      state.services = state.services.filter(s => s.id !== action.payload);
      state.items = state.services;
      setStoredData(STORAGE_KEYS.SERVICES, state.services);
    }
  }
});

export const { setServices, addService, updateService, deleteService } = serviceSlice.actions;
export default serviceSlice.reducer;
