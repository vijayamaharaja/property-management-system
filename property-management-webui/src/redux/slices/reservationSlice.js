import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Add the cancelReservation thunk
export const cancelReservation = createAsyncThunk(
  'reservations/cancel',
  async (reservationId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/reservations/${reservationId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return reservationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel reservation');
    }
  }
);

// Add fetchUpcomingReservations thunk
export const fetchUpcomingReservations = createAsyncThunk(
  'reservations/fetchUpcoming',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/reservations/my-upcoming', {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming reservations');
    }
  }
);

// Add fetchAllReservations thunk
export const fetchAllReservations = createAsyncThunk(
  'reservations/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/v1/reservations/my-reservations', {
        params,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reservations');
    }
  }
);

// Add the updateReservationStatus thunk
export const updateReservationStatus = createAsyncThunk(
    'reservations/updateStatus',
    async ({ reservationId, status }, { rejectWithValue }) => {
        try {
        const response = await axios.patch(
            `/api/v1/reservations/${reservationId}/status?status=${status}`,
            {},
            {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
            }
        );
        return response.data;
        } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update reservation status');
        }
    }
);



const initialState = {
  upcoming: {
    data: [],
    loading: false,
    error: null,
    page: 0,
    totalPages: 0
  },
  all: {
    data: [],
    loading: false,
    error: null,
    page: 0,
    totalPages: 0
  }
};

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchUpcomingReservations
    builder
      .addCase(fetchUpcomingReservations.pending, (state) => {
        state.upcoming.loading = true;
        state.upcoming.error = null;
      })
      .addCase(fetchUpcomingReservations.fulfilled, (state, action) => {
        state.upcoming.loading = false;
        state.upcoming.data = action.payload.content || [];
        state.upcoming.page = action.payload.pageable?.pageNumber || 0;
        state.upcoming.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchUpcomingReservations.rejected, (state, action) => {
        state.upcoming.loading = false;
        state.upcoming.error = action.payload || 'An error occurred';
      });

    // Handle fetchAllReservations
    builder
      .addCase(fetchAllReservations.pending, (state) => {
        state.all.loading = true;
        state.all.error = null;
      })
      .addCase(fetchAllReservations.fulfilled, (state, action) => {
        state.all.loading = false;
        state.all.data = action.payload.content || [];
        state.all.page = action.payload.pageable?.pageNumber || 0;
        state.all.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchAllReservations.rejected, (state, action) => {
        state.all.loading = false;
        state.all.error = action.payload || 'An error occurred';
      });

    // Handle cancelReservation
    builder
      .addCase(cancelReservation.fulfilled, (state, action) => {
        const reservationId = action.payload;
        
        // Update upcoming reservations
        state.upcoming.data = state.upcoming.data.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, status: 'CANCELLED' } 
            : reservation
        );
        
        // Update all reservations
        state.all.data = state.all.data.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, status: 'CANCELLED' } 
            : reservation
        );
      });
  }
});

export default reservationSlice.reducer;