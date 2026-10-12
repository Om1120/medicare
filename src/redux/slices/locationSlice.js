import { createSlice } from '@reduxjs/toolkit';

const locationSlice = createSlice({
  name: 'location',
  initialState: {
    userCoords: {
      latitude: 23.0225,
      longitude: 72.5714,
      city: "Ahmedabad",
      region: "Gujarat",
      state: "Gujarat",
      accuracy: 100,
      source: "Ahmedabad (Default)"
    },
    locationName: 'Ahmedabad',
    radiusKm: null, // null = show all hospitals; set to number when user applies radius filter
    permissionState: 'idle', // 'idle' | 'prompted' | 'granted' | 'denied'
    loading: false,
    error: null
  },
  reducers: {
    setUserCoords: (state, action) => {
      state.userCoords = action.payload;
      state.permissionState = 'granted';
      state.loading = false;
      state.error = null;
    },
    setLocationName: (state, action) => {
      state.locationName = action.payload;
    },
    setRadiusKm: (state, action) => {
      state.radiusKm = Number(action.payload);
    },
    setLocationLoading: (state, action) => {
      state.loading = action.payload;
    },
    setLocationError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      if (action.payload && action.payload.includes('denied')) {
        state.permissionState = 'denied';
      }
    },
    clearUserLocation: (state) => {
      state.userCoords = null;
      state.locationName = '';
      state.permissionState = 'idle';
      state.error = null;
    }
  }
});

export const {
  setUserCoords,
  setLocationName,
  setRadiusKm,
  setLocationLoading,
  setLocationError,
  clearUserLocation
} = locationSlice.actions;

export default locationSlice.reducer;
