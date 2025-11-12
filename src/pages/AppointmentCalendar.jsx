import { useState, useMemo, useCallback } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { format, parse, startOfWeek, getDay, addDays } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getAllAppointments, rescheduleAppointment } from '../services/appointmentService';
import { getWeatherForecast } from '../services/weatherService';
import AppointmentDetailModal from '../components/admin/AppointmentDetailModal';
import RescheduleModal from '../components/admin/RescheduleModal';
import WeatherWidget from '../components/admin/WeatherWidget';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

const DnDCalendar = withDragAndDrop(Calendar);

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function AppointmentCalendar() {
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch appointments
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: () => getAllAppointments(),
  });

  // Reschedule mutation
  const rescheduleMutation = useMutation({
    mutationFn: ({ id, scheduledDate, scheduledTime }) =>
      rescheduleAppointment(id, { scheduledDate, scheduledTime }),
    onSuccess: () => {
      queryClient.invalidateQueries(['appointments']);
      toast.success('Appointment rescheduled successfully!');
      setShowRescheduleModal(false);
      setShowDetailModal(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reschedule appointment');
    },
  });

  // Convert appointments to calendar events
  const events = useMemo(() => {
    if (!appointments || !Array.isArray(appointments)) {
      return [];
    }

    const parsedEvents = appointments
      .filter(apt => statusFilter === 'all' || apt.status === statusFilter)
      .map(appointment => {
        try {
          // Parse time
          if (!appointment.scheduledTime) {
            return null;
          }

          const [hours, minutes] = appointment.scheduledTime.split(/[: ]/);
          const isPM = appointment.scheduledTime.includes('PM');
          let hour = parseInt(hours);
          if (isPM && hour !== 12) hour += 12;
          if (!isPM && hour === 12) hour = 0;

          // Parse date in local timezone to avoid day-shift issues
          if (!appointment.scheduledDate) {
            return null;
          }

          let dateStr = String(appointment.scheduledDate);

          // Handle ISO timestamp format (e.g., "2024-01-15T00:00:00.000Z")
          if (dateStr.includes('T')) {
            dateStr = dateStr.split('T')[0];
          }

          // Split and parse date components
          const dateParts = dateStr.split('-');
          if (dateParts.length !== 3) {
            console.error('Invalid date format:', dateStr);
            return null;
          }

          const year = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]);
          const day = parseInt(dateParts[2]);

          if (isNaN(year) || isNaN(month) || isNaN(day)) {
            return null;
          }

          // Create date in local timezone
          const startDate = new Date(year, month - 1, day, hour, parseInt(minutes), 0);

          if (isNaN(startDate.getTime())) {
            return null;
          }

          const endDate = new Date(startDate);
          endDate.setHours(hour + 2, parseInt(minutes), 0); // Default 2-hour duration

          return {
            id: appointment.id,
            title: `${appointment.user?.firstName} ${appointment.user?.lastName} - ${appointment.servicePackage?.name || 'Service'}`,
            start: startDate,
            end: endDate,
            resource: appointment,
          };
        } catch (error) {
          console.error('Error parsing appointment:', error);
          return null;
        }
      })
      .filter(event => event !== null); // Remove any failed parsings

    return parsedEvents;
  }, [appointments, statusFilter]);

  // Event style getter
  const eventStyleGetter = (event) => {
    const status = event.resource.status;
    const colors = {
      scheduled: { backgroundColor: '#3b82f6', borderColor: '#2563eb' },
      'in-progress': { backgroundColor: '#eab308', borderColor: '#ca8a04' },
      completed: { backgroundColor: '#22c55e', borderColor: '#16a34a' },
      cancelled: { backgroundColor: '#ef4444', borderColor: '#dc2626' },
      rescheduled: { backgroundColor: '#a855f7', borderColor: '#9333ea' },
    };

    return {
      style: {
        backgroundColor: colors[status]?.backgroundColor || '#6b7280',
        borderColor: colors[status]?.borderColor || '#4b5563',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: '6px',
        color: 'white',
        fontSize: '0.875rem',
        padding: '2px 5px',
      }
    };
  };

  // Handle event click
  const handleSelectEvent = useCallback((event) => {
    setSelectedAppointment(event.resource);
    setShowDetailModal(true);
  }, []);

  // Handle event drop (drag and drop rescheduling)
  const handleEventDrop = useCallback(({ event, start, end }) => {
    // Use local date components to avoid timezone issues
    const year = start.getFullYear();
    const month = String(start.getMonth() + 1).padStart(2, '0');
    const day = String(start.getDate()).padStart(2, '0');
    const newDate = `${year}-${month}-${day}`;

    const newTime = format(start, 'h:mm a');

    rescheduleMutation.mutate({
      id: event.id,
      scheduledDate: newDate,
      scheduledTime: newTime,
    });
  }, [rescheduleMutation]);

  // Handle reschedule from modal
  const handleReschedule = useCallback((appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailModal(false);
    setShowRescheduleModal(true);
  }, []);

  // Handle reschedule submit
  const handleRescheduleSubmit = useCallback((newDate, newTime) => {
    if (selectedAppointment) {
      rescheduleMutation.mutate({
        id: selectedAppointment.id,
        scheduledDate: newDate,
        scheduledTime: newTime,
      });
    }
  }, [selectedAppointment, rescheduleMutation]);

  // Handle slot select (create new appointment)
  const handleSelectSlot = useCallback((slotInfo) => {
    // Could implement creating new appointment here
    console.log('Slot selected:', slotInfo);
  }, []);

  // Stats
  const stats = useMemo(() => {
    if (!appointments) return { total: 0, scheduled: 0, completed: 0, cancelled: 0 };

    return {
      total: appointments.length,
      scheduled: appointments.filter(a => a.status === 'scheduled').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
    };
  }, [appointments]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-6 space-y-6">
        {/* Header with Weather */}
        <div className="flex justify-between items-start gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Appointment Calendar</h1>
            <p className="mt-2 text-gray-600">View, manage, and reschedule appointments</p>
          </div>
          <div className="w-80 flex-shrink-0">
            <WeatherWidget zipCode="78701" />
          </div>
        </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
            <span>Scheduled</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
            <span>Cancelled</span>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg shadow p-6" style={{ height: '700px' }}>
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
          onSelectSlot={handleSelectSlot}
          selectable
          resizable
          draggableAccessor={() => true}
          eventPropGetter={eventStyleGetter}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          popup
        />
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedAppointment && (
        <AppointmentDetailModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedAppointment(null);
          }}
          onReschedule={handleReschedule}
        />
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <RescheduleModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowRescheduleModal(false);
            setSelectedAppointment(null);
          }}
          onSubmit={handleRescheduleSubmit}
          isLoading={rescheduleMutation.isPending}
        />
      )}
      </div>
    </DndProvider>
  );
}

export default AppointmentCalendar;
