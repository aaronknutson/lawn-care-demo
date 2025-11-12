import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  XMarkIcon,
  PencilIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import { getCustomerProfile, addCustomerNote } from '../../services/adminCustomerService';

export default function CustomerDetailModal({ customer, onClose, onEdit, onRefresh }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [noteText, setNoteText] = useState('');
  const queryClient = useQueryClient();

  // Fetch detailed customer profile
  const { data, isLoading } = useQuery({
    queryKey: ['customer-profile', customer.id],
    queryFn: () => getCustomerProfile(customer.id),
    enabled: activeTab !== 'overview', // Only fetch if viewing other tabs
  });

  const customerProfile = data?.data?.customer;
  const stats = data?.data?.stats || {};

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: (note) => addCustomerNote(customer.id, note),
    onSuccess: () => {
      setNoteText('');
      queryClient.invalidateQueries(['customer-profile', customer.id]);
      if (onRefresh) onRefresh();
      alert('Note added successfully');
    },
    onError: (error) => {
      alert('Failed to add note: ' + (error.response?.data?.message || error.message));
    },
  });

  const handleAddNote = () => {
    if (noteText.trim()) {
      addNoteMutation.mutate(noteText);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'appointments', name: 'Appointments' },
    { id: 'payments', name: 'Payments' },
    { id: 'notes', name: 'Notes & Communication' },
  ];

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-gray-100 text-gray-800',
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusClasses[status] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center text-white text-lg font-bold">
                  {customer.firstName?.charAt(0)}
                  {customer.lastName?.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </h3>
                  <div className="mt-1 flex items-center gap-3">
                    {getStatusBadge(customer.status)}
                    <span className="text-sm text-gray-500">
                      Customer since {new Date(customer.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(customer)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="px-6 py-4 max-h-96 overflow-y-auto">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Total Appointments</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {customer.appointmentCount || 0}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Lifetime Value</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${parseFloat(customer.lifetimeValue || 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-500">Next Appointment</div>
                    <div className="text-sm font-medium text-gray-900">
                      {customer.nextAppointment
                        ? new Date(customer.nextAppointment).toLocaleDateString()
                        : 'None scheduled'}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span>{customer.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span>{customer.phone || 'No phone number'}</span>
                    </div>
                  </div>
                </div>

                {/* Properties */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Properties</h4>
                  {customer.properties && customer.properties.length > 0 ? (
                    <div className="space-y-2">
                      {customer.properties.map((property) => (
                        <div
                          key={property.id}
                          className="bg-gray-50 rounded-lg p-3 flex items-start"
                        >
                          <MapPinIcon className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {property.address}
                            </div>
                            <div className="text-sm text-gray-500">
                              {property.city}, {property.state} {property.zipCode}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              Lot Size: {property.lotSize?.toLocaleString()} sq ft
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No properties on file</p>
                  )}
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : customerProfile?.appointments && customerProfile.appointments.length > 0 ? (
                  <div className="space-y-3">
                    {customerProfile.appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="h-5 w-5 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {new Date(appointment.scheduledDate).toLocaleDateString()} at{' '}
                              {appointment.scheduledTime}
                            </span>
                          </div>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <strong>{appointment.servicePackage?.name}</strong> - {appointment.frequency}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {appointment.property?.address}, {appointment.property?.city},{' '}
                          {appointment.property?.state}
                        </div>
                        <div className="text-sm font-medium text-gray-900 mt-2">
                          ${parseFloat(appointment.totalPrice).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">No appointments found</p>
                )}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : (
                  <>
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-500">Total Spent</div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${parseFloat(stats.totalSpent || 0).toFixed(2)}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-500">Average Order Value</div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${parseFloat(stats.averageOrderValue || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Payment List */}
                    {customerProfile?.payments && customerProfile.payments.length > 0 ? (
                      <div className="space-y-3">
                        {customerProfile.payments.map((payment) => (
                          <div
                            key={payment.id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                                <span className="font-medium text-gray-900">
                                  ${parseFloat(payment.amount).toFixed(2)}
                                </span>
                              </div>
                              {getStatusBadge(payment.status)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {payment.paymentMethod} •{' '}
                              {new Date(payment.createdAt).toLocaleDateString()}
                            </div>
                            {payment.appointment && (
                              <div className="text-xs text-gray-500 mt-1">
                                Service Date:{' '}
                                {new Date(payment.appointment.scheduledDate).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-12">No payments found</p>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                {/* Add Note Form */}
                <div>
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
                    Add Communication Note
                  </label>
                  <textarea
                    id="note"
                    rows={3}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter note about customer interaction..."
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!noteText.trim() || addNoteMutation.isLoading}
                    className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addNoteMutation.isLoading ? 'Adding...' : 'Add Note'}
                  </button>
                </div>

                {/* Notes List */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : customerProfile?.notes && customerProfile.notes.length > 0 ? (
                  <div className="space-y-3">
                    {customerProfile.notes.reverse().map((note) => (
                      <div key={note.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{note.note}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Added on {new Date(note.addedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-8">No notes yet</p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
