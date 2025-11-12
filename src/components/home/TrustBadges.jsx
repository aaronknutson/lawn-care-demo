function TrustBadges() {
  const badges = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: '100% Satisfaction',
      description: 'Guaranteed or your money back',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      ),
      title: 'Licensed & Insured',
      description: 'Fully certified and covered',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'On-Time Service',
      description: 'Reliable scheduling guaranteed',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Eco-Friendly',
      description: 'Environmentally conscious practices',
    },
  ];

  const guarantees = [
    {
      title: 'Free Estimates',
      description: 'Get a detailed quote at no cost',
      icon: '📋',
    },
    {
      title: 'Flexible Scheduling',
      description: 'Choose the frequency that works for you',
      icon: '📅',
    },
    {
      title: 'Professional Equipment',
      description: 'Commercial-grade tools and products',
      icon: '🛠️',
    },
    {
      title: 'Expert Technicians',
      description: 'Trained and experienced staff',
      icon: '👨‍🌾',
    },
  ];

  return (
    <div className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="relative group text-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-600 text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                {badge.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {badge.title}
              </h3>
              <p className="text-sm text-gray-600">{badge.description}</p>
            </div>
          ))}
        </div>

        {/* Our Guarantees */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl shadow-2xl overflow-hidden">
          <div className="px-6 py-12 sm:px-12 sm:py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Why Choose GreenScape?
              </h2>
              <p className="text-primary-100 text-lg max-w-2xl mx-auto">
                We're committed to providing the best lawn care experience from start to finish
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {guarantees.map((guarantee, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center hover:bg-white/20 transition-colors duration-300"
                >
                  <div className="text-4xl mb-3">{guarantee.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {guarantee.title}
                  </h3>
                  <p className="text-sm text-primary-100">{guarantee.description}</p>
                </div>
              ))}
            </div>

            {/* Service Promise */}
            <div className="mt-12 text-center">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
                <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white font-semibold">
                  Rated 4.9/5 by 500+ satisfied customers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrustBadges;
