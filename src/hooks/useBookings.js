import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  getUserProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getUserPayments,
  getPaymentById,
  createPaymentIntent,
  confirmPayment,
} from '../services/bookingService';

// ==================== Booking Hooks ====================

/**
 * Hook to fetch all bookings for the authenticated user
 * @param {Object} filters - Optional filters (status, startDate, endDate, limit, offset)
 * @param {Object} options - React Query options
 */
export const useBookings = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => getAllBookings(filters),
    ...options,
  });
};

/**
 * Hook to fetch a single booking by ID
 * @param {string} id - Booking ID
 * @param {Object} options - React Query options
 */
export const useBooking = (id, options = {}) => {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => getBookingById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to create a new booking
 */
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      // Invalidate and refetch bookings
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

/**
 * Hook to update a booking
 */
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => updateBooking(id, updates),
    onSuccess: (data, variables) => {
      // Invalidate specific booking and all bookings
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

/**
 * Hook to cancel a booking
 */
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, cancellationReason }) => cancelBooking(id, cancellationReason),
    onSuccess: (data, variables) => {
      // Invalidate specific booking and all bookings
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

// ==================== Property Hooks ====================

/**
 * Hook to fetch all properties for the authenticated user
 * @param {Object} options - React Query options
 */
export const useProperties = (options = {}) => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: getUserProperties,
    ...options,
  });
};

/**
 * Hook to fetch a single property by ID
 * @param {string} id - Property ID
 * @param {Object} options - React Query options
 */
export const useProperty = (id, options = {}) => {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => getPropertyById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to create a new property
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      // Invalidate and refetch properties
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

/**
 * Hook to update a property
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }) => updateProperty(id, updates),
    onSuccess: (data, variables) => {
      // Invalidate specific property and all properties
      queryClient.invalidateQueries({ queryKey: ['properties', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

/**
 * Hook to delete a property
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      // Invalidate and refetch properties
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

// ==================== Payment Hooks ====================

/**
 * Hook to fetch all payments for the authenticated user
 * @param {Object} filters - Optional filters (status, limit, offset)
 * @param {Object} options - React Query options
 */
export const usePayments = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: ['payments', filters],
    queryFn: () => getUserPayments(filters),
    ...options,
  });
};

/**
 * Hook to fetch a single payment by ID
 * @param {string} id - Payment ID
 * @param {Object} options - React Query options
 */
export const usePayment = (id, options = {}) => {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: () => getPaymentById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to create a payment intent
 */
export const useCreatePaymentIntent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaymentIntent,
    onSuccess: () => {
      // Invalidate payments
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

/**
 * Hook to confirm a payment
 */
export const useConfirmPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: confirmPayment,
    onSuccess: () => {
      // Invalidate payments and bookings
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
