import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useMemo } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

// Austin, TX coordinates (default center)
const defaultCenter = {
  lat: 30.2672,
  lng: -97.7431,
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: false,
  fullscreenControl: true,
};

// Function to geocode address to lat/lng
async function geocodeAddress(address, city, state, zipCode) {
  const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;

  try {
    const geocoder = new window.google.maps.Geocoder();
    const result = await new Promise((resolve, reject) => {
      geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve({
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          });
        } else {
          reject(new Error('Geocoding failed'));
        }
      });
    });
    return result;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}

function PropertyLocationMap({ properties }) {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyLocations, setPropertyLocations] = useState([]);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const mapCenter = useMemo(() => {
    if (propertyLocations.length > 0) {
      // Calculate center based on all properties
      const avgLat = propertyLocations.reduce((sum, p) => sum + p.lat, 0) / propertyLocations.length;
      const avgLng = propertyLocations.reduce((sum, p) => sum + p.lng, 0) / propertyLocations.length;
      return { lat: avgLat, lng: avgLng };
    }
    return defaultCenter;
  }, [propertyLocations]);

  // Geocode properties when map loads
  useMemo(() => {
    if (isLoaded && properties && properties.length > 0 && propertyLocations.length === 0) {
      setIsGeocoding(true);
      Promise.all(
        properties.map(async (property) => {
          const location = await geocodeAddress(
            property.address,
            property.city,
            property.state,
            property.zipCode
          );
          if (location) {
            return { ...property, ...location };
          }
          return null;
        })
      ).then((locations) => {
        setPropertyLocations(locations.filter(Boolean));
        setIsGeocoding(false);
      });
    }
  }, [isLoaded, properties, propertyLocations.length]);

  if (loadError) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-600">Unable to load map. Please check your Google Maps API configuration.</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 animate-pulse">
        <div className="h-96 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={propertyLocations.length > 0 ? 11 : 10}
        center={mapCenter}
        options={mapOptions}
      >
        {isGeocoding && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded shadow-lg">
            <p className="text-sm text-gray-600">Loading property locations...</p>
          </div>
        )}

        {propertyLocations.map((property, index) => (
          <Marker
            key={property.id || index}
            position={{ lat: property.lat, lng: property.lng }}
            onClick={() => setSelectedProperty(property)}
            icon={{
              url: 'data:image/svg+xml;base64,' + btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="${property.isPrimary ? '#10b981' : '#3b82f6'}">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(28, 28),
            }}
          />
        ))}

        {selectedProperty && (
          <InfoWindow
            position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold text-gray-900 mb-1">
                {selectedProperty.address}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {selectedProperty.city}, {selectedProperty.state} {selectedProperty.zipCode}
              </p>
              <div className="space-y-1 text-xs text-gray-500">
                <p><span className="font-medium">Lot Size:</span> {selectedProperty.lotSize?.toLocaleString()} sq ft</p>
                {selectedProperty.hasBackyard && <p className="text-green-600">✓ Has Backyard</p>}
                {selectedProperty.hasDogs && <p className="text-yellow-600">⚠️ Has Dogs</p>}
                {selectedProperty.isPrimary && (
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium mt-1">
                    Primary Property
                  </span>
                )}
              </div>
              {selectedProperty.User && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Customer:</span> {selectedProperty.User.firstName} {selectedProperty.User.lastName}
                  </p>
                </div>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Map Stats */}
      <div className="bg-white p-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-600">Primary Properties</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-gray-600">Additional Properties</span>
            </div>
          </div>
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{propertyLocations.length}</span> properties displayed
          </p>
        </div>
      </div>
    </div>
  );
}

export default PropertyLocationMap;
