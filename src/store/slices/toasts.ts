import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReactNode } from 'react';
import { RootState } from '../index';

export type ToastVariant = 'bookmark' | 'pubky' | 'warning' | 'link' | 'text';

interface ToastMessage {
  id: number;
  content: ReactNode;
  variant?: ToastVariant;
  title?: string;
}

interface ToastsState {
  toasts: ToastMessage[];
}

const initialState: ToastsState = {
  toasts: []
};

const toastsSlice = createSlice({
  name: 'toasts',
  initialState,
  reducers: {
    addToast: (
      state: ToastsState,
      action: PayloadAction<{ content: ReactNode; variant?: ToastVariant; title?: string }>
    ) => {
      const id = Date.now();
      state.toasts.push({
        id,
        content: action.payload.content,
        variant: action.payload.variant || 'link',
        title: action.payload.title
      });
    },
    removeToast: (state: ToastsState, action: PayloadAction<number>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    }
  }
});

export const { addToast, removeToast } = toastsSlice.actions;
export const selectToasts = (state: RootState) => state.toasts.toasts;
export default toastsSlice.reducer;
