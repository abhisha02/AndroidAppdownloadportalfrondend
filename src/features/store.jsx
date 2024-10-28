import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authenticationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});