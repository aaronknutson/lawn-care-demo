import { GoogleMap, useLoadScript, Circle, Marker } from '@react-google-maps/api';
import { useMemo } from 'react';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

// Austin, TX coordinates (GreenScape headquarters)
const center = {
  lat: 30.2672,
  lng: -97.7431,
};

// Service areas (in miles radius)
const serviceAreas = [
  { radius: 16093, color: '#10b981', opacity: 0.2 }, // 10 miles - Primary service area
  { radius: 32186, color: '#3b82f6', opacity: 0.15 }, // 20 miles - Extended service area
];

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
};

function ServiceAreaMap() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const mapCenter = useMemo(() => center, []);

  if (loadError) {
    return (
      <div className="bg-gray-100 rounded-lg p-8 text-center">
        <p className="text-gray-600">Unable to load map. Please check your internet connection.</p>
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
        zoom={10}
        center={mapCenter}
        options={mapOptions}
      >
        {/* Service area circles */}
        {serviceAreas.map((area, index) => (
          <Circle
            key={index}
            center={mapCenter}
            radius={area.radius}
            options={{
              strokeColor: area.color,
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: area.color,
              fillOpacity: area.opacity,
            }}
          />
        ))}

        {/* Headquarters marker */}
        <Marker
          position={mapCenter}
          title="GreenScape Lawn Care - Austin, TX"
          icon={{
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#10b981">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 32),
          }}
        />
      </GoogleMap>

      {/* Legend */}
      <div className="bg-white p-4 border-t">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Service Coverage</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 opacity-40 mr-2"></div>
            <span className="text-gray-600">Primary Area (10 miles)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 opacity-30 mr-2"></div>
            <span className="text-gray-600">Extended Area (20 miles)</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Centered in Austin, TX. Service available throughout the greater Austin metropolitan area.
        </p>
      </div>
    </div>
  );
}

export default ServiceAreaMap;
