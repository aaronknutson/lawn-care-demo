import { useRef, useEffect } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

function AddressAutocomplete({ value, onChange, onPlaceSelected, name, className, placeholder, error }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      // Initialize autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
      });

      // Listen for place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();

        if (place.address_components) {
          // Extract address components
          const addressComponents = {};
          place.address_components.forEach((component) => {
            const types = component.types;
            if (types.includes('street_number')) {
              addressComponents.streetNumber = component.long_name;
            }
            if (types.includes('route')) {
              addressComponents.route = component.long_name;
            }
            if (types.includes('locality')) {
              addressComponents.city = component.long_name;
            }
            if (types.includes('administrative_area_level_1')) {
              addressComponents.state = component.short_name;
            }
            if (types.includes('postal_code')) {
              addressComponents.zipCode = component.long_name;
            }
          });

          // Build full address
          const streetAddress = [
            addressComponents.streetNumber,
            addressComponents.route,
          ].filter(Boolean).join(' ');

          // Call the callback with extracted data
          if (onPlaceSelected) {
            onPlaceSelected({
              address: streetAddress,
              city: addressComponents.city || '',
              state: addressComponents.state || '',
              zipCode: addressComponents.zipCode || '',
              fullAddress: place.formatted_address,
            });
          }
        }
      });
    }
  }, [isLoaded, onPlaceSelected]);

  if (loadError) {
    console.error('Error loading Google Maps:', loadError);
    // Fallback to regular input
    return (
      <div>
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className={className}
          placeholder={placeholder}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div>
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className={className}
          placeholder="Loading..."
          disabled
        />
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className={className}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default AddressAutocomplete;
