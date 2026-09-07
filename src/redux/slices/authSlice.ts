import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService, LoginPayload, OtpPayload } from '../../services/auth/authService';
import { userService } from '../../services/user/userService';
import { AUTH_STORAGE_KEYS, getStoredAccessToken } from '../../services/api/apiClient';
import { UserRole } from '../../types';

export interface AuthState {
  isAuthenticated: boolean;
  currentRole: UserRole;
  currentUser: {
    name: string;
    phone: string;
    email: string;
    [key: string]: any;
  } | null;
  userRoleData: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  currentRole: 'customer',
  currentUser: {
    name: 'Ravi Kumar',
    phone: '9876543210',
    email: 'ravi.kumar@buildkart.in',
  },
  userRoleData: null,
  loading: false,
  error: null,
};

// Async Thunks
export const initAuthThunk = createAsyncThunk('auth/initAuth', async () => {
  try {
    const savedRole = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.CURRENT_ROLE);
    let currentRole: UserRole = 'customer';
    if (savedRole && ['customer', 'retailer', 'delivery'].includes(savedRole)) {
      currentRole = savedRole as UserRole;
    }

    const token = await getStoredAccessToken();
    if (token) {
      try {
        const res = await authService.getMe();
        if (res.data?.user) {
          return {
            isAuthenticated: true,
            currentUser: res.data.user,
            userRoleData: res.data.role_data,
            currentRole,
          };
        }
      } catch {
        // Fallback
      }
      return { isAuthenticated: true, currentUser: null, userRoleData: null, currentRole };
    }

    return { isAuthenticated: false, currentUser: null, userRoleData: null, currentRole };
  } catch {
    return { isAuthenticated: false, currentUser: null, userRoleData: null, currentRole: 'customer' as UserRole };
  }
});

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await authService.login(payload);
      if (res.data?.user) {
        return {
          user: res.data.user,
          roleData: res.data.role_data,
          role: (res.data.user.role === 'driver' ? 'delivery' : res.data.user.role) as UserRole,
        };
      }
      return rejectWithValue(res.message || 'Login failed');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  'auth/verifyOtp',
  async (payload: OtpPayload, { rejectWithValue }) => {
    try {
      const res = await authService.verifyOtp(payload);
      if (res.data?.user) {
        return {
          user: res.data.user,
          roleData: res.data.role_data,
          role: (payload.role === 'driver' ? 'delivery' : payload.role || 'customer') as UserRole,
        };
      }
      return rejectWithValue(res.message || 'Verification failed');
    } catch (err: any) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

export const refreshProfileThunk = createAsyncThunk('auth/refreshProfile', async () => {
  const res = await authService.getMe();
  return res.data;
});

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentRole: (state, action: PayloadAction<UserRole>) => {
      state.currentRole = action.payload;
      AsyncStorage.setItem(AUTH_STORAGE_KEYS.CURRENT_ROLE, action.payload).catch(() => {});
    },
    setCurrentUser: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Init Auth
    builder.addCase(initAuthThunk.fulfilled, (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.currentRole = action.payload.currentRole;
      if (action.payload.currentUser) state.currentUser = action.payload.currentUser;
      if (action.payload.userRoleData) state.userRoleData = action.payload.userRoleData;
    });

    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
        state.userRoleData = action.payload.roleData;
        if (action.payload.role) state.currentRole = action.payload.role;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Verify OTP
    builder
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.currentUser = action.payload.user;
        state.userRoleData = action.payload.roleData;
        if (action.payload.role) state.currentRole = action.payload.role;
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Refresh Profile
    builder.addCase(refreshProfileThunk.fulfilled, (state, action) => {
      if (action.payload?.user) {
        state.currentUser = action.payload.user;
        state.userRoleData = action.payload.role_data;
      }
    });

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      state.userRoleData = null;
    });
  },
});

export const { setCurrentRole, setCurrentUser, clearError } = authSlice.actions;
export default authSlice.reducer;
