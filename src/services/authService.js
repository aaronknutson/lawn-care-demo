import api from './api';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data; // API interceptor already unwraps to { success, data, message }
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // API interceptor already unwraps to { success, data, message }
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data; // API interceptor already unwraps to { success, data, message }
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data; // API interceptor already unwraps to { success, data, message }
};

export const refresh = async () => {
  const response = await api.post('/auth/refresh');
  return response.data; // API interceptor already unwraps to { success, data, message }
};
