import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/slices/authSlice';
import { API_BASE_URL } from '../api/config';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      window.location.href = '/login?session=expired';
    }
    return Promise.reject(error);
  }
);

export default api;