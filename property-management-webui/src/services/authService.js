import axios from 'axios';
import { API_BASE_URL } from '../api/config';

// const API_BASE_URL = process.env.REACT_APP_API_URL || ${API_BASE_URL};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const authService = {
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Network error occurred');
    }
  }
};