import api from './api';
import { API_BASE_URL } from '../api/config';

const AUTH_URL = `${API_BASE_URL}/auth`;

const login = async (credentials) => {
  try {
    const response = await api.post(`${AUTH_URL}/login`, credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data.user;
  } catch (error) {
    if (!error.response) {
      throw new Error('Network error: Could not connect to the server. Please check your connection or try again later.');
    }
    throw error;
  }
};

const register = async (userData) => {
  try {
    const response = await api.post(`${AUTH_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data.user;
  } catch (error) {
    if (!error.response) {
      throw new Error('Network error: Could not connect to the server. Please check your connection or try again later.');
    }
    throw error;
  }
};

const logout = () => {
  localStorage.removeItem('token');
};

const getCurrentUser = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    if (!error.response) {
      throw new Error('Network error: Could not connect to the server.');
    }
    throw error;
  }
};

const authService = {
  login,
  register,
  logout,
  getCurrentUser
};

export default authService;