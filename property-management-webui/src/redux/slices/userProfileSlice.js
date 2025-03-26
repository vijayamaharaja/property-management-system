import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userProfileService from '../../services/userProfileService';

// Get user profile
export const getUserProfile = createAsyncThunk(
  'userProfile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await userProfileService.getUserProfile();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'userProfile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      return await userProfileService.updateUserProfile(profileData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user profile');
    }
  }
);

// Change password
export const changePassword = createAsyncThunk(
  'userProfile/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      return await userProfileService.changePassword(passwordData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change password');
    }
  }
);

// Upload profile image
export const uploadProfileImage = createAsyncThunk(
  'userProfile/uploadImage',
  async (imageFile, { rejectWithValue }) => {
    try {
      return await userProfileService.uploadProfileImage(imageFile);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload profile image');
    }
  }
);

const initialState = {
  profile: {
    data: null,
    loading: false,
    error: null
  },
  update: {
    loading: false,
    error: null,
    success: false
  },
  password: {
    loading: false,
    error: null,
    success: false
  },
  image: {
    loading: false,
    error: null,
    success: false
  }
};

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    resetProfileState: (state, action) => {
      if (action.payload === 'update') {
        state.update = { loading: false, error: null, success: false };
      } else if (action.payload === 'password') {
        state.password = { loading: false, error: null, success: false };
      } else if (action.payload === 'image') {
        state.image = { loading: false, error: null, success: false };
      }
    }
  },
  extraReducers: (builder) => {
    // Handle getUserProfile
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.profile.loading = true;
        state.profile.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.profile.loading = false;
        state.profile.data = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.profile.loading = false;
        state.profile.error = action.payload || 'An error occurred';
      });

    // Handle updateUserProfile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.update.loading = true;
        state.update.error = null;
        state.update.success = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.update.loading = false;
        state.update.success = true;
        state.profile.data = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.update.loading = false;
        state.update.error = action.payload || 'An error occurred';
        state.update.success = false;
      });

    // Handle changePassword
    builder
      .addCase(changePassword.pending, (state) => {
        state.password.loading = true;
        state.password.error = null;
        state.password.success = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.password.loading = false;
        state.password.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.password.loading = false;
        state.password.error = action.payload || 'An error occurred';
        state.password.success = false;
      });

    // Handle uploadProfileImage
    builder
      .addCase(uploadProfileImage.pending, (state) => {
        state.image.loading = true;
        state.image.error = null;
        state.image.success = false;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.image.loading = false;
        state.image.success = true;
        if (state.profile.data) {
          state.profile.data.profileImageUrl = action.payload.imageUrl;
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.image.loading = false;
        state.image.error = action.payload || 'An error occurred';
        state.image.success = false;
      });
  }
});

export const { resetProfileState } = userProfileSlice.actions;
export default userProfileSlice.reducer;