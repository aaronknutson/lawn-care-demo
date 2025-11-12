import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function ServicePackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get('/services/packages');
      if (response.success) {
        setPackages(response.data);
      }
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  // Icon mapping for different packages
  const getPackageIcon = (name) => {
    switch (name.toLowerCase()) {
      case 'basic':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'standard':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        );
      case 'premium':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
    }
  };

  const isPopular = (name) => name.toLowerCase() === 'standard';

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="packages" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            Our Services
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Choose Your Perfect Plan
          </p>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 mx-auto">
            Professional lawn care packages tailored to your needs and budget
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-x-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-2xl shadow-xl ${
                isPopular(pkg.name)
                  ? 'bg-primary-600 text-white ring-4 ring-primary-600 ring-offset-2 transform scale-105'
                  : 'bg-white text-gray-900'
              }`}
            >
              {/* Popular Badge */}
              {isPopular(pkg.name) && (
                <div className="absolute -top-5 left-0 right-0 flex justify-center">
                  <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-primary-500 text-white shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Card Content */}
              <div className="p-8">
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-lg ${
                  isPopular(pkg.name) ? 'bg-white/10' : 'bg-primary-600 text-white'
                }`}>
                  {getPackageIcon(pkg.name)}
                </div>

                {/* Package Name */}
                <h3 className="mt-6 text-2xl font-bold">{pkg.name}</h3>
                <p className={`mt-2 text-sm ${
                  isPopular(pkg.name) ? 'text-primary-100' : 'text-gray-500'
                }`}>
                  {pkg.description}
                </p>

                {/* Price */}
                <div className="mt-6">
                  <p className="flex items-baseline">
                    <span className="text-4xl font-bold tracking-tight">
                      ${parseFloat(pkg.basePrice).toFixed(0)}
                    </span>
                    <span className={`ml-1 text-xl font-semibold ${
                      isPopular(pkg.name) ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      /visit
                    </span>
                  </p>
                  <p className={`mt-1 text-sm ${
                    isPopular(pkg.name) ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    * Price varies by lot size
                  </p>
                </div>

                {/* Features List */}
                <ul className="mt-8 space-y-4">
                  {pkg.features && pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className={`flex-shrink-0 w-6 h-6 ${
                          isPopular(pkg.name) ? 'text-primary-200' : 'text-primary-600'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className={`ml-3 text-base ${
                        isPopular(pkg.name) ? 'text-primary-50' : 'text-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="p-8 pt-0 mt-auto">
                <Link
                  to="/booking"
                  className={`block w-full py-3 px-6 text-center rounded-lg font-semibold transition-all duration-200 ${
                    isPopular(pkg.name)
                      ? 'bg-white text-primary-600 hover:bg-gray-50 shadow-lg'
                      : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-base text-gray-500">
            All packages include free estimates and satisfaction guarantee.{' '}
            <Link to="/booking" className="font-medium text-primary-600 hover:text-primary-500">
              Contact us for custom quotes
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ServicePackages;
