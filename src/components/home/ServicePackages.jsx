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
      <div className="section-spacing bg-slate-50">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500/30 border-t-primary-600"></div>
              <span className="text-lg text-slate-600 font-medium">Loading packages...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="packages" className="section-spacing bg-gradient-to-br from-slate-50 via-white to-primary-50/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-100/40 rounded-full blur-3xl opacity-50"></div>

      <div className="container-custom relative">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary-700 uppercase tracking-wide">
              Our Services
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            Choose Your Perfect{' '}
            <span className="bg-gradient-to-r from-primary-600 to-sky-500 bg-clip-text text-transparent">
              Plan
            </span>
          </h2>
          <p className="mt-6 max-w-3xl text-xl text-slate-600 mx-auto leading-relaxed">
            Professional lawn care packages tailored to your needs and budget
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-3xl overflow-hidden group animate-slide-up ${
                isPopular(pkg.name)
                  ? 'bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 text-white shadow-2xl shadow-primary-500/50 scale-105 lg:scale-110 z-10'
                  : 'bg-white text-slate-900 shadow-xl hover:shadow-2xl'
              } transition-all duration-500 hover:-translate-y-2`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Glow Effect */}
              {isPopular(pkg.name) && (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              )}

              {/* Popular Badge */}
              {isPopular(pkg.name) && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-20">
                  <div className="inline-flex items-center px-6 py-2 bg-gradient-to-r from-sunshine-400 to-sunshine-500 rounded-full shadow-lg animate-bounce-soft">
                    <svg className="w-4 h-4 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-bold text-white uppercase tracking-wide">
                      Most Popular
                    </span>
                  </div>
                </div>
              )}

              {/* Card Content */}
              <div className="p-10 relative z-10">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl mb-6 transform group-hover:scale-110 transition-transform duration-300 ${
                  isPopular(pkg.name)
                    ? 'bg-white/20 backdrop-blur-sm shadow-lg'
                    : 'bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/50'
                }`}>
                  {getPackageIcon(pkg.name)}
                </div>

                {/* Package Name */}
                <h3 className="text-3xl font-extrabold mb-3">{pkg.name}</h3>
                <p className={`text-base leading-relaxed ${
                  isPopular(pkg.name) ? 'text-primary-50' : 'text-slate-600'
                }`}>
                  {pkg.description}
                </p>

                {/* Price */}
                <div className="mt-8 mb-8">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-extrabold tracking-tight">
                      ${parseFloat(pkg.basePrice).toFixed(0)}
                    </span>
                    <span className={`ml-2 text-xl font-semibold ${
                      isPopular(pkg.name) ? 'text-primary-100' : 'text-slate-500'
                    }`}>
                      /visit
                    </span>
                  </div>
                  <p className={`mt-2 text-sm ${
                    isPopular(pkg.name) ? 'text-primary-100' : 'text-slate-500'
                  }`}>
                    * Price varies by lot size
                  </p>
                </div>

                {/* Features List */}
                <ul className="space-y-4">
                  {pkg.features && pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start group/item">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        isPopular(pkg.name) ? 'bg-white/20' : 'bg-primary-100'
                      }`}>
                        <svg
                          className={`w-4 h-4 ${
                            isPopular(pkg.name) ? 'text-white' : 'text-primary-600'
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className={`text-base ${
                        isPopular(pkg.name) ? 'text-white' : 'text-slate-700'
                      } group-hover/item:translate-x-1 transition-transform duration-200`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA Button */}
              <div className="p-10 pt-0 mt-auto relative z-10">
                <Link
                  to="/booking"
                  className={`block w-full py-4 px-6 text-center rounded-xl font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                    isPopular(pkg.name)
                      ? 'bg-white text-primary-600 hover:bg-primary-50 shadow-xl'
                      : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:shadow-glow shadow-lg'
                  }`}
                >
                  Get Started
                  <svg className="inline-block w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center animate-fade-in">
          <div className="inline-flex items-center px-8 py-4 bg-white rounded-2xl shadow-lg">
            <svg className="w-6 h-6 text-primary-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-base text-slate-700">
              All packages include free estimates and satisfaction guarantee.{' '}
              <Link to="/booking" className="font-bold text-primary-600 hover:text-primary-700 underline decoration-2 underline-offset-2">
                Contact us for custom quotes
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServicePackages;
