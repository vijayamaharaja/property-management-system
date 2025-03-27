import api from './api';

const searchProperties = async (searchParams) => {
  try {
    const response = await api.get(`/properties/public/search`, { params: searchParams });
    return response.data;
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
};

const getPropertyById = async (propertyId) => {
  try {
    const response = await api.get(`/properties/public/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching property with ID ${propertyId}:`, error);
    throw error;
  }
};

const getFeaturedProperties = async () => {
  try {
    const response = await api.get(`/properties/public`, {
      params: {
        size: 6,  // Limit to 6 properties
        sort: 'createdAt,desc'  // Get newest properties
      }
    });
    return response.data.content || [];
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }
};

const getOwnerProperties = async () => {
  try {
    const response = await api.get(`/properties/owner`);
    return response.data.content || [];
  } catch (error) {
    console.error('Error fetching owner properties:', error);
    throw error;
  }
};

const checkAvailability = async (propertyId, checkInDate, checkOutDate) => {
  try {
    const response = await api.get(`/properties/${propertyId}/availability`, {
      params: { checkInDate, checkOutDate }
    });
    return response.data;
  } catch (error) {
    console.error('Error checking property availability:', error);
    throw error;
  }
};

const createProperty = async (propertyData) => {
  try {
    const response = await api.post('/properties', propertyData);
    return response.data;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
};

const updateProperty = async (propertyId, propertyData) => {
  try {
    const response = await api.put(`/properties/${propertyId}`, propertyData);
    return response.data;
  } catch (error) {
    console.error(`Error updating property with ID ${propertyId}:`, error);
    throw error;
  }
};

const deleteProperty = async (propertyId) => {
  try {
    const response = await api.delete(`/properties/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting property with ID ${propertyId}:`, error);
    throw error;
  }
};

const uploadPropertyImage = async (propertyId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await api.post(`/properties/${propertyId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error uploading image for property with ID ${propertyId}:`, error);
    throw error;
  }
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