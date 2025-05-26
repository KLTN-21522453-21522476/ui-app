// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import invoiceReducer from './slices/invoiceSlice';
import groupReducer from './slices/groupSlice';
import authReducer from './slices/authSlice';
import fileUploadReducer from './slices/fileUploadSlice';
import statisticsReducer from './slices/statisticsSlice';
import memberReducer from './slices/memberSlice';

export const store = configureStore({
  reducer: {
    invoices: invoiceReducer,
    groups: groupReducer,
    auth: authReducer,
    fileUpload: fileUploadReducer,
    statistics: statisticsReducer,
    member: memberReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
