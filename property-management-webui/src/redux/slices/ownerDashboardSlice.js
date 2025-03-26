import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from '../../services/propertyService';
import reservationService from '../../services/reservationService';
import api from '../../services/api';

// Fetch properties owned by the current user
export const fetchOwnerProperties = createAsyncThunk(
  'ownerDashboard/fetchProperties',
  async (_, { rejectWithValue }) => {
    try {
      return await propertyService.getOwnerProperties();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch properties');
    }
  }
);

// Fetch bookings for properties owned by the current user
export const fetchPropertyBookings = createAsyncThunk(
  'ownerDashboard/fetchBookings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/reservations/owner', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

// Fetch statistics for properties owned by the current user
export const fetchPropertyStats = createAsyncThunk(
  'ownerDashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/properties/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch property statistics');
    }
  }
);

// Fetch revenue data for owner dashboard
export const fetchRevenueData = createAsyncThunk(
  'ownerDashboard/fetchRevenue',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/properties/revenue', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch revenue data');
    }
  }
);

const initialState = {
  properties: [],
  bookings: [],
  stats: {
    totalProperties: 0,
    totalRevenue: 0,
    activeBookings: 0,
    occupancyRate: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    monthlyRevenue: [],
    revenueByProperty: [],
    upcomingCheckouts: []
  },
  revenue: {
    monthlyData: [],
    propertyBreakdown: []
  },
  loading: {
    properties: false,
    bookings: false,
    stats: false,
    revenue: false
  },
  error: null
};

const ownerDashboardSlice = createSlice({
  name: 'ownerDashboard',
  initialState,
  reducers: {
    resetDashboardState: (state) => {
      // Reset state if needed
    }
  },
  extraReducers: (builder) => {
    // Handle fetchOwnerProperties
    builder
      .addCase(fetchOwnerProperties.pending, (state) => {
        state.loading.properties = true;
        state.error = null;
      })
      .addCase(fetchOwnerProperties.fulfilled, (state, action) => {
        state.loading.properties = false;
        state.properties = action.payload;
      })
      .addCase(fetchOwnerProperties.rejected, (state, action) => {
        state.loading.properties = false;
        state.error = action.payload;
      });

    // Handle fetchPropertyBookings
    builder
      .addCase(fetchPropertyBookings.pending, (state) => {
        state.loading.bookings = true;
        state.error = null;
      })
      .addCase(fetchPropertyBookings.fulfilled, (state, action) => {
        state.loading.bookings = false;
        state.bookings = action.payload.content || [];
      })
      .addCase(fetchPropertyBookings.rejected, (state, action) => {
        state.loading.bookings = false;
        state.error = action.payload;
      });

    // Handle fetchPropertyStats
    builder
      .addCase(fetchPropertyStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchPropertyStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = {
          ...state.stats,
          ...action.payload
        };
      })
      .addCase(fetchPropertyStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload;
      });

    // Handle fetchRevenueData
    builder
      .addCase(fetchRevenueData.pending, (state) => {
        state.loading.revenue = true;
        state.error = null;
      })
      .addCase(fetchRevenueData.fulfilled, (state, action) => {
        state.loading.revenue = false;
        state.revenue = action.payload;
      })
      .addCase(fetchRevenueData.rejected, (state, action) => {
        state.loading.revenue = false;
        state.error = action.payload;
      });
  }
});

export const { resetDashboardState } = ownerDashboardSlice.actions;
export default ownerDashboardSlice.reducer;