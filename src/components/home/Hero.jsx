import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Unsplash images for lawn/landscaping (using specific IDs for consistency)
  const images = [
    'https://images.unsplash.com/photo-1558904541-efa843a96f01?w=1920&q=80&fit=crop', // Beautiful green lawn
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1920&q=80&fit=crop', // Well-maintained garden
    'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1920&q=80&fit=crop', // Professional landscaping
  ];

  // Auto-rotate images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative bg-gray-900 overflow-hidden">
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
              alt="Beautiful lawn"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
          </div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7 xl:col-span-6">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              <span className="block">Transform Your Lawn</span>
              <span className="block text-primary-400 mt-2">Into Paradise</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl leading-relaxed">
              Professional lawn care services that keep your property looking its absolute best.
              Reliable, eco-friendly, and tailored to your needs.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                to="/booking"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                Get Free Quote
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#packages"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-primary-600 bg-white hover:bg-gray-50 rounded-lg shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                View Services
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-8">
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold text-primary-400">500+</p>
                <p className="mt-1 text-sm sm:text-base text-gray-300">Happy Customers</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold text-primary-400">15+</p>
                <p className="mt-1 text-sm sm:text-base text-gray-300">Years Experience</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl font-bold text-primary-400">100%</p>
                <p className="mt-1 text-sm sm:text-base text-gray-300">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <a href="#packages" className="text-white hover:text-primary-400 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default Hero;
