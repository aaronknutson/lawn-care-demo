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
    <div id="quote" className="section-spacing bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-sunshine-400 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container-custom relative">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-4">
            <svg className="w-5 h-5 text-primary-200 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-semibold text-primary-100 uppercase tracking-wide">
              Quick Calculator
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Get an{' '}
            <span className="bg-gradient-to-r from-primary-300 to-sky-300 bg-clip-text text-transparent">
              Instant Quote
            </span>
          </h2>
          <p className="mt-6 text-xl text-slate-300 max-w-2xl mx-auto">
            Enter your lot size to see estimated pricing
          </p>
        </div>

        {/* Calculator Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
            <form onSubmit={handleCalculate} className="p-8 sm:p-12">
              <div className="mb-8">
                <label htmlFor="lotSize" className="block text-lg font-bold text-slate-900 mb-4">
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
                    className="block w-full px-6 py-5 text-xl font-semibold border-3 border-slate-200 rounded-2xl focus:ring-4 focus:ring-primary-500 focus:border-primary-500 transition-all shadow-inner bg-slate-50"
                  />
                  <div className="absolute right-6 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl font-medium pointer-events-none">
                    sq ft
                  </div>
                </div>
                <div className="mt-4 flex items-start space-x-2 text-sm text-slate-600">
                  <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Not sure? Most residential lots are 5,000-10,000 sq ft</p>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-5 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-down">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white py-5 px-8 rounded-2xl font-bold text-xl shadow-2xl shadow-primary-500/50 hover:shadow-glow focus:outline-none focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Calculating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Calculate My Quote
                    <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Quote Results */}
            {quote && (
              <div className="border-t-4 border-primary-500 bg-gradient-to-br from-primary-50 to-sky-50 p-8 sm:p-12 animate-slide-up">
                <div className="text-center mb-10">
                  <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full mb-4">
                    <svg className="w-5 h-5 text-primary-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-semibold text-primary-700 uppercase tracking-wide">Your Estimate</span>
                  </div>
                  <div className="inline-flex items-baseline space-x-2 mb-2">
                    <span className="text-6xl sm:text-7xl font-extrabold bg-gradient-to-r from-primary-600 to-sky-600 bg-clip-text text-transparent">
                      ${quote.selectedPackage.estimatedPrice.toFixed(0)}
                    </span>
                    <span className="text-2xl text-slate-600 font-medium">/visit</span>
                  </div>
                  <p className="text-slate-700 text-lg font-medium">for {quote.selectedPackage.name} Package</p>
                  <p className="text-sm text-slate-500 mt-2">Lot size: {quote.lotSize.toLocaleString()} sq ft ({quote.sizeCategory})</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                  {quote.allPackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                        pkg.name === quote.selectedPackage.name
                          ? 'bg-gradient-to-br from-primary-600 to-primary-500 text-white shadow-2xl shadow-primary-500/50 scale-105'
                          : 'bg-white/80 border-2 border-slate-200 hover:border-primary-300 hover:shadow-lg'
                      }`}
                    >
                      <p className={`font-bold text-sm uppercase tracking-wide mb-3 ${
                        pkg.name === quote.selectedPackage.name ? 'text-primary-100' : 'text-slate-600'
                      }`}>{pkg.name}</p>
                      <p className={`text-4xl font-extrabold ${
                        pkg.name === quote.selectedPackage.name ? 'text-white' : 'text-primary-600'
                      }`}>
                        ${pkg.estimatedPrice.toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8">
                  <div className="flex items-start space-x-3 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="leading-relaxed">{quote.disclaimer}</p>
                  </div>
                </div>

                <div className="text-center">
                  <a
                    href="/booking"
                    className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-primary-500/50 hover:shadow-glow transform hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Book Your Service
                    <svg className="ml-2 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickQuoteCalculator;
