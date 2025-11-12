import api from './api';

/**
 * Get all customers with search, filter, sort, and pagination
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Response with customers and pagination
 */
export const getAllCustomers = async (params = {}) => {
  const response = await api.get('/admin/customers', { params });
  return response;
};

/**
 * Create new customer (admin)
 * @param {Object} customerData - Customer data
 * @returns {Promise<Object>} Response with created customer
 */
export const createCustomer = async (customerData) => {
  const response = await api.post('/admin/customers', customerData);
  return response;
};

/**
 * Update customer (admin)
 * @param {string} id - Customer ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Response with updated customer
 */
export const updateCustomer = async (id, updates) => {
  const response = await api.put(`/admin/customers/${id}`, updates);
  return response;
};

/**
 * Archive customer
 * @param {string} id - Customer ID
 * @returns {Promise<Object>} Response confirming archival
 */
export const archiveCustomer = async (id) => {
  const response = await api.delete(`/admin/customers/${id}`);
  return response;
};

/**
 * Get detailed customer profile
 * @param {string} id - Customer ID
 * @returns {Promise<Object>} Response with customer profile and stats
 */
export const getCustomerProfile = async (id) => {
  const response = await api.get(`/admin/customers/${id}/profile`);
  return response;
};

/**
 * Add note to customer
 * @param {string} id - Customer ID
 * @param {string} note - Note text
 * @returns {Promise<Object>} Response with created note
 */
export const addCustomerNote = async (id, note) => {
  const response = await api.post(`/admin/customers/${id}/notes`, { note });
  return response;
};

/**
 * Export customers to CSV
 * @returns {Promise<void>}
 */
export const exportCustomers = async () => {
  const response = await api.get('/admin/customers/export', {
    responseType: 'blob',
  });

  // Create a download link
  const url = window.URL.createObjectURL(new Blob([response]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `customers-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return response;
};
