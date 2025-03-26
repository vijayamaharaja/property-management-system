import api from './api';

const searchProperties = async (searchParams) => {
  const response = await api.get(`/properties/public/search`, { params: searchParams });
  return response.data;
};

const getPropertyById = async (propertyId) => {
  const response = await api.get(`/properties/public/${propertyId}`);
  return response.data;
};

const getFeaturedProperties = async () => {
  const response = await api.get(`/properties?featured=true`);
  return response.data.content;
};

const getOwnerProperties = async () => {
  const response = await api.get(`/properties/owner`);
  return response.data.content;
};

const checkAvailability = async (propertyId, checkInDate, checkOutDate) => {
  const response = await api.get(`/properties/${propertyId}/availability`, {
    params: { checkInDate, checkOutDate }
  });
  return response.data;
};

const createProperty = async (propertyData) => {
  const response = await api.post('/properties', propertyData);
  return response.data;
};

const updateProperty = async (propertyId, propertyData) => {
  const response = await api.put(`/properties/${propertyId}`, propertyData);
  return response.data;
};

const deleteProperty = async (propertyId) => {
  const response = await api.delete(`/properties/${propertyId}`);
  return response.data;
};

const uploadPropertyImage = async (propertyId, imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await api.post(`/properties/${propertyId}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const propertyService = {
  searchProperties,
  getPropertyById,
  getFeaturedProperties,
  getOwnerProperties,
  checkAvailability,
  createProperty,
  updateProperty,
  deleteProperty,
  uploadPropertyImage
};

export default propertyService;