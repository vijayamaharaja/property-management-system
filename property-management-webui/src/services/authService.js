import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8080';
const API_URL = '/api/v1/auth';

const login = async (credentials) => {
  try {
    console.log('Login Request:', {
      url: `${API_URL}/login`,
      credentials: credentials
    });

    const response = await axios.post(`${API_URL}/login`, credentials);
    
    console.log('Login Response:', response);

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data.user;
  } catch (error) {
    // Improved error handling
    console.error('Login Error:', {
      error: error,
      response: error.response,
      request: error.request,
      config: error.config
    });
    if (!error.response) {
      throw new Error('Network error: Could not connect to the server. Please check your connection or try again later.');
    }
    throw error;
  }
};

const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data.user;
  } catch (error) {
    // Improved error handling
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
    const response = await axios.get('/api/v1/users/profile');
    return response.data;
  } catch (error) {
    // Improved error handling
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