import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import {
  getAllAddOnServices,
  createAddOnService,
  updateAddOnService,
  deleteAddOnService,
} from '../../services/adminServiceManagement';

export default function AddOnServiceManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'addon',
    isActive: true,
    icon: '',
    sortOrder: 0,
  });

  const queryClient = useQueryClient();

  // Fetch services
  const { data, isLoading } = useQuery({
    queryKey: ['admin-addon-services'],
    queryFn: getAllAddOnServices,
  });

  const services = data?.data || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createAddOnService,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-addon-services']);
      resetForm();
      alert('Add-on service created successfully');
    },
    onError: (error) => {
      alert('Failed to create service: ' + (error.response?.data?.message || error.message));
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => updateAddOnService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-addon-services']);
      resetForm();
      alert('Add-on service updated successfully');
    },
    onError: (error) => {
      alert('Failed to update service: ' + (error.response?.data?.message || error.message));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAddOnService,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-addon-services']);
      alert('Add-on service deleted successfully');
    },
    onError: (error) => {
      alert('Failed to delete service: ' + (error.response?.data?.message || error.message));
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'addon',
      isActive: true,
      icon: '',
      sortOrder: 0,
    });
    setEditingService(null);
    setIsFormOpen(false);
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      category: service.category,
      isActive: service.isActive,
      icon: service.icon || '',
      sortOrder: service.sortOrder || 0,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this add-on service?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingService) {
      updateMutation.mutate({ id: editingService.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const getCategoryBadge = (category) => {
    const badges = {
      addon: 'bg-blue-100 text-blue-800',
      seasonal: 'bg-green-100 text-green-800',
      'one-time': 'bg-purple-100 text-purple-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badges[category] || 'bg-gray-100 text-gray-800'}`}>
        {category}
      </span>
    );
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
          <h3 className="text-lg font-medium text-gray-900">Add-On Services</h3>
          <p className="text-sm text-gray-500">Manage additional services customers can add to packages</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Service
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white shadow overflow-hidden rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No add-on services yet. Click "Add Service" to create one.
                </td>
              </tr>
            ) : (
              services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                    {service.description && (
                      <div className="text-sm text-gray-500">{service.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getCategoryBadge(service.category)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${service.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.isActive ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        <span className="text-sm">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-400">
                        <XCircleIcon className="h-5 w-5 mr-1" />
                        <span className="text-sm">Inactive</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
                    {editingService ? 'Edit Add-On Service' : 'Create Add-On Service'}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={2}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price *</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          required
                          step="0.01"
                          min="0"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="block w-full pl-7 border border-gray-300 rounded-md py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="addon">Add-On</option>
                        <option value="seasonal">Seasonal</option>
                        <option value="one-time">One-Time</option>
                      </select>
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
                      : editingService
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
