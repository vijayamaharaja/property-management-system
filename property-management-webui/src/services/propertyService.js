import axios from 'axios';

const API_URL = '/api/v1/properties';

const searchProperties = async (searchParams) => {
  const response = await axios.get(`${API_URL}/public/search`, { params: searchParams });
  return response.data;
};

const getPropertyById = async (propertyId) => {
  const response = await axios.get(`${API_URL}/public/${propertyId}`);
  return response.data;
};

const getFeaturedProperties = async () => {
  const response = await axios.get(`${API_URL}/public?featured=true`);
  return response.data.content;
};

const getOwnerProperties = async () => {
  const response = await axios.get(`${API_URL}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data.content;
};

const checkAvailability = async (propertyId, checkInDate, checkOutDate) => {
  const response = await axios.get(`${API_URL}/public/${propertyId}/availability`, {
    params: { checkInDate, checkOutDate }
  });
  return response.data;
};

const propertyService = {
  searchProperties,
  getPropertyById,
  getFeaturedProperties,
  getOwnerProperties,
  checkAvailability
};

export default propertyService;