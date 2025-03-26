import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reviewService from '../../services/reviewService';

// Fetch property reviews
export const fetchPropertyReviews = createAsyncThunk(
  'reviews/fetchPropertyReviews',
  async ({ propertyId, params = {} }, { rejectWithValue }) => {
    try {
      return await reviewService.getPropertyReviews(propertyId, params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch property reviews');
    }
  }
);

// Fetch user reviews
export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await reviewService.getUserReviews(params);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user reviews');
    }
  }
);

// Create a review
export const createReview = createAsyncThunk(
  'reviews/create',
  async ({ propertyId, reviewData }, { rejectWithValue }) => {
    try {
      return await reviewService.createReview(propertyId, reviewData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

// Update a review
export const updateReview = createAsyncThunk(
  'reviews/update',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      return await reviewService.updateReview(reviewId, reviewData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

// Delete a review
export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (reviewId, { rejectWithValue }) => {
    try {
      await reviewService.deleteReview(reviewId);
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

const initialState = {
  propertyReviews: {
    data: [],
    loading: false,
    error: null,
    page: 0,
    totalPages: 0
  },
  userReviews: {
    data: [],
    loading: false,
    error: null,
    page: 0,
    totalPages: 0
  },
  create: {
    loading: false,
    error: null,
    success: false
  },
  update: {
    loading: false,
    error: null,
    success: false
  },
  delete: {
    loading: false,
    error: null,
    success: false
  }
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    resetReviewState: (state, action) => {
      if (action.payload === 'create') {
        state.create = { loading: false, error: null, success: false };
      } else if (action.payload === 'update') {
        state.update = { loading: false, error: null, success: false };
      } else if (action.payload === 'delete') {
        state.delete = { loading: false, error: null, success: false };
      }
    }
  },
  extraReducers: (builder) => {
    // Handle fetchPropertyReviews
    builder
      .addCase(fetchPropertyReviews.pending, (state) => {
        state.propertyReviews.loading = true;
        state.propertyReviews.error = null;
      })
      .addCase(fetchPropertyReviews.fulfilled, (state, action) => {
        state.propertyReviews.loading = false;
        state.propertyReviews.data = action.payload.content || [];
        state.propertyReviews.page = action.payload.pageable?.pageNumber || 0;
        state.propertyReviews.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchPropertyReviews.rejected, (state, action) => {
        state.propertyReviews.loading = false;
        state.propertyReviews.error = action.payload || 'An error occurred';
      });

    // Handle fetchUserReviews
    builder
      .addCase(fetchUserReviews.pending, (state) => {
        state.userReviews.loading = true;
        state.userReviews.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.userReviews.loading = false;
        state.userReviews.data = action.payload.content || [];
        state.userReviews.page = action.payload.pageable?.pageNumber || 0;
        state.userReviews.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.userReviews.loading = false;
        state.userReviews.error = action.payload || 'An error occurred';
      });

    // Handle createReview
    builder
      .addCase(createReview.pending, (state) => {
        state.create.loading = true;
        state.create.error = null;
        state.create.success = false;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.create.loading = false;
        state.create.success = true;
        state.propertyReviews.data.unshift(action.payload);
        state.userReviews.data.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.create.loading = false;
        state.create.error = action.payload || 'An error occurred';
        state.create.success = false;
      });

    // Handle updateReview
    builder
      .addCase(updateReview.pending, (state) => {
        state.update.loading = true;
        state.update.error = null;
        state.update.success = false;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.update.loading = false;
        state.update.success = true;
        const updatedReview = action.payload;
        
        // Update in property reviews if exists
        const propertyIndex = state.propertyReviews.data.findIndex(r => r.id === updatedReview.id);
        if (propertyIndex !== -1) {
          state.propertyReviews.data[propertyIndex] = updatedReview;
        }
        
        // Update in user reviews if exists
        const userIndex = state.userReviews.data.findIndex(r => r.id === updatedReview.id);
        if (userIndex !== -1) {
          state.userReviews.data[userIndex] = updatedReview;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.update.loading = false;
        state.update.error = action.payload || 'An error occurred';
        state.update.success = false;
      });

    // Handle deleteReview
    builder
      .addCase(deleteReview.pending, (state) => {
        state.delete.loading = true;
        state.delete.error = null;
        state.delete.success = false;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.delete.loading = false;
        state.delete.success = true;
        const reviewId = action.payload;
        
        // Remove from property reviews
        state.propertyReviews.data = state.propertyReviews.data.filter(r => r.id !== reviewId);
        
        // Remove from user reviews
        state.userReviews.data = state.userReviews.data.filter(r => r.id !== reviewId);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.delete.loading = false;
        state.delete.error = action.payload || 'An error occurred';
        state.delete.success = false;
      });
  }
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice.reducer;