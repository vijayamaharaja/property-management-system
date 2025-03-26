import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from '../../services/propertyService';
import reservationService from '../../services/reservationService';

// Check property availability
export const checkAvailability = createAsyncThunk(
  'booking/checkAvailability',
  async ({ propertyId, checkInDate, checkOutDate }, { rejectWithValue }) => {
    try {
      const response = await propertyService.checkAvailability(propertyId, checkInDate, checkOutDate);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check availability');
    }
  }
);

// Create a booking/reservation
export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      return await reservationService.createReservation(bookingData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

const initialState = {
  selectedProperty: null,
  checkInDate: null,
  checkOutDate: null,
  guestCount: 1,
  availability: {
    isAvailable: false,
    loading: false,
    error: null
  },
  booking: {
    data: null,
    loading: false,
    error: null,
    success: false
  }
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // Reset booking state
    resetBookingState: (state) => {
      state.availability = {
        isAvailable: false,
        loading: false,
        error: null
      };
      state.booking = {
        data: null,
        loading: false,
        error: null,
        success: false
      };
    },
    // Set selected property
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
    },
    // Set booking dates
    setBookingDates: (state, action) => {
      const { checkInDate, checkOutDate } = action.payload;
      state.checkInDate = checkInDate;
      state.checkOutDate = checkOutDate;
    },
    // Set guest count
    setGuestCount: (state, action) => {
      state.guestCount = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Handle checkAvailability
    builder
      .addCase(checkAvailability.pending, (state) => {
        state.availability.loading = true;
        state.availability.error = null;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availability.loading = false;
        state.availability.isAvailable = action.payload.available;
      })
      .addCase(checkAvailability.rejected, (state, action) => {
        state.availability.loading = false;
        state.availability.error = action.payload || 'An error occurred';
        state.availability.isAvailable = false;
      });

    // Handle createBooking
    builder
      .addCase(createBooking.pending, (state) => {
        state.booking.loading = true;
        state.booking.error = null;
        state.booking.success = false;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.booking.loading = false;
        state.booking.data = action.payload;
        state.booking.success = true;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.booking.loading = false;
        state.booking.error = action.payload || 'An error occurred';
        state.booking.success = false;
      });
  }
});

// Export the actions
export const { resetBookingState, setSelectedProperty, setBookingDates, setGuestCount } = bookingSlice.actions;

export default bookingSlice.reducer;