import api from './api';

export const getAllAppointments = async (params = {}) => {
  const response = await api.get('/bookings', { params });
  return response.data || [];
};

export const getAppointmentById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const rescheduleAppointment = async (id, data) => {
  const response = await api.patch(`/bookings/${id}/reschedule`, data);
  return response.data;
};

export const completeAppointment = async (id, data) => {
  const response = await api.patch(`/bookings/${id}/complete`, data);
  return response.data;
};

export const uploadAppointmentPhotos = async (id, formData) => {
  const response = await api.post(`/bookings/${id}/photos`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
