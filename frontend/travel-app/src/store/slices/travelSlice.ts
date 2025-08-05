import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { travelPackages, TravelPackage } from '../../data/travelPackages';

export interface TravelState {
  packages: TravelPackage[];
  loading: boolean;
  error: string | null;
  selectedPackage: TravelPackage | null;
  filters: {
    destination: string;
    minPrice: number;
    maxPrice: number;
    duration: number;
    category: string;
  };
}

const initialState: TravelState = {
  packages: [],
  loading: false,
  error: null,
  selectedPackage: null,
  filters: {
    destination: '',
    minPrice: 0,
    maxPrice: 10000,
    duration: 0,
    category: '',
  },
};

// Async thunks
export const fetchTravelPackages = createAsyncThunk(
  'travel/fetchPackages',
  async (_, { rejectWithValue }) => {
    try {
      // Real API call
      const response = await fetch('http://localhost:8080/api/v1/travel/packages', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }
      const data = await response.json();
      return data.packages || travelPackages; // fallback to mock if no data
    } catch (error: any) {
      // fallback to mock data for dev
      await new Promise(resolve => setTimeout(resolve, 1000));
      return travelPackages;
    }
  }
);

export const fetchTravelPackageById = createAsyncThunk(
  'travel/fetchPackageById',
  async (id: string, { rejectWithValue }) => {
    try {
      // Real API call
      const response = await fetch(`http://localhost:8080/api/v1/travel/packages/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Package not found');
      }
      const data = await response.json();
      return data.package || travelPackages.find(pkg => pkg.id === id);
    } catch (error: any) {
      // fallback to mock data
      const packageData = travelPackages.find(pkg => pkg.id === id);
      if (!packageData) {
        throw new Error('Package not found');
      }
      await new Promise(resolve => setTimeout(resolve, 500));
      return packageData;
    }
  }
);

const travelSlice = createSlice({
  name: 'travel',
  initialState,
  reducers: {
    setSelectedPackage: (state, action: PayloadAction<TravelPackage | null>) => {
      state.selectedPackage = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<TravelState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTravelPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload;
      })
      .addCase(fetchTravelPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTravelPackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTravelPackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPackage = action.payload;
      })
      .addCase(fetchTravelPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedPackage, setFilters, clearFilters, clearError } = travelSlice.actions;
export default travelSlice.reducer; 