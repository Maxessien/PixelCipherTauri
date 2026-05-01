import { configureStore } from '@reduxjs/toolkit';
import appSliceReducer from './slices/appSlice';
import imagesReducer from './slices/imagesSlice';

export const store = configureStore({
  reducer: {
    app: appSliceReducer,
    images: imagesReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
