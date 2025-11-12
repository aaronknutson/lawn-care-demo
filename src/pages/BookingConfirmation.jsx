import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';

function BookingConfirmation() {
  const location = useLocation();
  const booking = location.state?.booking;

  useEffect(() => {
    // Clear any saved form data
    localStorage.removeItem('bookingFormData');
  }, []);

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No booking found</h2>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-lg text-gray-600">
            Your lawn care service has been successfully booked
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          <div className="bg-primary-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Booking Details</h2>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Booking ID */}
            <div>
              <p className="text-sm text-gray-500">Booking ID</p>
              <p className="text-lg font-semibold text-gray-900">{booking.id}</p>
            </div>

            {/* Service Package */}
            <div>
              <p className="text-sm text-gray-500">Service Package</p>
              <p className="text-lg font-semibold text-gray-900">
                {booking.servicePackage?.name || 'Service Package'}
              </p>
              {booking.servicePackage?.description && (
                <p className="text-sm text-gray-600 mt-1">
                  {booking.servicePackage.description}
                </p>
              )}
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Scheduled Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(booking.scheduledDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Scheduled Time</p>
                <p className="text-lg font-semibold text-gray-900">{booking.scheduledTime}</p>
              </div>
            </div>

            {/* Frequency */}
            <div>
              <p className="text-sm text-gray-500">Service Frequency</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{booking.frequency}</p>
            </div>

            {/* Property Address */}
            {booking.property && (
              <div>
                <p className="text-sm text-gray-500">Property Address</p>
                <p className="text-lg font-semibold text-gray-900">{booking.property.address}</p>
                <p className="text-gray-600">
                  {booking.property.city}, {booking.property.state} {booking.property.zipCode}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Lot size: {booking.property.lotSize?.toLocaleString()} sq ft
                </p>
              </div>
            )}

            {/* Special Instructions */}
            {booking.specialInstructions && (
              <div>
                <p className="text-sm text-gray-500">Special Instructions</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-md mt-1">
                  {booking.specialInstructions}
                </p>
              </div>
            )}

            {/* Total Price */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-900">Total Price</p>
                <p className="text-3xl font-bold text-primary-600">
                  ${parseFloat(booking.totalPrice).toFixed(2)}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Payment will be processed after service completion
              </p>
            </div>
          </div>
        </div>

        {/* What's Next Card */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                  1
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Confirmation Email</p>
                <p className="text-sm text-gray-600">
                  You'll receive a confirmation email with all the details
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                  2
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Reminder</p>
                <p className="text-sm text-gray-600">
                  We'll send you a reminder 24 hours before your appointment
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                  3
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Service Day</p>
                <p className="text-sm text-gray-600">
                  Our professional crew will arrive at the scheduled time
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-600">
                  4
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Payment</p>
                <p className="text-sm text-gray-600">
                  Payment will be processed after service completion
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Return to Homepage
          </Link>
          <Link
            to="/booking"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Book Another Service
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="mb-2">Need to make changes to your booking?</p>
          <p>
            Contact us at{' '}
            <a href="tel:5125555296" className="text-primary-600 hover:text-primary-700 font-medium">
              (512) 555-LAWN
            </a>{' '}
            or{' '}
            <a
              href="mailto:info@greenscapelawn.com"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              info@greenscapelawn.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;
