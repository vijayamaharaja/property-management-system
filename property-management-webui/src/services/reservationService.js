import axios from 'axios';

const API_URL = '/api/v1/reservations';

const createReservation = async (reservationData) => {
  const response = await axios.post(API_URL, reservationData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

const getReservationById = async (reservationId) => {
  const response = await axios.get(`${API_URL}/${reservationId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

const getUserReservations = async (params = {}) => {
  const response = await axios.get(`${API_URL}/my-reservations`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    params
  });
  return response.data;
};

const getUpcomingReservations = async (params = {}) => {
  const response = await axios.get(`${API_URL}/my-upcoming`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    params
  });
  return response.data;
};

const cancelReservation = async (reservationId) => {
  const response = await axios.delete(`${API_URL}/${reservationId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  return response.data;
};

const getPropertyReservations = async (propertyId, params = {}) => {
  const response = await axios.get(`${API_URL}/property/${propertyId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    params
  });
  return response.data;
};

const updateReservationStatus = async (reservationId, status) => {
  const response = await axios.patch(`${API_URL}/${reservationId}/status?status=${status}`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
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