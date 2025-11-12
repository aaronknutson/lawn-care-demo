import ServiceAreaMap from '../common/ServiceAreaMap';

function ServiceArea() {
  const cities = [
    'Austin',
    'Round Rock',
    'Cedar Park',
    'Georgetown',
    'Pflugerville',
    'Leander',
    'Lakeway',
    'Bee Cave',
    'West Lake Hills',
    'Dripping Springs',
    'Buda',
    'Kyle',
  ];

  return (
    <div className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            Service Area
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Serving Greater Austin Area
          </p>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 mx-auto">
            Professional lawn care throughout Central Texas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Interactive Map */}
          <div className="relative">
            <ServiceAreaMap />

            {/* Service Radius Badge */}
            <div className="absolute -top-4 -right-4 bg-primary-600 text-white rounded-full p-6 shadow-xl z-10">
              <div className="text-center">
                <p className="text-3xl font-bold">20+</p>
                <p className="text-sm">mile radius</p>
              </div>
            </div>
          </div>

          {/* Cities List */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Cities We Serve
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {cities.map((city, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-primary-50 transition-colors"
                >
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 font-medium">{city}</span>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="bg-primary-50 rounded-xl p-6 border-2 border-primary-100">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-primary-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Don't see your city?
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                We're constantly expanding our service area. Contact us to see if we can serve your location.
              </p>
              <a
                href="/booking"
                className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                Check availability
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>(512) 555-LAWN</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@greenscapelawn.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceArea;
