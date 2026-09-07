import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  activeRequestsCount: number;
  isGlobalLoading: boolean;
  loadingMessage: string | null;
  toast: {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  } | null;
}

const initialState: UIState = {
  activeRequestsCount: 0,
  isGlobalLoading: false,
  loadingMessage: null,
  toast: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<string | undefined>) => {
      state.activeRequestsCount += 1;
      state.isGlobalLoading = true;
      if (action.payload) {
        state.loadingMessage = action.payload;
      }
    },
    stopLoading: (state) => {
      state.activeRequestsCount = Math.max(0, state.activeRequestsCount - 1);
      if (state.activeRequestsCount === 0) {
        state.isGlobalLoading = false;
        state.loadingMessage = null;
      }
    },
    setGlobalLoading: (
      state,
      action: PayloadAction<{ loading: boolean; message?: string | null }>
    ) => {
      state.isGlobalLoading = action.payload.loading;
      state.loadingMessage = action.payload.message || null;
      if (!action.payload.loading) {
        state.activeRequestsCount = 0;
      }
    },
    showToast: (
      state,
      action: PayloadAction<{
        message: string;
        type?: 'success' | 'error' | 'info' | 'warning';
      }>
    ) => {
      state.toast = {
        visible: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    hideToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  startLoading,
  stopLoading,
  setGlobalLoading,
  showToast,
  hideToast,
} = uiSlice.actions;

export default uiSlice.reducer;
