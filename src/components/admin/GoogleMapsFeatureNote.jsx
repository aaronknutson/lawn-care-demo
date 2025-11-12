import { MapIcon, SparklesIcon } from '@heroicons/react/24/outline';

function GoogleMapsFeatureNote() {
  const additionalFeatures = [
    {
      title: 'Route Optimization',
      description: 'Automatically calculate the most efficient routes between appointments for crew members',
      benefit: 'Reduce travel time and fuel costs',
    },
    {
      title: 'Drive Time Estimates',
      description: 'Real-time traffic-aware estimates for travel time between service locations',
      benefit: 'More accurate scheduling',
    },
    {
      title: 'Service Area Heat Maps',
      description: 'Visualize service density and identify underserved areas for marketing',
      benefit: 'Strategic business expansion',
    },
    {
      title: 'Geo-fenced Notifications',
      description: 'Automatic notifications when crew arrives at or leaves a property',
      benefit: 'Better customer communication',
    },
    {
      title: 'Territory Management',
      description: 'Assign crew members to specific geographic zones for optimized coverage',
      benefit: 'Improved efficiency',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-blue-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <MapIcon className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Google Maps Integration Active
            </h3>
            <SparklesIcon className="ml-2 h-5 w-5 text-yellow-500" />
          </div>

          <p className="text-sm text-gray-700 mb-4">
            Your system is currently using Google Maps for address autocomplete, service area visualization,
            and property location mapping. <strong>Additional premium features are available:</strong>
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-blue-100">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center text-blue-600 text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
                    <p className="text-xs text-green-600 mt-1 font-medium">
                      ✓ {feature.benefit}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Current Features */}
          <div className="bg-white rounded-lg p-4 border border-green-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Currently Active Features:</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <strong>Address Autocomplete:</strong> Smart address entry in booking forms
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <strong>Service Area Map:</strong> Interactive coverage visualization on homepage
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <strong>Property Locations:</strong> Customer property mapping in admin panel
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-4 flex items-center justify-between bg-blue-600 rounded-lg p-3 text-white">
            <div>
              <p className="text-sm font-medium">Interested in these additional features?</p>
              <p className="text-xs opacity-90">Contact us for a demo and pricing information</p>
            </div>
            <button className="px-4 py-2 bg-white text-blue-600 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoogleMapsFeatureNote;
