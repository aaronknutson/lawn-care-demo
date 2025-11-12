import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

function RescheduleModal({ appointment, onClose, onSubmit, isLoading }) {
  const [newDate, setNewDate] = useState(appointment.scheduledDate);
  const [newTime, setNewTime] = useState(appointment.scheduledTime);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newDate, newTime);
  };

  // Generate time slots (9 AM to 6 PM in 30-minute intervals)
  const timeSlots = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 18 && minute > 0) break; // Stop at 6:00 PM

      const isPM = hour >= 12;
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const displayMinute = minute.toString().padStart(2, '0');
      const period = isPM ? 'PM' : 'AM';

      timeSlots.push(`${displayHour}:${displayMinute} ${period}`);
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Reschedule Appointment</h2>
              <p className="text-blue-100 mt-1">
                {appointment.user?.firstName} {appointment.user?.lastName}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Schedule */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Current Schedule:</p>
            <div className="flex items-center text-gray-900">
              <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
              <span>{format(new Date(appointment.scheduledDate), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center text-gray-900 mt-1">
              <ClockIcon className="h-5 w-5 mr-2 text-blue-600" />
              <span>{appointment.scheduledTime}</span>
            </div>
          </div>

          {/* New Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                required
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <CalendarIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* New Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Time
            </label>
            <div className="relative">
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
                <option value="">Select a time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              <ClockIcon className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
              <svg
                className="absolute right-3 top-4 h-5 w-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Service Package Info */}
          {appointment.servicePackage && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-sm font-medium text-blue-900">
                Service: {appointment.servicePackage.name}
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Estimated duration: 2 hours
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !newDate || !newTime}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Rescheduling...
                </span>
              ) : (
                'Reschedule Appointment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RescheduleModal;
