import { useState } from 'react';
import api from '../../services/api';

function QuickQuoteCalculator() {
  const [lotSize, setLotSize] = useState('');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = async (e) => {
    e.preventDefault();
    setError('');
    setQuote(null);

    if (!lotSize || lotSize < 100) {
      setError('Please enter a valid lot size (minimum 100 sq ft)');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/services/quick-quote', {
        lotSize: parseInt(lotSize),
      });

      // API interceptor returns response.data, which is { success, data }
      // We need the inner data object
      if (response && response.data) {
        setQuote(response.data);
      } else {
        setError('Invalid response format');
      }
    } catch (err) {
      setError('Unable to calculate quote. Please try again.');
      console.error('Quote calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="quote" className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            Quick Calculator
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Get an Instant Quote
          </p>
          <p className="mt-4 text-lg sm:text-xl text-gray-500">
            Enter your lot size to see estimated pricing
          </p>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleCalculate} className="p-8 sm:p-12">
            <div className="mb-8">
              <label htmlFor="lotSize" className="block text-sm font-medium text-gray-700 mb-2">
                Lot Size (square feet)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="lotSize"
                  value={lotSize}
                  onChange={(e) => setLotSize(e.target.value)}
                  placeholder="e.g., 5000"
                  min="100"
                  className="block w-full px-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  sq ft
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Not sure? Most residential lots are 5,000-10,000 sq ft
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Calculating...
                </span>
              ) : (
                'Calculate My Quote'
              )}
            </button>
          </form>

          {/* Quote Results */}
          {quote && (
            <div className="border-t-2 border-gray-100 bg-gradient-to-br from-primary-50 to-primary-100 p-8 sm:p-12">
              <div className="text-center mb-8">
                <p className="text-sm text-gray-600 uppercase tracking-wide mb-2">Estimated Price</p>
                <p className="text-5xl font-bold text-primary-600">
                  ${quote.selectedPackage.estimatedPrice.toFixed(0)}
                </p>
                <p className="text-gray-600 mt-2">per visit for {quote.selectedPackage.name} Package</p>
                <p className="text-sm text-gray-500 mt-1">Lot size: {quote.lotSize.toLocaleString()} sq ft ({quote.sizeCategory})</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {quote.allPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className={`p-4 rounded-lg border-2 text-center ${
                      pkg.name === quote.selectedPackage.name
                        ? 'border-primary-600 bg-white shadow-lg'
                        : 'border-gray-200 bg-white/50'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{pkg.name}</p>
                    <p className="text-2xl font-bold text-primary-600 mt-2">
                      ${pkg.estimatedPrice.toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-600 text-center mb-6">
                {quote.disclaimer}
              </p>

              <div className="text-center">
                <a
                  href="/booking"
                  className="inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg"
                >
                  Book Your Service
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuickQuoteCalculator;
