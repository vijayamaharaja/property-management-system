import api from './api';

const getPropertyReviews = async (propertyId, params = {}) => {
  const response = await api.get(`/properties/${propertyId}/reviews`, { params });
  return response.data;
};

const getUserReviews = async (params = {}) => {
  const response = await api.get('/reviews/user', { params });
  return response.data;
};

const createReview = async (propertyId, reviewData) => {
  const response = await api.post(`/properties/${propertyId}/reviews`, reviewData);
  return response.data;
};

const updateReview = async (reviewId, reviewData) => {
  const response = await api.put(`/reviews/${reviewId}`, reviewData);
  return response.data;
};

const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

const reviewService = {
  getPropertyReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview
};

export default reviewService;