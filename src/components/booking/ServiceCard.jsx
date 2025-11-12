import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { formatPrice } from '../../utils/priceCalculator';

/**
 * ServiceCard component displays a service package with features and pricing
 * @param {Object} props
 * @param {Object} props.servicePackage - Service package object
 * @param {boolean} props.isSelected - Whether this service is selected
 * @param {Function} props.onSelect - Callback when service is selected
 * @param {number} props.lotSize - Current lot size for price calculation
 * @param {number} props.calculatedPrice - Pre-calculated price based on lot size
 * @param {string} props.className - Additional CSS classes
 */
function ServiceCard({
  servicePackage,
  isSelected = false,
  onSelect,
  lotSize = null,
  calculatedPrice = null,
  className = '',
}) {
  const { name, description, basePrice, features } = servicePackage;

  const displayPrice = calculatedPrice !== null ? calculatedPrice : parseFloat(basePrice);

  const handleClick = () => {
    if (onSelect) {
      onSelect(servicePackage);
    }
  };

  return (
    <div
      className={`
        relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200
        ${isSelected
          ? 'border-primary-600 bg-primary-50 shadow-lg'
          : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-md'
        }
        ${className}
      `}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Selected indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4">
          <CheckCircleIcon className="w-6 h-6 text-primary-600" />
        </div>
      )}

      {/* Package name */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 pr-8">{name}</h3>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">{description}</p>

      {/* Price */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-primary-600">
            {formatPrice(displayPrice)}
          </span>
          <span className="text-gray-500 text-sm">/visit</span>
        </div>
        {calculatedPrice !== null && calculatedPrice !== parseFloat(basePrice) && (
          <p className="text-xs text-gray-500 mt-1">
            Base price: {formatPrice(basePrice)} (adjusted for lot size)
          </p>
        )}
      </div>

      {/* Features list */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700 mb-3">Includes:</p>
        <ul className="space-y-2">
          {features && features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircleIcon className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Select button for mobile/accessibility */}
      {!isSelected && (
        <button
          type="button"
          className="mt-6 w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors duration-200 font-medium"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          Select Package
        </button>
      )}

      {isSelected && (
        <div className="mt-6 w-full bg-primary-600 text-white py-2 px-4 rounded-md text-center font-medium">
          Selected
        </div>
      )}
    </div>
  );
}

export default ServiceCard;
