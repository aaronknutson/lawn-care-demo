import api from './api';

/**
 * Get overview statistics for admin dashboard
 * @returns {Promise} Overview stats data
 */
export const getOverviewStats = async () => {
  const response = await api.get('/dashboard/stats');
  return { data: response.data || {} };
};

/**
 * Get detailed revenue analytics
 * @returns {Promise} Revenue analytics data
 */
export const getRevenueAnalytics = async () => {
  const response = await api.get('/dashboard/revenue');
  return { data: response.data || {} };
};

/**
 * Get today's appointments
 * @returns {Promise} Today's appointments list
 */
export const getTodaysAppointments = async () => {
  const response = await api.get('/dashboard/appointments-today');
  return { data: response.data || [] };
};

/**
 * Get customer metrics
 * @returns {Promise} Customer metrics data
 */
export const getCustomerMetrics = async () => {
  const response = await api.get('/dashboard/customer-metrics');
  return { data: response.data || {} };
};

export default {
  getOverviewStats,
  getRevenueAnalytics,
  getTodaysAppointments,
  getCustomerMetrics,
};
