import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Unsplash images for lawn/landscaping (using specific IDs for consistency)
  const images = [
    'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1920&q=80&fit=crop', // Beautiful green lawn
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&q=80&fit=crop', // Well-maintained garden
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1920&q=80&fit=crop', // Professional landscaping
  ];

  // Auto-rotate images
  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 overflow-hidden min-h-screen flex items-center">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-sky-500/20 animate-pulse"></div>
      </div>

      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={img}
              alt={`Professional lawn care showcase ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => e.target.style.display = 'none'}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/95 via-primary-800/90 to-primary-900/85" />
          </div>
        ))}
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>

      {/* Hero Content */}
      <div className="relative container-custom py-20 sm:py-24 lg:py-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <div className={`lg:col-span-8 xl:col-span-7 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-primary-500/20 backdrop-blur-sm border border-primary-400/30 rounded-full mb-6 animate-slide-down">
              <span className="flex h-2 w-2 relative mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-sm font-medium text-primary-100">Trusted by 500+ Happy Homeowners</span>
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-6xl xl:text-7xl leading-tight">
              <span className="block animate-slide-up">Transform Your Lawn</span>
              <span className="block mt-2 bg-gradient-to-r from-primary-300 via-primary-400 to-sky-400 bg-clip-text text-transparent animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Into Paradise
              </span>
            </h1>

            <p className="mt-8 text-xl sm:text-2xl text-slate-200 max-w-3xl leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Professional lawn care services that keep your property looking its absolute best.
              <span className="block mt-2 text-primary-200 font-medium">Reliable, eco-friendly, and tailored to your needs.</span>
            </p>

            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link
                to="/booking"
                className="btn-primary group"
              >
                Get Free Quote
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#packages"
                className="btn-outline"
              >
                View Services
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid grid-cols-3 gap-6 sm:gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-center sm:text-left group">
                <div className="inline-block">
                  <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-br from-primary-300 to-primary-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    500+
                  </p>
                </div>
                <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium">Happy Customers</p>
              </div>
              <div className="text-center sm:text-left group">
                <div className="inline-block">
                  <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-br from-sky-300 to-sky-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    15+
                  </p>
                </div>
                <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium">Years Experience</p>
              </div>
              <div className="text-center sm:text-left group">
                <div className="inline-block">
                  <p className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-br from-sunshine-300 to-sunshine-500 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    100%
                  </p>
                </div>
                <p className="mt-2 text-sm sm:text-base text-slate-300 font-medium">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a
          href="#packages"
          className="flex flex-col items-center text-white/80 hover:text-primary-300 transition-colors group"
          aria-label="Scroll to view service packages"
        >
          <span className="text-sm font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default Hero;
