import api from './api';

const createReservation = async (reservationData) => {
  const response = await api.post('/reservations', reservationData);
  return response.data;
};

const getReservationById = async (reservationId) => {
  const response = await api.get(`/reservations/${reservationId}`);
  return response.data;
};

const getUserReservations = async (params = {}) => {
  const response = await api.get('/reservations/user', { params });
  return response.data;
};

const getUpcomingReservations = async (params = {}) => {
  const response = await api.get('/reservations/user/upcoming', { params });
  return response.data;
};

const cancelReservation = async (reservationId) => {
  const response = await api.patch(`/reservations/${reservationId}/cancel`);
  return response.data;
};

const getPropertyReservations = async (propertyId, params = {}) => {
  const response = await api.get(`/reservations/property/${propertyId}`, { params });
  return response.data;
};

const updateReservationStatus = async (reservationId, status) => {
  const response = await api.patch(`/reservations/${reservationId}/status`, { status });
  return response.data;
};

const reservationService = {
  createReservation,
  getReservationById,
  getUserReservations,
  getUpcomingReservations,
  cancelReservation,
  getPropertyReservations,
  updateReservationStatus
};

export default reservationService;