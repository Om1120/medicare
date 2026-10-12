import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../../utils/localStorage';
import defaultDepartments from '../../data/departments.json';

const stored = getStoredData(STORAGE_KEYS.DEPARTMENTS, defaultDepartments);

const initialState = {
  items: stored,
  departments: stored,
  selectedDepartment: null,
  loading: false,
  error: null
};

const departmentSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    setDepartments: (state, action) => {
      state.departments = action.payload;
      state.items = action.payload;
      setStoredData(STORAGE_KEYS.DEPARTMENTS, action.payload);
    },
    addDepartment: (state, action) => {
      state.departments.unshift(action.payload);
      state.items = state.departments;
      setStoredData(STORAGE_KEYS.DEPARTMENTS, state.departments);
    },
    updateDepartment: (state, action) => {
      const index = state.departments.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.departments[index] = action.payload;
        state.items = state.departments;
        setStoredData(STORAGE_KEYS.DEPARTMENTS, state.departments);
      }
    },
    deleteDepartment: (state, action) => {
      state.departments = state.departments.filter(d => d.id !== action.payload);
      state.items = state.departments;
      setStoredData(STORAGE_KEYS.DEPARTMENTS, state.departments);
    },
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    }
  }
});

export const { setDepartments, addDepartment, updateDepartment, deleteDepartment, setSelectedDepartment } = departmentSlice.actions;
export default departmentSlice.reducer;
