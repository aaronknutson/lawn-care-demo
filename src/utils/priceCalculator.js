/**
 * Price calculator utility functions for lawn care services
 */

/**
 * Determine lot size category based on square footage
 * @param {number} lotSize - Lot size in square feet
 * @returns {string} Size category (small, medium, large, xlarge)
 */
export const getLotSizeCategory = (lotSize) => {
  if (lotSize < 5000) return 'small';
  if (lotSize < 10000) return 'medium';
  if (lotSize < 15000) return 'large';
  return 'xlarge';
};

/**
 * Get the price multiplier for a given lot size
 * @param {number} lotSize - Lot size in square feet
 * @param {Object} pricingTiers - Pricing tiers object from service package
 * @returns {number} Price multiplier
 */
export const getPriceMultiplier = (lotSize, pricingTiers) => {
  const category = getLotSizeCategory(lotSize);
  return pricingTiers[category] || 1.0;
};

/**
 * Calculate package price with lot size multiplier
 * @param {number} basePrice - Base price of the package
 * @param {number} lotSize - Lot size in square feet
 * @param {Object} pricingTiers - Pricing tiers object from service package
 * @returns {number} Calculated package price
 */
export const calculatePackagePrice = (basePrice, lotSize, pricingTiers) => {
  const multiplier = getPriceMultiplier(lotSize, pricingTiers);
  return parseFloat(basePrice) * multiplier;
};

/**
 * Calculate total for add-on services
 * @param {Array} selectedAddOns - Array of selected add-on service objects
 * @returns {number} Total add-ons price
 */
export const calculateAddOnsTotal = (selectedAddOns) => {
  return selectedAddOns.reduce((total, addOn) => {
    return total + parseFloat(addOn.price || 0);
  }, 0);
};

/**
 * Calculate grand total price
 * @param {number} packagePrice - Calculated package price
 * @param {number} addOnsTotal - Total add-ons price
 * @returns {number} Grand total
 */
export const calculateGrandTotal = (packagePrice, addOnsTotal) => {
  return packagePrice + addOnsTotal;
};

/**
 * Format price as currency
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Calculate full price breakdown
 * @param {Object} servicePackage - Selected service package
 * @param {number} lotSize - Lot size in square feet
 * @param {Array} selectedAddOns - Array of selected add-on services
 * @returns {Object} Complete price breakdown
 */
export const calculateFullPriceBreakdown = (servicePackage, lotSize, selectedAddOns = []) => {
  if (!servicePackage || !lotSize) {
    return {
      packagePrice: 0,
      addOnsTotal: 0,
      grandTotal: 0,
      multiplier: 1.0,
      lotSizeCategory: 'small',
    };
  }

  const multiplier = getPriceMultiplier(lotSize, servicePackage.pricingTiers);
  const packagePrice = calculatePackagePrice(
    servicePackage.basePrice,
    lotSize,
    servicePackage.pricingTiers
  );
  const addOnsTotal = calculateAddOnsTotal(selectedAddOns);
  const grandTotal = calculateGrandTotal(packagePrice, addOnsTotal);

  return {
    packagePrice,
    addOnsTotal,
    grandTotal,
    multiplier,
    lotSizeCategory: getLotSizeCategory(lotSize),
    formatted: {
      packagePrice: formatPrice(packagePrice),
      addOnsTotal: formatPrice(addOnsTotal),
      grandTotal: formatPrice(grandTotal),
    },
  };
};
