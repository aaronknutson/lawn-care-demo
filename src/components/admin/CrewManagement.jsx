import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import {
  getAllCrewMembers,
  createCrewMember,
  updateCrewMember,
  deleteCrewMember,
} from '../../services/adminServiceManagement';

export default function CrewManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    role: 'technician',
    isActive: true,
    hireDate: '',
    photoUrl: '',
  });

  const queryClient = useQueryClient();

  // Fetch crew members
  const { data, isLoading } = useQuery({
    queryKey: ['admin-crew-members'],
    queryFn: getAllCrewMembers,
  });

  const crewMembers = data?.data || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createCrewMember,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-crew-members']);
      resetForm();
      alert('Crew member created successfully');
    },
    onError: (error) => {
      alert('Failed to create crew member: ' + (error.response?.data?.message || error.message));
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => updateCrewMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-crew-members']);
      resetForm();
      alert('Crew member updated successfully');
    },
    onError: (error) => {
      alert('Failed to update crew member: ' + (error.response?.data?.message || error.message));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCrewMember,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-crew-members']);
      alert('Crew member deleted successfully');
    },
    onError: (error) => {
      alert('Failed to delete crew member: ' + (error.response?.data?.message || error.message));
    },
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      role: 'technician',
      isActive: true,
      hireDate: '',
      photoUrl: '',
    });
    setEditingMember(null);
    setIsFormOpen(false);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      phone: member.phone || '',
      email: member.email || '',
      role: member.role,
      isActive: member.isActive,
      hireDate: member.hireDate ? new Date(member.hireDate).toISOString().split('T')[0] : '',
      photoUrl: member.photoUrl || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this crew member?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Crew Members</h3>
          <p className="text-sm text-gray-500">Manage your lawn care team members</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Crew Member
        </button>
      </div>

      {/* Crew Members Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {crewMembers.map((member) => (
          <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center flex-1">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center text-white text-lg font-bold">
                  {member.firstName?.charAt(0)}
                  {member.lastName?.charAt(0)}
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {member.firstName} {member.lastName}
                  </h4>
                  <p className="text-sm text-gray-500">{member.role}</p>
                </div>
              </div>
              <div className="flex items-center">
                {member.isActive ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" title="Active" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-gray-400" title="Inactive" />
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4 text-sm text-gray-600">
              {member.email && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Email:</span>
                  <span>{member.email}</span>
                </div>
              )}
              {member.phone && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Phone:</span>
                  <span>{member.phone}</span>
                </div>
              )}
              {member.hireDate && (
                <div className="flex items-center">
                  <span className="font-medium mr-2">Hired:</span>
                  <span>{new Date(member.hireDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEdit(member)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {crewMembers.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No crew members yet. Click "Add Crew Member" to create one.
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => resetForm()}>
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingMember ? 'Edit Crew Member' : 'Add Crew Member'}
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role *</label>
                      <input
                        type="text"
                        required
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g., Technician, Supervisor, Manager"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hire Date</label>
                      <input
                        type="date"
                        value={formData.hireDate}
                        onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Active
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="submit"
                    disabled={createMutation.isLoading || updateMutation.isLoading}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {createMutation.isLoading || updateMutation.isLoading
                      ? 'Saving...'
                      : editingMember
                      ? 'Update'
                      : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
