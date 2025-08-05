import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { authApi } from '../../services/authApi';
import { RootState } from '../store';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  isEmailVerified: boolean;
  preferredLanguage: string;
  timezone: string;
  lastLoginAt?: string;
  roles: string[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  tenantId: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  tenantId: localStorage.getItem('tenantId'),
};

// API helper
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

async function apiPost(path: string, data: any) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'API error');
  }
  return response.json();
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { usernameOrEmail: string; password: string; tenantId?: string }, { rejectWithValue }) => {
    try {
      // Real API call
      const result = await apiPost('/api/v1/users/auth/login', credentials);
      return {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        tenantId: result.tenantId || credentials.tenantId || 'default',
      };
    } catch (error: any) {
      // fallback to mock for dev
      // await new Promise(resolve => setTimeout(resolve, 1000));
      // return mockResponse;
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      // Real API call
      const result = await apiPost('/api/v1/users/auth/register', userData);
      return {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        tenantId: result.tenantId || 'default',
      };
    } catch (error: any) {
      // fallback to mock for dev
      // await new Promise(resolve => setTimeout(resolve, 1000));
      // return mockResponse;
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      // const response = await authApi.refreshToken(refreshToken);
      // return response.data;
      return { accessToken: '', refreshToken: '' };
    } catch (error: any) {
      return rejectWithValue('Token refresh failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (refreshToken: string, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock successful logout
      return { success: true };
    } catch (error: any) {
      return rejectWithValue('Logout failed');
    }
  }
);

export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: Partial<User>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch('http://localhost:8080/api/v1/users/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to update profile');
      }

      const result = await response.json();
      return result.user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setTenantId: (state, action: PayloadAction<string>) => {
      state.tenantId = action.payload;
      localStorage.setItem('tenantId', action.payload);
    },

  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.tenantId = action.payload.tenantId;
        localStorage.setItem('token', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('tenantId', action.payload.tenantId);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.tenantId = action.payload.tenantId;
        localStorage.setItem('token', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
        localStorage.setItem('tenantId', action.payload.tenantId);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Refresh Token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('token', action.payload.accessToken);
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      })
      .addCase(refreshToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.tenantId = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tenantId');
      })
      .addCase(logout.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.tenantId = null;
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tenantId');
      });

    // Update User
    builder
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setTenantId } = authSlice.actions;
export default authSlice.reducer; 