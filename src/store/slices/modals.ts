import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface ModalsState {
  openModals: Record<string, boolean>;
  modalProps: Record<string, any>;
}

const initialState: ModalsState = {
  openModals: {},
  modalProps: {}
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal: (state: ModalsState, action: PayloadAction<{ modalId: string; props?: Record<string, any> }>) => {
      const { modalId, props = {} } = action.payload;
      state.openModals[modalId] = true;
      state.modalProps[modalId] = props;
    },
    closeModal: (state: ModalsState, action: PayloadAction<string>) => {
      const modalId = action.payload;
      state.openModals[modalId] = false;
      delete state.modalProps[modalId];
    },
    closeAllModals: (state: ModalsState) => {
      state.openModals = {};
      state.modalProps = {};
    }
  }
});

export const { openModal, closeModal, closeAllModals } = modalsSlice.actions;
export const selectModalIsOpen = (state: RootState, modalId: string) => !!state.modals.openModals[modalId];
export const selectModalProps = (state: RootState, modalId: string) => state.modals.modalProps[modalId];
export default modalsSlice.reducer;
