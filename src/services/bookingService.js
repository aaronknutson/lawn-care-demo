import api from './api';

/**
 * Create a new booking/appointment
 * @param {Object} bookingData - Booking data
 * @param {string} bookingData.propertyId - Property ID
 * @param {string} bookingData.servicePackageId - Service package ID
 * @param {string} bookingData.scheduledDate - Scheduled date (ISO format)
 * @param {string} bookingData.scheduledTime - Scheduled time
 * @param {string} bookingData.frequency - Frequency (one-time, weekly, bi-weekly, monthly)
 * @param {string[]} bookingData.addOnServiceIds - Array of add-on service IDs
 * @param {string} bookingData.specialInstructions - Special instructions
 * @returns {Promise<Object>} Response with created booking
 */
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response;
};

/**
 * Get booking by ID
 * @param {string} id - Booking ID
 * @returns {Promise<Object>} Response with booking details
 */
export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response;
};

/**
 * Get all bookings for the authenticated user
 * @param {Object} filters - Optional filters
 * @param {string} filters.status - Filter by status
 * @param {string} filters.startDate - Filter by start date
 * @param {string} filters.endDate - Filter by end date
 * @param {number} filters.limit - Limit number of results
 * @param {number} filters.offset - Offset for pagination
 * @returns {Promise<Object>} Response with bookings array
 */
export const getAllBookings = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.status) params.append('status', filters.status);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.offset) params.append('offset', filters.offset);

  const queryString = params.toString();
  const url = queryString ? `/bookings?${queryString}` : '/bookings';

  const response = await api.get(url);
  return response;
};

/**
 * Update booking
 * @param {string} id - Booking ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Response with updated booking
 */
export const updateBooking = async (id, updates) => {
  const response = await api.put(`/bookings/${id}`, updates);
  return response;
};

/**
 * Cancel booking
 * @param {string} id - Booking ID
 * @param {string} cancellationReason - Reason for cancellation
 * @returns {Promise<Object>} Response with cancelled booking
 */
export const cancelBooking = async (id, cancellationReason) => {
  const response = await api.delete(`/bookings/${id}`, {
    data: { cancellationReason },
  });
  return response;
};

// Property API functions

/**
 * Create a new property
 * @param {Object} propertyData - Property data
 * @returns {Promise<Object>} Response with created property
 */
export const createProperty = async (propertyData) => {
  const response = await api.post('/properties', propertyData);
  return response;
};

/**
 * Get all properties for the authenticated user
 * @returns {Promise<Object>} Response with properties array
 */
export const getUserProperties = async () => {
  const response = await api.get('/properties');
  return response;
};

/**
 * Get property by ID
 * @param {string} id - Property ID
 * @returns {Promise<Object>} Response with property details
 */
export const getPropertyById = async (id) => {
  const response = await api.get(`/properties/${id}`);
  return response;
};

/**
 * Update property
 * @param {string} id - Property ID
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Response with updated property
 */
export const updateProperty = async (id, updates) => {
  const response = await api.put(`/properties/${id}`, updates);
  return response;
};

/**
 * Delete property
 * @param {string} id - Property ID
 * @returns {Promise<Object>} Response confirming deletion
 */
export const deleteProperty = async (id) => {
  const response = await api.delete(`/properties/${id}`);
  return response;
};

// Payment API functions

/**
 * Create Stripe payment intent
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<Object>} Response with payment intent client secret
 */
export const createPaymentIntent = async (appointmentId) => {
  const response = await api.post('/payments/create-intent', { appointmentId });
  return response;
};

/**
 * Confirm payment
 * @param {string} paymentIntentId - Stripe payment intent ID
 * @returns {Promise<Object>} Response with payment confirmation
 */
export const confirmPayment = async (paymentIntentId) => {
  const response = await api.post('/payments/confirm', { paymentIntentId });
  return response;
};

/**
 * Get payment by ID
 * @param {string} id - Payment ID
 * @returns {Promise<Object>} Response with payment details
 */
export const getPaymentById = async (id) => {
  const response = await api.get(`/payments/${id}`);
  return response;
};

/**
 * Get all payments for the authenticated user
 * @param {Object} filters - Optional filters
 * @param {string} filters.status - Filter by status
 * @param {number} filters.limit - Limit number of results
 * @param {number} filters.offset - Offset for pagination
 * @returns {Promise<Object>} Response with payments array
 */
export const getUserPayments = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.status) params.append('status', filters.status);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.offset) params.append('offset', filters.offset);

  const queryString = params.toString();
  const url = queryString ? `/payments?${queryString}` : '/payments';

  const response = await api.get(url);
  return response;
};

/**
 * Download invoice PDF
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Blob>} PDF blob
 */
export const downloadInvoice = async (paymentId) => {
  const response = await api.get(`/payments/${paymentId}/invoice`, {
    responseType: 'blob',
  });

  // Create a download link
  const url = window.URL.createObjectURL(new Blob([response]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `invoice-${paymentId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return response;
};
