import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../../utils/localStorage';
import defaultBills from '../../data/bills.json';

const initialState = {
  bills: getStoredData(STORAGE_KEYS.BILLS, defaultBills),
  loading: false,
  error: null
};

const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    setBills: (state, action) => {
      state.bills = action.payload;
      setStoredData(STORAGE_KEYS.BILLS, action.payload);
    },
    addBill: (state, action) => {
      state.bills.unshift(action.payload);
      setStoredData(STORAGE_KEYS.BILLS, state.bills);
    },
    updateBill: (state, action) => {
      const index = state.bills.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
        setStoredData(STORAGE_KEYS.BILLS, state.bills);
      }
    },
    markBillAsPaid: (state, action) => {
      const billId = action.payload;
      const bill = state.bills.find(b => b.id === billId);
      if (bill) {
        bill.paymentStatus = 'Paid';
        setStoredData(STORAGE_KEYS.BILLS, state.bills);
      }
    },
    deleteBill: (state, action) => {
      state.bills = state.bills.filter(b => b.id !== action.payload);
      setStoredData(STORAGE_KEYS.BILLS, state.bills);
    }
  }
});

export const { setBills, addBill, updateBill, markBillAsPaid, deleteBill } = billSlice.actions;
export default billSlice.reducer;
