import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reservationService from '../../services/reservationService';

// Create a new reservation
export const createReservation = createAsyncThunk(
  'reservations/create',
  async (reservationData, { rejectWithValue }) => {
    try {
      return await reservationService.createReservation(reservationData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create reservation');
    }
  }
);

// Fetch reservation by ID
export const fetchReservationById = createAsyncThunk(
  'reservations/fetchById',
  async (reservationId, { rejectWithValue }) => {
    try {
      return await reservationService.getReservationById(reservationId);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reservation');
    }
  }
);

// Fetch upcoming reservations
export const fetchUpcomingReservations = createAsyncThunk(
  'reservations/fetchUpcoming',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await reservationService.getUpcomingReservations(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch upcoming reservations');
    }
  }
);

// Fetch all user reservations
export const fetchAllReservations = createAsyncThunk(
  'reservations/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await reservationService.getUserReservations(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reservations');
    }
  }
);

// Cancel a reservation
export const cancelReservation = createAsyncThunk(
  'reservations/cancel',
  async (reservationId, { rejectWithValue }) => {
    try {
      await reservationService.cancelReservation(reservationId);
      return reservationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel reservation');
    }
  }
);

// Update reservation status
export const updateReservationStatus = createAsyncThunk(
  'reservations/updateStatus',
  async ({ reservationId, status }, { rejectWithValue }) => {
    try {
      return await reservationService.updateReservationStatus(reservationId, status);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update reservation status');
    }
  }
);

// Fetch property reservations
export const fetchPropertyReservations = createAsyncThunk(
  'reservations/fetchPropertyReservations',
  async ({ propertyId, params = {} }, { rejectWithValue }) => {
    try {
      return await reservationService.getPropertyReservations(propertyId, params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch property reservations');
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
  },
  propertyReservations: {
    data: [],
    loading: false,
    error: null,
    page: 0,
    totalPages: 0
  },
  current: {
    data: null,
    loading: false,
    error: null
  },
  create: {
    loading: false,
    error: null,
    success: false
  },
  cancel: {
    loading: false,
    error: null,
    success: false
  },
  updateStatus: {
    loading: false,
    error: null,
    success: false
  }
};

const reservationSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    resetReservationState: (state, action) => {
      if (action.payload === 'create') {
        state.create = { loading: false, error: null, success: false };
      } else if (action.payload === 'cancel') {
        state.cancel = { loading: false, error: null, success: false };
      } else if (action.payload === 'updateStatus') {
        state.updateStatus = { loading: false, error: null, success: false };
      }
    }
  },
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

    // Handle fetchPropertyReservations
    builder
      .addCase(fetchPropertyReservations.pending, (state) => {
        state.propertyReservations.loading = true;
        state.propertyReservations.error = null;
      })
      .addCase(fetchPropertyReservations.fulfilled, (state, action) => {
        state.propertyReservations.loading = false;
        state.propertyReservations.data = action.payload.content || [];
        state.propertyReservations.page = action.payload.pageable?.pageNumber || 0;
        state.propertyReservations.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchPropertyReservations.rejected, (state, action) => {
        state.propertyReservations.loading = false;
        state.propertyReservations.error = action.payload || 'An error occurred';
      });

    // Handle fetchReservationById
    builder
      .addCase(fetchReservationById.pending, (state) => {
        state.current.loading = true;
        state.current.error = null;
      })
      .addCase(fetchReservationById.fulfilled, (state, action) => {
        state.current.loading = false;
        state.current.data = action.payload;
      })
      .addCase(fetchReservationById.rejected, (state, action) => {
        state.current.loading = false;
        state.current.error = action.payload || 'An error occurred';
      });

    // Handle createReservation
    builder
      .addCase(createReservation.pending, (state) => {
        state.create.loading = true;
        state.create.error = null;
        state.create.success = false;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.create.loading = false;
        state.create.success = true;
        state.upcoming.data.unshift(action.payload);
        state.all.data.unshift(action.payload);
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.create.loading = false;
        state.create.error = action.payload || 'An error occurred';
        state.create.success = false;
      });

    // Handle cancelReservation
    builder
      .addCase(cancelReservation.pending, (state) => {
        state.cancel.loading = true;
        state.cancel.error = null;
        state.cancel.success = false;
      })
      .addCase(cancelReservation.fulfilled, (state, action) => {
        state.cancel.loading = false;
        state.cancel.success = true;
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
        
        // Update property reservations
        state.propertyReservations.data = state.propertyReservations.data.map(reservation => 
          reservation.id === reservationId 
            ? { ...reservation, status: 'CANCELLED' } 
            : reservation
        );
        
        // Update current reservation if it's the one being cancelled
        if (state.current.data && state.current.data.id === reservationId) {
          state.current.data = { ...state.current.data, status: 'CANCELLED' };
        }
      })
      .addCase(cancelReservation.rejected, (state, action) => {
        state.cancel.loading = false;
        state.cancel.error = action.payload || 'An error occurred';
        state.cancel.success = false;
      });

    // Handle updateReservationStatus
    builder
      .addCase(updateReservationStatus.pending, (state) => {
        state.updateStatus.loading = true;
        state.updateStatus.error = null;
        state.updateStatus.success = false;
      })
      .addCase(updateReservationStatus.fulfilled, (state, action) => {
        state.updateStatus.loading = false;
        state.updateStatus.success = true;
        const updatedReservation = action.payload;
        
        // Update in upcoming reservations if exists
        const upcomingIndex = state.upcoming.data.findIndex(r => r.id === updatedReservation.id);
        if (upcomingIndex !== -1) {
          state.upcoming.data[upcomingIndex] = updatedReservation;
        }
        
        // Update in all reservations if exists
        const allIndex = state.all.data.findIndex(r => r.id === updatedReservation.id);
        if (allIndex !== -1) {
          state.all.data[allIndex] = updatedReservation;
        }
        
        // Update in property reservations if exists
        const propertyIndex = state.propertyReservations.data.findIndex(r => r.id === updatedReservation.id);
        if (propertyIndex !== -1) {
          state.propertyReservations.data[propertyIndex] = updatedReservation;
        }
        
        // Update current reservation if it's the one being updated
        if (state.current.data && state.current.data.id === updatedReservation.id) {
          state.current.data = updatedReservation;
        }
      })
      .addCase(updateReservationStatus.rejected, (state, action) => {
        state.updateStatus.loading = false;
        state.updateStatus.error = action.payload || 'An error occurred';
        state.updateStatus.success = false;
      });
  }
});

export const { resetReservationState } = reservationSlice.actions;
export default reservationSlice.reducer;