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
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return travelPackages;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTravelPackageById = createAsyncThunk(
  'travel/fetchPackageById',
  async (id: string, { rejectWithValue }) => {
    try {
      // Find package from our data
      const packageData = travelPackages.find(pkg => pkg.id === id);
      
      if (!packageData) {
        throw new Error('Package not found');
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return packageData;
    } catch (error: any) {
      return rejectWithValue(error.message);
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