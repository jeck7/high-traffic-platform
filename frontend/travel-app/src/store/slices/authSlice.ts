import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { authApi } from '../../services/authApi';

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

// Dummy async thunks to allow build to pass
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { usernameOrEmail: string; password: string; tenantId?: string }, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login response
      const mockUser = {
        id: 1,
        username: credentials.usernameOrEmail,
        email: credentials.usernameOrEmail,
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        phoneNumber: '+1234567890',
        profilePictureUrl: '',
        isEmailVerified: true,
        preferredLanguage: 'en',
        timezone: 'UTC',
        lastLoginAt: new Date().toISOString(),
        roles: ['USER'],
        createdAt: '2024-01-01T00:00:00Z',
      };
      
      const mockResponse = {
        user: mockUser,
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        tenantId: credentials.tenantId || 'default',
      };
      
      return mockResponse;
    } catch (error: any) {
      return rejectWithValue('Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration response
      const mockUser = {
        id: 2,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        fullName: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
        phoneNumber: userData.phoneNumber || '',
        profilePictureUrl: '',
        isEmailVerified: false,
        preferredLanguage: 'en',
        timezone: 'UTC',
        lastLoginAt: new Date().toISOString(),
        roles: ['USER'],
        createdAt: new Date().toISOString(),
      };
      
      const mockResponse = {
        user: mockUser,
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        tenantId: 'default',
      };
      
      return mockResponse;
    } catch (error: any) {
      return rejectWithValue('Registration failed');
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
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
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
  },
});

export const { clearError, setTenantId, updateUser } = authSlice.actions;
export default authSlice.reducer; 