import { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import ServiceCard from './ServiceCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { getServicePackages, getAddOnServices } from '../../services/serviceService';
import { calculateFullPriceBreakdown } from '../../utils/priceCalculator';

/**
 * ServiceSelector component manages selection of service packages and add-ons
 * @param {Object} props
 * @param {number} props.lotSize - Property lot size in square feet
 * @param {Object} props.selectedPackage - Currently selected package
 * @param {Array} props.selectedAddOns - Currently selected add-on services
 * @param {Function} props.onPackageSelect - Callback when package is selected
 * @param {Function} props.onAddOnToggle - Callback when add-on is toggled
 * @param {boolean} props.showPriceSummary - Whether to show price summary
 */
function ServiceSelector({
  lotSize = 5000,
  selectedPackage = null,
  selectedAddOns = [],
  onPackageSelect,
  onAddOnToggle,
  showPriceSummary = true,
}) {
  const [packages, setPackages] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch service packages and add-ons on mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const [packagesResponse, addOnsResponse] = await Promise.all([
          getServicePackages(),
          getAddOnServices(),
        ]);

        if (packagesResponse.success) {
          setPackages(packagesResponse.data);
        }

        if (addOnsResponse.success) {
          setAddOns(addOnsResponse.data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Calculate price breakdown
  const priceBreakdown = selectedPackage
    ? calculateFullPriceBreakdown(selectedPackage, lotSize, selectedAddOns)
    : null;

  // Handle add-on checkbox toggle
  const handleAddOnToggle = (addOn) => {
    if (onAddOnToggle) {
      onAddOnToggle(addOn);
    }
  };

  // Check if add-on is selected
  const isAddOnSelected = (addOnId) => {
    return selectedAddOns.some((addOn) => addOn.id === addOnId);
  };

  if (loading) {
    return <LoadingSpinner text="Loading services..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-800">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Service Packages Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Service Package
        </h2>
        <p className="text-gray-600 mb-6">
          Select the package that best fits your lawn care needs
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <ServiceCard
              key={pkg.id}
              servicePackage={pkg}
              isSelected={selectedPackage?.id === pkg.id}
              onSelect={onPackageSelect}
              lotSize={lotSize}
              calculatedPrice={
                selectedPackage?.id === pkg.id && priceBreakdown
                  ? priceBreakdown.packagePrice
                  : null
              }
            />
          ))}
        </div>
      </div>

      {/* Add-on Services Section */}
      {selectedPackage && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Add Extra Services
          </h2>
          <p className="text-gray-600 mb-6">
            Enhance your lawn care with these additional services (optional)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {addOns.map((addOn) => {
              const isSelected = isAddOnSelected(addOn.id);

              return (
                <div
                  key={addOn.id}
                  className={`
                    relative rounded-lg border-2 p-4 cursor-pointer transition-all duration-200
                    ${isSelected
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 bg-white hover:border-primary-300'
                    }
                  `}
                  onClick={() => handleAddOnToggle(addOn)}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleAddOnToggle(addOn);
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className="flex items-center h-6">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleAddOnToggle(addOn)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-900">{addOn.name}</h3>
                        <span className="font-bold text-primary-600 whitespace-nowrap">
                          ${parseFloat(addOn.price).toFixed(0)}
                        </span>
                      </div>
                      {addOn.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {addOn.description}
                        </p>
                      )}
                      {addOn.category === 'seasonal' && (
                        <span className="inline-block mt-2 text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                          Seasonal
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Summary */}
      {showPriceSummary && priceBreakdown && (
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Price Summary
          </h3>

          <div className="space-y-3">
            {/* Package price */}
            <div className="flex justify-between items-center">
              <div>
                <span className="text-gray-700">{selectedPackage.name}</span>
                {priceBreakdown.multiplier !== 1.0 && (
                  <span className="text-sm text-gray-500 ml-2">
                    ({priceBreakdown.lotSizeCategory} lot)
                  </span>
                )}
              </div>
              <span className="font-semibold text-gray-900">
                {priceBreakdown.formatted.packagePrice}
              </span>
            </div>

            {/* Add-ons */}
            {selectedAddOns.length > 0 && (
              <div className="border-t border-gray-200 pt-3 space-y-2">
                {selectedAddOns.map((addOn) => (
                  <div key={addOn.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">{addOn.name}</span>
                    <span className="text-gray-900">
                      ${parseFloat(addOn.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-primary-600">
                {priceBreakdown.formatted.grandTotal}
              </span>
            </div>

            <p className="text-sm text-gray-500 text-center mt-2">
              Price per visit
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceSelector;
