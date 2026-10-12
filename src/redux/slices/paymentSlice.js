import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS, getStoredData, setStoredData } from '../../utils/localStorage';
import defaultPayments from '../../data/payments.json';

const initialState = {
  payments: getStoredData(STORAGE_KEYS.PAYMENTS, defaultPayments),
  lastPaymentResult: null,
  loading: false,
  error: null
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    setPayments: (state, action) => {
      state.payments = action.payload;
      setStoredData(STORAGE_KEYS.PAYMENTS, action.payload);
    },
    addPayment: (state, action) => {
      state.payments.unshift(action.payload);
      state.lastPaymentResult = action.payload;
      setStoredData(STORAGE_KEYS.PAYMENTS, state.payments);
    },
    clearLastPaymentResult: (state) => {
      state.lastPaymentResult = null;
    }
  }
});

export const { setPayments, addPayment, clearLastPaymentResult } = paymentSlice.actions;
export default paymentSlice.reducer;
