import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './slices/notifications';
import alertsReducer from './slices/alerts';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    alerts: alertsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // Temporarily disabled to handle possible non-serializable objects
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks to use instead of useDispatch and useSelector
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
