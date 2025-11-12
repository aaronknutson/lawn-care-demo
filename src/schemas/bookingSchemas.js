import { z } from 'zod';

// ==================== Property Schemas ====================

/**
 * Schema for creating a new property
 */
export const createPropertySchema = z.object({
  address: z.string()
    .min(1, 'Address is required')
    .max(255, 'Address must be less than 255 characters'),

  city: z.string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters'),

  state: z.string()
    .length(2, 'State must be a 2-letter code')
    .regex(/^[A-Z]{2}$/, 'State must be uppercase letters (e.g., CA, NY)'),

  zipCode: z.string()
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format (e.g., 12345 or 12345-6789)'),

  lotSize: z.number()
    .positive('Lot size must be a positive number')
    .min(100, 'Lot size must be at least 100 sq ft')
    .max(1000000, 'Lot size must be less than 1,000,000 sq ft'),

  specialInstructions: z.string()
    .max(1000, 'Special instructions must be less than 1000 characters')
    .optional()
    .nullable(),

  gateCode: z.string()
    .max(50, 'Gate code must be less than 50 characters')
    .optional()
    .nullable(),

  hasBackyard: z.boolean()
    .default(false),

  hasDogs: z.boolean()
    .default(false),

  isPrimary: z.boolean()
    .default(false)
    .optional(),
});

/**
 * Schema for updating a property (all fields optional)
 */
export const updatePropertySchema = createPropertySchema.partial();

// ==================== Booking Schemas ====================

/**
 * Schema for creating a new booking
 */
export const createBookingSchema = z.object({
  propertyId: z.string()
    .uuid('Invalid property ID format'),

  servicePackageId: z.string()
    .uuid('Invalid service package ID format'),

  scheduledDate: z.string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Scheduled date must be today or in the future')
    .refine((date) => {
      const selectedDate = new Date(date);
      return !isNaN(selectedDate.getTime());
    }, 'Invalid date format'),

  scheduledTime: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (use HH:MM)')
    .refine((time) => {
      const [hours] = time.split(':');
      const hour = parseInt(hours);
      return hour >= 8 && hour <= 18;
    }, 'Scheduled time must be between 8:00 AM and 6:00 PM'),

  frequency: z.enum(['one-time', 'weekly', 'bi-weekly', 'monthly'], {
    errorMap: () => ({ message: 'Frequency must be one of: one-time, weekly, bi-weekly, monthly' }),
  }),

  addOnServiceIds: z.array(z.string().uuid('Invalid add-on service ID format'))
    .default([])
    .optional(),

  specialInstructions: z.string()
    .max(1000, 'Special instructions must be less than 1000 characters')
    .optional()
    .nullable(),
});

/**
 * Schema for updating a booking
 */
export const updateBookingSchema = z.object({
  scheduledDate: z.string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Scheduled date must be today or in the future')
    .optional(),

  scheduledTime: z.string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (use HH:MM)')
    .optional(),

  frequency: z.enum(['one-time', 'weekly', 'bi-weekly', 'monthly'])
    .optional(),

  addOnServiceIds: z.array(z.string().uuid())
    .optional(),

  specialInstructions: z.string()
    .max(1000, 'Special instructions must be less than 1000 characters')
    .optional()
    .nullable(),

  status: z.enum(['scheduled', 'in-progress', 'completed', 'cancelled', 'rescheduled'])
    .optional(),
});

/**
 * Schema for cancelling a booking
 */
export const cancelBookingSchema = z.object({
  cancellationReason: z.string()
    .min(10, 'Cancellation reason must be at least 10 characters')
    .max(500, 'Cancellation reason must be less than 500 characters'),
});

// ==================== Payment Schemas ====================

/**
 * Schema for creating a payment intent
 */
export const createPaymentIntentSchema = z.object({
  appointmentId: z.string()
    .uuid('Invalid appointment ID format'),
});

/**
 * Schema for confirming a payment
 */
export const confirmPaymentSchema = z.object({
  paymentIntentId: z.string()
    .min(1, 'Payment intent ID is required'),
});

// ==================== Helper Functions ====================

/**
 * Validate data against a schema and return formatted errors
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {Object} data - Data to validate
 * @returns {Object} { success: boolean, data?: any, errors?: Object }
 */
export const validateSchema = (schema, data) => {
  try {
    const validData = schema.parse(data);
    return {
      success: true,
      data: validData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        formattedErrors[path] = err.message;
      });
      return {
        success: false,
        errors: formattedErrors,
      };
    }
    return {
      success: false,
      errors: { _general: 'Validation failed' },
    };
  }
};

/**
 * Safe parse function that returns both success status and data/errors
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {Object} data - Data to validate
 * @returns {Object} SafeParseReturnType
 */
export const safeValidate = (schema, data) => {
  return schema.safeParse(data);
};
