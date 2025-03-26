import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch properties owned by the current user
export const fetchOwnerProperties = createAsyncThunk(
  'ownerDashboard/fetchProperties',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/properties', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.content || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch properties');
    }
  }
);

// Fetch bookings for properties owned by the current user
export const fetchPropertyBookings = createAsyncThunk(
  'ownerDashboard/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/reservations/owner-bookings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data.content || [];
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
      const response = await axios.get('/api/v1/properties/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data || {};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch property statistics');
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
  loading: {
    properties: false,
    bookings: false,
    stats: false
  },
  error: null
};

const ownerDashboardSlice = createSlice({
  name: 'ownerDashboard',
  initialState,
  reducers: {},
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
        state.bookings = action.payload;
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
  }
});

export default ownerDashboardSlice.reducer;