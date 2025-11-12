import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import {
  getAllServicePackages,
  createServicePackage,
  updateServicePackage,
  deleteServicePackage,
} from '../../services/adminServiceManagement';

export default function ServicePackageManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    features: [],
    isActive: true,
    sortOrder: 0,
  });
  const [featureInput, setFeatureInput] = useState('');

  const queryClient = useQueryClient();

  // Fetch packages
  const { data, isLoading } = useQuery({
    queryKey: ['admin-service-packages'],
    queryFn: getAllServicePackages,
  });

  const packages = data?.data || [];

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createServicePackage,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-service-packages']);
      resetForm();
      alert('Service package created successfully');
    },
    onError: (error) => {
      alert('Failed to create package: ' + (error.response?.data?.message || error.message));
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => updateServicePackage(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-service-packages']);
      resetForm();
      alert('Service package updated successfully');
    },
    onError: (error) => {
      alert('Failed to update package: ' + (error.response?.data?.message || error.message));
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteServicePackage,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-service-packages']);
      alert('Service package deleted successfully');
    },
    onError: (error) => {
      alert('Failed to delete package: ' + (error.response?.data?.message || error.message));
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      basePrice: '',
      features: [],
      isActive: true,
      sortOrder: 0,
    });
    setFeatureInput('');
    setEditingPackage(null);
    setIsFormOpen(false);
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description,
      basePrice: pkg.basePrice,
      features: pkg.features || [],
      isActive: pkg.isActive,
      sortOrder: pkg.sortOrder || 0,
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this service package?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingPackage) {
      updateMutation.mutate({ id: editingPackage.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()],
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
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
          <h3 className="text-lg font-medium text-gray-900">Service Packages</h3>
          <p className="text-sm text-gray-500">Manage your lawn care service packages</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Package
        </button>
      </div>

      {/* Package List */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">{pkg.name}</h4>
                <p className="text-sm text-gray-500 mt-1">{pkg.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {pkg.isActive ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" title="Active" />
                ) : (
                  <XCircleIcon className="h-5 w-5 text-gray-400" title="Inactive" />
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-2xl font-bold text-primary-600">${pkg.basePrice}</div>
              <div className="text-sm text-gray-500">Starting price</div>
            </div>

            {pkg.features && pkg.features.length > 0 && (
              <ul className="space-y-1 mb-4">
                {pkg.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-primary-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
                {pkg.features.length > 3 && (
                  <li className="text-xs text-gray-400">+{pkg.features.length - 3} more features</li>
                )}
              </ul>
            )}

            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEdit(pkg)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(pkg.id)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {packages.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No service packages yet. Click "Add Package" to create one.
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
                    {editingPackage ? 'Edit Service Package' : 'Create Service Package'}
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
                      <label className="block text-sm font-medium text-gray-700">Description *</label>
                      <textarea
                        required
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Base Price *</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          required
                          step="0.01"
                          min="0"
                          value={formData.basePrice}
                          onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                          className="block w-full pl-7 border border-gray-300 rounded-md py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={featureInput}
                          onChange={(e) => setFeatureInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                          placeholder="Enter feature"
                          className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <button
                          type="button"
                          onClick={addFeature}
                          className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                        >
                          Add
                        </button>
                      </div>
                      {formData.features.length > 0 && (
                        <ul className="space-y-1">
                          {formData.features.map((feature, index) => (
                            <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                              <span className="text-sm text-gray-700">{feature}</span>
                              <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
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
                      : editingPackage
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
