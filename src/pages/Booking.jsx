import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateBooking, useCreateProperty } from '../hooks/useBookings';
import { getUserProperties } from '../services/bookingService';
import AddressAutocomplete from '../components/common/AddressAutocomplete';
import api from '../services/api';

const STEPS = [
  { number: 1, name: 'Property' },
  { number: 2, name: 'Service' },
  { number: 3, name: 'Schedule' },
  { number: 4, name: 'Contact' },
  { number: 5, name: 'Review' },
];

function Booking() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    address: '', city: '', state: '', zipCode: '', lotSize: '', hasBackyard: false, hasDogs: false, gateCode: '',
    servicePackageId: '', addOnServiceIds: [],
    scheduledDate: '', scheduledTime: '09:00', frequency: 'one-time',
    specialInstructions: '',
  });

  const [packages, setPackages] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [existingProperties, setExistingProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('new');
  const [loadingProperties, setLoadingProperties] = useState(true);

  const createBookingMutation = useCreateBooking();
  const createPropertyMutation = useCreateProperty();
  const priceCalculationTimeout = useRef(null);

  // Fetch user's existing properties on mount
  useEffect(() => {
    const fetchUserProperties = async () => {
      try {
        const response = await getUserProperties();
        if (response.success && response.data.length > 0) {
          setExistingProperties(response.data);
          // Find primary property or use first one
          const primaryProperty = response.data.find(p => p.isPrimary) || response.data[0];
          setSelectedPropertyId(primaryProperty.id);
        } else {
          // No existing properties, user will create a new one
          setSelectedPropertyId('new');
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setSelectedPropertyId('new');
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchUserProperties();
  }, []);

  // Prepopulate form when a property is selected
  useEffect(() => {
    if (selectedPropertyId && selectedPropertyId !== 'new') {
      const property = existingProperties.find(p => p.id === selectedPropertyId);
      if (property) {
        setFormData(prev => ({
          ...prev,
          address: property.address,
          city: property.city,
          state: property.state,
          zipCode: property.zipCode,
          lotSize: property.lotSize.toString(),
          hasBackyard: property.hasBackyard,
          hasDogs: property.hasDogs,
          gateCode: property.gateCode || '',
        }));
      }
    } else if (selectedPropertyId === 'new') {
      // Check localStorage for saved form data when creating new property
      const saved = localStorage.getItem('bookingFormData');
      if (saved) {
        try {
          setFormData(JSON.parse(saved));
        } catch (e) {
          console.error('Error loading saved form data');
        }
      }
    }
  }, [selectedPropertyId, existingProperties]);

  useEffect(() => {
    // Only save to localStorage when creating a new property
    if (selectedPropertyId === 'new') {
      localStorage.setItem('bookingFormData', JSON.stringify(formData));
    }
  }, [formData, selectedPropertyId]);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    // Clear existing timeout
    if (priceCalculationTimeout.current) {
      clearTimeout(priceCalculationTimeout.current);
    }

    // Debounce price calculation to avoid rate limiting
    if (formData.servicePackageId && formData.lotSize) {
      priceCalculationTimeout.current = setTimeout(() => {
        calculatePrice();
      }, 500); // Wait 500ms after last change
    }

    // Cleanup function
    return () => {
      if (priceCalculationTimeout.current) {
        clearTimeout(priceCalculationTimeout.current);
      }
    };
  }, [formData.servicePackageId, formData.lotSize, formData.addOnServiceIds]);

  const fetchServices = async () => {
    try {
      const [pkgRes, addOnRes] = await Promise.all([
        api.get('/services/packages'),
        api.get('/services/add-ons'),
      ]);
      if (pkgRes.success) setPackages(pkgRes.data);
      if (addOnRes.success) setAddOns(addOnRes.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const calculatePrice = async () => {
    try {
      const response = await api.post('/services/calculate-price', {
        packageId: formData.servicePackageId,
        lotSize: parseInt(formData.lotSize),
        addOnIds: formData.addOnServiceIds,
      });
      if (response.success) {
        setTotalPrice(response.data.totalPrice);
      }
    } catch (error) {
      console.error('Error calculating price:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handlePlaceSelected = (placeData) => {
    setFormData((prev) => ({
      ...prev,
      address: placeData.address,
      city: placeData.city,
      state: placeData.state,
      zipCode: placeData.zipCode,
    }));
    // Clear any errors for these fields
    setErrors((prev) => ({
      ...prev,
      address: undefined,
      city: undefined,
      state: undefined,
      zipCode: undefined,
    }));
  };

  const handleAddOnToggle = (addOnId) => {
    setFormData((prev) => ({
      ...prev,
      addOnServiceIds: prev.addOnServiceIds.includes(addOnId)
        ? prev.addOnServiceIds.filter((id) => id !== addOnId)
        : [...prev.addOnServiceIds, addOnId],
    }));
  };

  const validateStep = (step) => {
    const stepErrors = {};
    if (step === 1) {
      if (!formData.address) stepErrors.address = 'Address is required';
      if (!formData.city) stepErrors.city = 'City is required';
      if (!formData.state) stepErrors.state = 'State is required';
      if (!formData.zipCode) stepErrors.zipCode = 'ZIP code is required';
      if (!formData.lotSize || formData.lotSize < 100) stepErrors.lotSize = 'Valid lot size is required';
    } else if (step === 2) {
      if (!formData.servicePackageId) stepErrors.servicePackageId = 'Please select a service package';
    } else if (step === 3) {
      if (!formData.scheduledDate) stepErrors.scheduledDate = 'Please select a date';
      if (!formData.scheduledTime) stepErrors.scheduledTime = 'Please select a time';
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let propertyId;

      // Use existing property or create a new one
      if (selectedPropertyId && selectedPropertyId !== 'new') {
        propertyId = selectedPropertyId;
      } else {
        const propertyData = {
          address: formData.address, city: formData.city, state: formData.state, zipCode: formData.zipCode,
          lotSize: parseInt(formData.lotSize), hasBackyard: formData.hasBackyard, hasDogs: formData.hasDogs,
          gateCode: formData.gateCode || '', // Send empty string instead of null
          isPrimary: existingProperties.length === 0,
        };

        const propertyResult = await createPropertyMutation.mutateAsync(propertyData);
        propertyId = propertyResult.data.id;
      }

      // Convert date to ISO8601 format (backend expects full timestamp)
      const scheduledDateTime = formData.scheduledDate
        ? new Date(formData.scheduledDate + 'T00:00:00').toISOString()
        : '';

      const bookingData = {
        propertyId,
        servicePackageId: formData.servicePackageId,
        scheduledDate: scheduledDateTime,
        scheduledTime: formData.scheduledTime,
        frequency: formData.frequency,
        addOnServiceIds: formData.addOnServiceIds,
        specialInstructions: formData.specialInstructions || '', // Send empty string instead of null
      };

      console.log('Submitting booking data:', bookingData); // Debug log
      const bookingResult = await createBookingMutation.mutateAsync(bookingData);
      localStorage.removeItem('bookingFormData');
      navigate('/booking-confirmation', { state: { booking: bookingResult.data } });
    } catch (error) {
      console.error('Error creating booking:', error);
      console.error('Error response:', error.response?.data); // Log validation errors

      // Display validation errors if available
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors
          .map(err => err.msg)
          .join(', ');
        setErrors({ submit: `Validation failed: ${validationErrors}` });
      } else {
        setErrors({ submit: error.response?.data?.message || 'Failed to create booking. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="relative flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= step.number ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'}`}>
                    {step.number}
                  </div>
                  <span className={`mt-2 text-sm ${currentStep >= step.number ? 'text-primary-600 font-semibold' : 'text-gray-500'}`}>{step.name}</span>
                </div>
                {index < STEPS.length - 1 && <div className={`flex-1 h-1 mx-2 ${currentStep > step.number ? 'bg-primary-600' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentStep === 1 && <Step1 formData={formData} handleChange={handleChange} handlePlaceSelected={handlePlaceSelected} errors={errors} existingProperties={existingProperties} selectedPropertyId={selectedPropertyId} setSelectedPropertyId={setSelectedPropertyId} loadingProperties={loadingProperties} />}
          {currentStep === 2 && <Step2 formData={formData} setFormData={setFormData} packages={packages} addOns={addOns} handleAddOnToggle={handleAddOnToggle} errors={errors} />}
          {currentStep === 3 && <Step3 formData={formData} handleChange={handleChange} errors={errors} />}
          {currentStep === 4 && <Step4 formData={formData} handleChange={handleChange} errors={errors} />}
          {currentStep === 5 && <Step5 formData={formData} totalPrice={totalPrice} packages={packages} addOns={addOns} />}

          <div className="mt-8 flex justify-between">
            <button onClick={prevStep} disabled={currentStep === 1} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Back
            </button>
            {currentStep < 5 ? (
              <button onClick={nextStep} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Continue</button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
                {loading ? 'Processing...' : 'Complete Booking'}
              </button>
            )}
          </div>
          {errors.submit && <p className="mt-4 text-red-600 text-center">{errors.submit}</p>}
        </div>

        {totalPrice > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Estimated Total:</span>
              <span className="text-3xl font-bold text-primary-600">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Step1({ formData, handleChange, handlePlaceSelected, errors, existingProperties, selectedPropertyId, setSelectedPropertyId, loadingProperties }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Information</h2>
      <div className="space-y-4">
        {/* Property Selector */}
        {existingProperties.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Property</label>
            <select
              value={selectedPropertyId}
              onChange={(e) => setSelectedPropertyId(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              disabled={loadingProperties}
            >
              {existingProperties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.address}, {property.city}, {property.state} {property.zipCode}
                  {property.isPrimary ? ' (Primary)' : ''}
                </option>
              ))}
              <option value="new">+ Add New Property</option>
            </select>
            <p className="mt-2 text-sm text-gray-600">
              {selectedPropertyId === 'new'
                ? 'Enter details for your new property below'
                : 'Using saved property details. You can edit them if needed.'}
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Street Address *</label>
          <AddressAutocomplete
            name="address"
            value={formData.address}
            onChange={handleChange}
            onPlaceSelected={handlePlaceSelected}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Start typing your address..."
            error={errors.address}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City *</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State *</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} maxLength={2} placeholder="TX" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ZIP Code *</label>
            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Lot Size (sq ft) *</label>
            <input type="number" name="lotSize" value={formData.lotSize} onChange={handleChange} min="100" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
            {errors.lotSize && <p className="mt-1 text-sm text-red-600">{errors.lotSize}</p>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center">
            <input type="checkbox" name="hasBackyard" checked={formData.hasBackyard} onChange={handleChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label className="ml-2 block text-sm text-gray-900">Has Backyard</label>
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="hasDogs" checked={formData.hasDogs} onChange={handleChange} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
            <label className="ml-2 block text-sm text-gray-900">Has Dogs</label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gate Code (optional)</label>
          <input type="text" name="gateCode" value={formData.gateCode} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
        </div>
      </div>
    </div>
  );
}

function Step2({ formData, setFormData, packages, addOns, handleAddOnToggle, errors }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Service Package</h2>
      <div className="grid gap-4 mb-8">
        {packages.map((pkg) => (
          <div key={pkg.id} onClick={() => setFormData((prev) => ({ ...prev, servicePackageId: pkg.id }))} className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${formData.servicePackageId === pkg.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                <p className="text-sm text-gray-600">{pkg.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600">${parseFloat(pkg.basePrice).toFixed(0)}</p>
                <p className="text-sm text-gray-500">starting price</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {errors.servicePackageId && <p className="text-sm text-red-600 mb-4">{errors.servicePackageId}</p>}
      <h3 className="text-xl font-bold text-gray-900 mb-4">Add-On Services</h3>
      <div className="grid gap-3">
        {addOns.map((addOn) => (
          <div key={addOn.id} onClick={() => handleAddOnToggle(addOn.id)} className={`cursor-pointer border rounded-lg p-3 transition-all ${formData.addOnServiceIds.includes(addOn.id) ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <input type="checkbox" checked={formData.addOnServiceIds.includes(addOn.id)} onChange={() => {}} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{addOn.name}</p>
                  <p className="text-sm text-gray-600">{addOn.description}</p>
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-900">+${parseFloat(addOn.price).toFixed(0)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step3({ formData, handleChange, errors }) {
  const today = new Date().toISOString().split('T')[0];
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Your Service</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Date *</label>
          <input type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} min={today} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
          {errors.scheduledDate && <p className="mt-1 text-sm text-red-600">{errors.scheduledDate}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Preferred Time *</label>
          <select name="scheduledTime" value={formData.scheduledTime} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
            <option value="08:00">8:00 AM</option>
            <option value="09:00">9:00 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="13:00">1:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
            <option value="17:00">5:00 PM</option>
          </select>
          {errors.scheduledTime && <p className="mt-1 text-sm text-red-600">{errors.scheduledTime}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Service Frequency</label>
          <select name="frequency" value={formData.frequency} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500">
            <option value="one-time">One-Time Service</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function Step4({ formData, handleChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
        <textarea name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} rows={5} placeholder="Any special instructions for our team?" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500" />
        <p className="mt-2 text-sm text-gray-500">Optional - Let us know anything that will help us serve you better</p>
      </div>
    </div>
  );
}

function Step5({ formData, totalPrice, packages, addOns }) {
  const selectedPackage = packages.find((p) => p.id === formData.servicePackageId);
  const selectedAddOns = addOns.filter((a) => formData.addOnServiceIds.includes(a.id));
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Confirm</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Property</h3>
          <p className="text-gray-700">{formData.address}</p>
          <p className="text-gray-700">{formData.city}, {formData.state} {formData.zipCode}</p>
          <p className="text-gray-600 text-sm">Lot size: {formData.lotSize} sq ft</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Service</h3>
          <p className="text-gray-700">{selectedPackage?.name}</p>
          {selectedAddOns.length > 0 && (
            <ul className="mt-2 text-sm text-gray-600">
              {selectedAddOns.map((a) => (<li key={a.id}>+ {a.name}</li>))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule</h3>
          <p className="text-gray-700">{new Date(formData.scheduledDate).toLocaleDateString()}</p>
          <p className="text-gray-700">{formData.scheduledTime}</p>
          <p className="text-gray-600 text-sm capitalize">{formData.frequency} service</p>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold">
            <span>Total:</span>
            <span className="text-primary-600">${totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Payment will be processed after service completion</p>
        </div>
      </div>
    </div>
  );
}

export default Booking;
