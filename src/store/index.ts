import { configureStore } from '@reduxjs/toolkit';
import notificationsReducer from './slices/notifications';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // Desabilitando temporariamente para lidar com possíveis objetos não serializáveis
    })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks tipados para usar em vez de useDispatch e useSelector
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
