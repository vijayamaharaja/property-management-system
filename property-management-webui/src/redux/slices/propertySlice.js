import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from '../../services/propertyService';

// Fetch properties with search criteria
export const searchProperties = createAsyncThunk(
  'properties/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      return await propertyService.searchProperties(searchParams);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to search properties');
    }
  }
);

// Fetch property details by ID
export const fetchPropertyDetails = createAsyncThunk(
  'properties/fetchDetails',
  async (propertyId, { rejectWithValue }) => {
    try {
      return await propertyService.getPropertyById(propertyId);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch property details');
    }
  }
);

// Fetch featured properties for the homepage
export const fetchFeaturedProperties = createAsyncThunk(
  'properties/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      return await propertyService.getFeaturedProperties();
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch featured properties');
    }
  }
);

const propertySlice = createSlice({
  name: 'properties',
  initialState: {
    search: {
      properties: [],
      loading: false,
      error: null,
      totalPages: 0,
      currentPage: 0
    },
    details: {
      property: null,
      loading: false,
      error: null
    },
    featured: {
      properties: [],
      loading: false,
      error: null
    }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Search properties
      .addCase(searchProperties.pending, (state) => {
        state.search.loading = true;
        state.search.error = null;
      })
      .addCase(searchProperties.fulfilled, (state, action) => {
        state.search.loading = false;
        state.search.properties = action.payload.content;
        state.search.totalPages = action.payload.totalPages;
        state.search.currentPage = action.payload.number;
      })
      .addCase(searchProperties.rejected, (state, action) => {
        state.search.loading = false;
        state.search.error = action.payload;
      })
      // Fetch property details
      .addCase(fetchPropertyDetails.pending, (state) => {
        state.details.loading = true;
        state.details.error = null;
      })
      .addCase(fetchPropertyDetails.fulfilled, (state, action) => {
        state.details.loading = false;
        state.details.property = action.payload;
      })
      .addCase(fetchPropertyDetails.rejected, (state, action) => {
        state.details.loading = false;
        state.details.error = action.payload;
      })
      // Fetch featured properties
      .addCase(fetchFeaturedProperties.pending, (state) => {
        state.featured.loading = true;
        state.featured.error = null;
      })
      .addCase(fetchFeaturedProperties.fulfilled, (state, action) => {
        state.featured.loading = false;
        state.featured.properties = action.payload;
      })
      .addCase(fetchFeaturedProperties.rejected, (state, action) => {
        state.featured.loading = false;
        state.featured.error = action.payload;
      });
  }
});

export default propertySlice.reducer;