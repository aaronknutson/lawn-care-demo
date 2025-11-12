import api from './api';

// ============= SERVICE PACKAGES =============

/**
 * Get all service packages (admin view with inactive)
 * @returns {Promise<Object>} Response with service packages
 */
export const getAllServicePackages = async () => {
  const response = await api.get('/admin/services/packages');
  return response;
};

/**
 * Create new service package
 * @param {Object} packageData - Service package data
 * @returns {Promise<Object>} Response with created package
 */
export const createServicePackage = async (packageData) => {
  const response = await api.post('/admin/services/packages', packageData);
  return response;
};

/**
 * Update service package
 * @param {string} id - Package ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Response with updated package
 */
export const updateServicePackage = async (id, updates) => {
  const response = await api.put(`/admin/services/packages/${id}`, updates);
  return response;
};

/**
 * Delete service package
 * @param {string} id - Package ID
 * @returns {Promise<Object>} Response confirming deletion
 */
export const deleteServicePackage = async (id) => {
  const response = await api.delete(`/admin/services/packages/${id}`);
  return response;
};

// ============= ADD-ON SERVICES =============

/**
 * Get all add-on services (admin view with inactive)
 * @returns {Promise<Object>} Response with add-on services
 */
export const getAllAddOnServices = async () => {
  const response = await api.get('/admin/services/add-ons');
  return response;
};

/**
 * Create new add-on service
 * @param {Object} serviceData - Add-on service data
 * @returns {Promise<Object>} Response with created service
 */
export const createAddOnService = async (serviceData) => {
  const response = await api.post('/admin/services/add-ons', serviceData);
  return response;
};

/**
 * Update add-on service
 * @param {string} id - Service ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Response with updated service
 */
export const updateAddOnService = async (id, updates) => {
  const response = await api.put(`/admin/services/add-ons/${id}`, updates);
  return response;
};

/**
 * Delete add-on service
 * @param {string} id - Service ID
 * @returns {Promise<Object>} Response confirming deletion
 */
export const deleteAddOnService = async (id) => {
  const response = await api.delete(`/admin/services/add-ons/${id}`);
  return response;
};

// ============= CREW MEMBERS =============

/**
 * Get all crew members
 * @returns {Promise<Object>} Response with crew members
 */
export const getAllCrewMembers = async () => {
  const response = await api.get('/admin/services/crew');
  return response;
};

/**
 * Create new crew member
 * @param {Object} crewData - Crew member data
 * @returns {Promise<Object>} Response with created crew member
 */
export const createCrewMember = async (crewData) => {
  const response = await api.post('/admin/services/crew', crewData);
  return response;
};

/**
 * Update crew member
 * @param {string} id - Crew member ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Response with updated crew member
 */
export const updateCrewMember = async (id, updates) => {
  const response = await api.put(`/admin/services/crew/${id}`, updates);
  return response;
};

/**
 * Delete crew member
 * @param {string} id - Crew member ID
 * @returns {Promise<Object>} Response confirming deletion
 */
export const deleteCrewMember = async (id) => {
  const response = await api.delete(`/admin/services/crew/${id}`);
  return response;
};
