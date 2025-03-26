import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from '../../services/propertyService';

// Fetch properties with search criteria
export const searchProperties = createAsyncThunk(
    'properties/search',
    async (searchParams, { rejectWithValue }) => {
      try {
        return await propertyService.searchProperties(searchParams);
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to search properties');
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
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch property details');
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
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured properties');
      }
    }
  );
  
  // Create a new property
  export const createProperty = createAsyncThunk(
    'properties/create',
    async (propertyData, { rejectWithValue }) => {
      try {
        return await propertyService.createProperty(propertyData);
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create property');
      }
    }
  );
  
  // Update an existing property
  export const updateProperty = createAsyncThunk(
    'properties/update',
    async ({ propertyId, propertyData }, { rejectWithValue }) => {
      try {
        return await propertyService.updateProperty(propertyId, propertyData);
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update property');
      }
    }
  );
  
  // Delete a property
  export const deleteProperty = createAsyncThunk(
    'properties/delete',
    async (propertyId, { rejectWithValue }) => {
      try {
        await propertyService.deleteProperty(propertyId);
        return propertyId;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete property');
      }
    }
  );
  
  // Upload property image
  export const uploadPropertyImage = createAsyncThunk(
    'properties/uploadImage',
    async ({ propertyId, imageFile }, { rejectWithValue }) => {
      try {
        return await propertyService.uploadPropertyImage(propertyId, imageFile);
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to upload property image');
      }
    }
  );
  
  // Fetch property filters (e.g., available property types, locations)
  export const fetchPropertyFilters = createAsyncThunk(
    'properties/fetchFilters',
    async (_, { rejectWithValue }) => {
      try {
        return await propertyService.getPropertyFilters();
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch property filters');
      }
    }
  );
  
  // Add property to favorites
  export const addPropertyToFavorites = createAsyncThunk(
    'properties/addToFavorites',
    async (propertyId, { rejectWithValue }) => {
      try {
        return await propertyService.addToFavorites(propertyId);
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add property to favorites');
      }
    }
  );
  
  // Remove property from favorites
  export const removePropertyFromFavorites = createAsyncThunk(
    'properties/removeFromFavorites',
    async (propertyId, { rejectWithValue }) => {
      try {
        return await propertyService.removeFromFavorites(propertyId);
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove property from favorites');
      }
    }
  );
  
  // Fetch user's favorite properties
  export const fetchFavoriteProperties = createAsyncThunk(
    'properties/fetchFavorites',
    async (_, { rejectWithValue }) => {
      try {
        return await propertyService.getFavoriteProperties();
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorite properties');
      }
    }
  );
  
  // Fetch recommended properties based on user preferences
  export const fetchRecommendedProperties = createAsyncThunk(
    'properties/fetchRecommended',
    async (_, { rejectWithValue }) => {
      try {
        return await propertyService.getRecommendedProperties();
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommended properties');
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
      },
      upload: {
        loading: false,
        error: null,
        success: false
      },
      filters: {
        data: null,
        loading: false,
        error: null
      },
      favorites: {
        properties: [],
        loading: false,
        error: null
      },
      recommended: {
        properties: [],
        loading: false,
        error: null
      },
      pagination: {
        pageSize: 10,
        currentPage: 0,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      }
    },
    reducers: {
      resetPropertyState: (state, action) => {
        if (action.payload === 'create') {
          state.create = { loading: false, error: null, success: false };
        } else if (action.payload === 'update') {
          state.update = { loading: false, error: null, success: false };
        } else if (action.payload === 'delete') {
          state.delete = { loading: false, error: null, success: false };
        } else if (action.payload === 'upload') {
          state.upload = { loading: false, error: null, success: false };
        } else if (action.payload === 'filters') {
          state.filters = { data: null, loading: false, error: null };
        } else if (action.payload === 'favorites') {
          state.favorites = { properties: [], loading: false, error: null };
        } else if (action.payload === 'recommended') {
          state.recommended = { properties: [], loading: false, error: null };
        }
      },
      
      // Pagination and sorting reducers
      setPagination: (state, action) => {
        const { pageSize, currentPage, sortBy, sortDirection } = action.payload;
        
        if (pageSize !== undefined) state.pagination.pageSize = pageSize;
        if (currentPage !== undefined) state.pagination.currentPage = currentPage;
        if (sortBy !== undefined) state.pagination.sortBy = sortBy;
        if (sortDirection !== undefined) state.pagination.sortDirection = sortDirection;
      }
    },
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
        })
        // Create property
        .addCase(createProperty.pending, (state) => {
          state.create.loading = true;
          state.create.error = null;
          state.create.success = false;
        })
        .addCase(createProperty.fulfilled, (state, action) => {
          state.create.loading = false;
          state.create.success = true;
          state.search.properties.push(action.payload);
        })
        .addCase(createProperty.rejected, (state, action) => {
          state.create.loading = false;
          state.create.error = action.payload;
          state.create.success = false;
        })
        // Update property
        .addCase(updateProperty.pending, (state) => {
          state.update.loading = true;
          state.update.error = null;
          state.update.success = false;
        })
        .addCase(updateProperty.fulfilled, (state, action) => {
          state.update.loading = false;
          state.update.success = true;
          
          // Update in search results if exists
          const index = state.search.properties.findIndex(p => p.id === action.payload.id);
          if (index !== -1) {
            state.search.properties[index] = action.payload;
          }
          
          // Update details if it's the current property
          if (state.details.property && state.details.property.id === action.payload.id) {
            state.details.property = action.payload;
          }
        })
        .addCase(updateProperty.rejected, (state, action) => {
          state.update.loading = false;
          state.update.error = action.payload;
          state.update.success = false;
        })
        // Delete property
        .addCase(deleteProperty.pending, (state) => {
          state.delete.loading = true;
          state.delete.error = null;
          state.delete.success = false;
        })
        .addCase(deleteProperty.fulfilled, (state, action) => {
          state.delete.loading = false;
          state.delete.success = true;
          state.search.properties = state.search.properties.filter(p => p.id !== action.payload);
        })
        .addCase(deleteProperty.rejected, (state, action) => {
          state.delete.loading = false;
          state.delete.error = action.payload;
          state.delete.success = false;
        })
        // Upload property image
        .addCase(uploadPropertyImage.pending, (state) => {
          state.upload.loading = true;
          state.upload.error = null;
          state.upload.success = false;
        })
        .addCase(uploadPropertyImage.fulfilled, (state, action) => {
          state.upload.loading = false;
          state.upload.success = true;
          
          // Update the property with the new image if it's the current property
          if (state.details.property && state.details.property.id === action.payload.propertyId) {
            if (!state.details.property.imageUrls) {
              state.details.property.imageUrls = [];
            }
            state.details.property.imageUrls.push(action.payload.imageUrl);
          }
        })
        .addCase(uploadPropertyImage.rejected, (state, action) => {
          state.upload.loading = false;
          state.upload.error = action.payload;
          state.upload.success = false;
        })

        // Fetch property filters
        .addCase(fetchPropertyFilters.pending, (state) => {
          state.filters.loading = true;
          state.filters.error = null;
        })
        .addCase(fetchPropertyFilters.fulfilled, (state, action) => {
          state.filters.loading = false;
          state.filters.data = action.payload;
        })
        .addCase(fetchPropertyFilters.rejected, (state, action) => {
          state.filters.loading = false;
          state.filters.error = action.payload;
        })
        // Fetch favorite properties
        .addCase(fetchFavoriteProperties.pending, (state) => {
          state.favorites.loading = true;
          state.favorites.error = null;
        })
        .addCase(fetchFavoriteProperties.fulfilled, (state, action) => {
          state.favorites.loading = false;
          state.favorites.properties = action.payload;
        })
        .addCase(fetchFavoriteProperties.rejected, (state, action) => {
          state.favorites.loading = false;
          state.favorites.error = action.payload;
        })
        // Add property to favorites
        .addCase(addPropertyToFavorites.fulfilled, (state, action) => {
          // Add the property to favorites if not already present
          if (!state.favorites.properties.some(p => p.id === action.payload.id)) {
            state.favorites.properties.push(action.payload);
          }
        })
        // Remove property from favorites
        .addCase(removePropertyFromFavorites.fulfilled, (state, action) => {
          state.favorites.properties = state.favorites.properties.filter(
            p => p.id !== action.payload
          );
        })
        // Fetch recommended properties
        .addCase(fetchRecommendedProperties.pending, (state) => {
          state.recommended.loading = true;
          state.recommended.error = null;
        })
        .addCase(fetchRecommendedProperties.fulfilled, (state, action) => {
          state.recommended.loading = false;
          state.recommended.properties = action.payload;
        })
        .addCase(fetchRecommendedProperties.rejected, (state, action) => {
          state.recommended.loading = false;
          state.recommended.error = action.payload;
        });
    }
  });

export const { setPagination, resetPropertyState } = propertySlice.actions;
export default propertySlice.reducer;
