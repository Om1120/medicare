import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../../utils/localStorage';
import defaultWards from '../../data/wards.json';

const storedWards = getStoredData(STORAGE_KEYS.WARDS, defaultWards);

const initialState = {
  items: storedWards,
  selectedWard: null,
  loading: false,
  error: null
};

const wardSlice = createSlice({
  name: 'wards',
  initialState,
  reducers: {
    setWards: (state, action) => {
      state.items = action.payload;
      setStoredData(STORAGE_KEYS.WARDS, action.payload);
    },
    addWard: (state, action) => {
      const newWard = {
        ...action.payload,
        id: action.payload.id || `ward-${Date.now()}`,
        lastUpdated: new Date().toISOString().slice(0, 10),
        status: action.payload.status || 'Operational'
      };
      state.items.unshift(newWard);
      setStoredData(STORAGE_KEYS.WARDS, state.items);
    },
    updateWard: (state, action) => {
      const index = state.items.findIndex(w => w.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...action.payload,
          lastUpdated: new Date().toISOString().slice(0, 10)
        };
        setStoredData(STORAGE_KEYS.WARDS, state.items);
      }
    },
    deleteWard: (state, action) => {
      state.items = state.items.filter(w => w.id !== action.payload);
      setStoredData(STORAGE_KEYS.WARDS, state.items);
    },
    setSelectedWard: (state, action) => {
      state.selectedWard = action.payload;
    }
  }
});

export const { setWards, addWard, updateWard, deleteWard, setSelectedWard } = wardSlice.actions;
export default wardSlice.reducer;
