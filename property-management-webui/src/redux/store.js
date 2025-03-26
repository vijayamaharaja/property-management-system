import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import propertyReducer from './slices/propertySlice';
import reservationReducer from './slices/reservationSlice';
import bookingReducer from './slices/bookingSlice';
import ownerDashboardReducer from './slices/ownerDashboardSlice';
import reviewReducer from './slices/reviewSlice';
import userProfileReducer from './slices/userProfileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertyReducer,
    reservations: reservationReducer,
    booking: bookingReducer,
    ownerDashboard: ownerDashboardReducer,
    reviews: reviewReducer,
    userProfile: userProfileReducer
  }
});