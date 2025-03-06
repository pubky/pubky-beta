import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';
import { RootState } from '../index';

interface AlertMessage {
  id: number;
  content: ReactNode;
  variant: 'default' | 'warning';
}

interface AlertsState {
  alerts: AlertMessage[];
}

const initialState: AlertsState = {
  alerts: []
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state: AlertsState, action: PayloadAction<{ content: ReactNode; variant?: 'default' | 'warning' }>) => {
      const id = Date.now();
      state.alerts.push({
        id,
        content: action.payload.content,
        variant: action.payload.variant || 'default'
      });
    },
    removeAlert: (state: AlertsState, action: PayloadAction<number>) => {
      state.alerts = state.alerts.filter((alert) => alert.id !== action.payload);
    }
  }
});

export const { addAlert, removeAlert } = alertsSlice.actions;

// Selectors
export const selectAlerts = (state: RootState) => state.alerts.alerts;

export default alertsSlice.reducer;
