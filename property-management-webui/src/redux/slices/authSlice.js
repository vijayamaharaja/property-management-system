import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';

// Login Async Thunk
export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            return await authService.login(credentials);
        } catch (error) {
            // Use error message from the service or a generic fallback
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Login failed'
            );
        }
    }
);

// Register Async Thunk
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            return await authService.register(userData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Registration failed'
            );
        }
    }
);

// Logout Async Thunk
export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            authService.logout();
            return null;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Logout failed'
            );
        }
    }
);

// Get Current User Async Thunk
export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            return await authService.getCurrentUser();
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'Failed to fetch user profile'
            );
        }
    }
);

// Initial State
const initialState = {
    /** @type {Object|null} */
    user: null,
    /** @type {boolean} */
    isAuthenticated: !!localStorage.getItem('token'),
    /** @type {boolean} */
    loading: false,
    /** @type {string|null} */
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        /**
         * Clear any existing error in the state
         * @param {Object} state - The current Redux state
         */
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Login Cases
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload;
            })
        
        // Register Cases
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload;
        })
        
        // Logout Cases
        .addCase(logout.pending, (state) => {
            state.loading = true;
        })
        .addCase(logout.fulfilled, (state) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        })
        .addCase(logout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        
        // Get Current User Cases
        .addCase(getCurrentUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(getCurrentUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.error = null;
        })
        .addCase(getCurrentUser.rejected, (state, action) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.error = action.payload;
        });
    }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;