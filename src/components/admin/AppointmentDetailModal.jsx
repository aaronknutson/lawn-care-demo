import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { completeAppointment, uploadAppointmentPhotos } from '../../services/appointmentService';
import { getWeatherForecast } from '../../services/weatherService';
import { format } from 'date-fns';

function AppointmentDetailModal({ appointment, onClose, onReschedule }) {
  const queryClient = useQueryClient();
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [completionData, setCompletionData] = useState({
    completionNotes: '',
    actualDuration: '',
    weatherCondition: '',
  });
  const [photoFiles, setPhotoFiles] = useState({
    beforePhotos: [],
    afterPhotos: [],
  });

  // Fetch weather forecast for the appointment
  const { data: weatherData } = useQuery({
    queryKey: ['weather', appointment.scheduledDate, appointment.property?.zipCode],
    queryFn: () => {
      if (appointment.property?.zipCode && appointment.scheduledDate) {
        const dateStr = format(new Date(appointment.scheduledDate), 'yyyy-MM-dd');
        return getWeatherForecast(dateStr, appointment.property.zipCode);
      }
      return null;
    },
    enabled: !!(appointment.property?.zipCode && appointment.scheduledDate),
    retry: 1,
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });

  const completeMutation = useMutation({
    mutationFn: (data) => completeAppointment(appointment.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      onClose();
    },
  });

  const uploadPhotosMutation = useMutation({
    mutationFn: (formData) => uploadAppointmentPhotos(appointment.id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      setPhotoFiles({ beforePhotos: [], afterPhotos: [] });
    },
  });

  const handleComplete = () => {
    completeMutation.mutate(completionData);
  };

  const handlePhotoUpload = (e) => {
    e.preventDefault();
    const formData = new FormData();

    photoFiles.beforePhotos.forEach(file => {
      formData.append('beforePhotos', file);
    });

    photoFiles.afterPhotos.forEach(file => {
      formData.append('afterPhotos', file);
    });

    uploadPhotosMutation.mutate(formData);
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      scheduled: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      rescheduled: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Appointment Details</h2>
              <p className="text-primary-100 mt-1">
                {format(new Date(appointment.scheduledDate), 'EEEE, MMMM d, yyyy')} at {appointment.scheduledTime}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status and Actions */}
          <div className="flex justify-between items-center">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(appointment.status)}`}>
              {appointment.status}
            </span>
            {appointment.status === 'scheduled' && (
              <div className="space-x-2">
                <button
                  onClick={() => onReschedule(appointment)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Reschedule
                </button>
                <button
                  onClick={() => setShowCompleteForm(!showCompleteForm)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Mark Complete
                </button>
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{appointment.user?.firstName} {appointment.user?.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{appointment.user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{appointment.user?.phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Property Info */}
          {appointment.property && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Property Details
              </h3>
              <div className="space-y-2">
                <p className="font-medium">{appointment.property.address}</p>
                <p className="text-gray-600">{appointment.property.city}, {appointment.property.state} {appointment.property.zipCode}</p>
                <p className="text-sm text-gray-500">Lot Size: {appointment.property.lotSize} sq ft</p>
              </div>
            </div>
          )}

          {/* Service Info */}
          {appointment.servicePackage && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Service Package
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-lg">{appointment.servicePackage.name}</p>
                <p className="text-gray-600">{appointment.servicePackage.description}</p>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-gray-600">Total Price</span>
                  <span className="text-2xl font-bold text-primary-600">${appointment.totalPrice}</span>
                </div>
              </div>
            </div>
          )}

          {/* Special Instructions */}
          {appointment.specialInstructions && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Special Instructions</h3>
              <p className="text-gray-700">{appointment.specialInstructions}</p>
            </div>
          )}

          {/* Weather Forecast */}
          {weatherData && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                Weather Forecast
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-gray-600">Condition</p>
                  <p className="font-medium text-gray-900 flex items-center">
                    {weatherData.icon && (
                      <img
                        src={`https://openweathermap.org/img/wn/${weatherData.icon}@2x.png`}
                        alt={weatherData.description}
                        className="w-8 h-8 -ml-2"
                      />
                    )}
                    {weatherData.condition}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{weatherData.description}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Temperature</p>
                  <p className="font-medium text-gray-900">{weatherData.temperature}°F</p>
                  <p className="text-xs text-gray-500">Feels like {weatherData.feelsLike}°F</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Humidity</p>
                  <p className="font-medium text-gray-900">{weatherData.humidity}%</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Wind</p>
                  <p className="font-medium text-gray-900">{weatherData.windSpeed} mph</p>
                </div>
              </div>
              {(weatherData.condition === 'Rain' || weatherData.condition === 'Drizzle' || weatherData.condition === 'Thunderstorm') && (
                <div className="mt-2 text-xs text-yellow-700 bg-yellow-100 px-3 py-2 rounded">
                  ⚠️ Rain expected - may need to reschedule or bring rain gear
                </div>
              )}
            </div>
          )}

          {/* Completion Form */}
          {showCompleteForm && appointment.status === 'scheduled' && (
            <div className="bg-green-50 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-gray-900 mb-3">Complete Appointment</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Completion Notes</label>
                <textarea
                  value={completionData.completionNotes}
                  onChange={(e) => setCompletionData({ ...completionData, completionNotes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="Add any notes about the completed work..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={completionData.actualDuration}
                    onChange={(e) => setCompletionData({ ...completionData, actualDuration: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                    placeholder="90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weather Condition</label>
                  <select
                    value={completionData.weatherCondition}
                    onChange={(e) => setCompletionData({ ...completionData, weatherCondition: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500">
                    <option value="">Select...</option>
                    <option value="Sunny">Sunny</option>
                    <option value="Cloudy">Cloudy</option>
                    <option value="Rainy">Rainy</option>
                    <option value="Windy">Windy</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleComplete}
                disabled={completeMutation.isPending}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                {completeMutation.isPending ? 'Completing...' : 'Complete Appointment'}
              </button>
            </div>
          )}

          {/* Photo Upload */}
          {appointment.status === 'completed' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Upload Photos</h3>
              <form onSubmit={handlePhotoUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Before Photos</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setPhotoFiles({ ...photoFiles, beforePhotos: Array.from(e.target.files) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">After Photos</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setPhotoFiles({ ...photoFiles, afterPhotos: Array.from(e.target.files) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploadPhotosMutation.isPending || (!photoFiles.beforePhotos.length && !photoFiles.afterPhotos.length)}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50">
                  {uploadPhotosMutation.isPending ? 'Uploading...' : 'Upload Photos'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AppointmentDetailModal;
