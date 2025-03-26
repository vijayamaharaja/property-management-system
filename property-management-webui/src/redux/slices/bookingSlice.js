import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Add the checkAvailability thunk
export const checkAvailability = createAsyncThunk(
  'booking/checkAvailability',
  async ({ propertyId, checkInDate, checkOutDate }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/v1/properties/public/${propertyId}/availability`, {
        params: { checkInDate, checkOutDate }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check availability');
    }
  }
);

const initialState = {
  selectedProperty: null,
  availability: {
    isAvailable: false,
    loading: false,
    error: null
  },
  reservation: {
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
    // Add the resetBookingState reducer
    resetBookingState: (state) => {
      state.availability = {
        isAvailable: false,
        loading: false,
        error: null
      };
    },
    setSelectedProperty: (state, action) => {
      state.selectedProperty = action.payload;
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
  }
});

// Export the actions
export const { resetBookingState, setSelectedProperty } = bookingSlice.actions;

export default bookingSlice.reducer;