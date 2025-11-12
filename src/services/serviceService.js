import api from './api';

/**
 * Get all service packages
 * @returns {Promise<Object>} Response with service packages
 */
export const getServicePackages = async () => {
  const response = await api.get('/services/packages');
  return response;
};

/**
 * Get all add-on services
 * @returns {Promise<Object>} Response with add-on services
 */
export const getAddOnServices = async () => {
  const response = await api.get('/services/add-ons');
  return response;
};

/**
 * Calculate price for selected services
 * @param {Object} data - Price calculation data
 * @param {string} data.packageId - Selected package ID
 * @param {number} data.lotSize - Property lot size in square feet
 * @param {string[]} data.addOnIds - Array of selected add-on service IDs
 * @returns {Promise<Object>} Response with calculated price breakdown
 */
export const calculatePrice = async (data) => {
  const response = await api.post('/services/calculate-price', data);
  return response;
};
