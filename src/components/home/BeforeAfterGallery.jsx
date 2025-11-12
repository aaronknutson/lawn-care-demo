import { useState } from "react";

function BeforeAfterGallery() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample before/after images from Unsplash (lawn care themed)
  const slides = [
    {
      before:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80&fit=crop",
      after:
        "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80&fit=crop",
      title: "Complete Lawn Renovation",
      description: "Transformed from overgrown to pristine in just 6 weeks",
    },
    {
      before:
        "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&q=80&fit=crop",
      after:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80&fit=crop",
      title: "Landscaping Enhancement",
      description: "Added professional edging and seasonal flowers",
    },
    {
      before:
        "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&q=80&fit=crop",
      after:
        "https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&q=80&fit=crop",
      title: "Garden Bed Refresh",
      description: "Fresh mulch, trimmed hedges, and vibrant plantings",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className='py-16 sm:py-24 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <h2 className='text-base text-primary-600 font-semibold tracking-wide uppercase'>
            Our Work
          </h2>
          <p className='mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900'>
            Before & After Transformations
          </p>
          <p className='mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 mx-auto'>
            See the difference professional lawn care makes
          </p>
        </div>

        {/* Gallery Slider */}
        <div className='relative'>
          {/* Main Slider */}
          <div className='relative overflow-hidden rounded-2xl shadow-2xl bg-gray-100'>
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === currentSlide
                    ? "opacity-100"
                    : "opacity-0 absolute inset-0"
                }`}>
                {/* Before/After Images */}
                <div className='grid grid-cols-1 md:grid-cols-2'>
                  {/* Before */}
                  <div className='relative group'>
                    <div className='absolute top-4 left-4 z-10'>
                      <span className='inline-flex items-center px-4 py-2 rounded-lg bg-red-500 text-white font-semibold shadow-lg'>
                        Before
                      </span>
                    </div>
                    <img
                      src={slide.before}
                      alt='Before'
                      className='w-full h-64 sm:h-80 md:h-96 object-cover'
                    />
                  </div>

                  {/* After */}
                  <div className='relative group'>
                    <div className='absolute top-4 left-4 z-10'>
                      <span className='inline-flex items-center px-4 py-2 rounded-lg bg-green-500 text-white font-semibold shadow-lg'>
                        After
                      </span>
                    </div>
                    <img
                      src={slide.after}
                      alt='After'
                      className='w-full h-64 sm:h-80 md:h-96 object-cover'
                    />
                  </div>
                </div>

                {/* Slide Info */}
                <div className='bg-gradient-to-r from-gray-800 to-gray-900 text-white p-6 sm:p-8'>
                  <h3 className='text-xl sm:text-2xl font-bold'>
                    {slide.title}
                  </h3>
                  <p className='mt-2 text-gray-300'>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110'
            aria-label='Previous slide'>
            <svg
              className='w-6 h-6 text-gray-900'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110'
            aria-label='Next slide'>
            <svg
              className='w-6 h-6 text-gray-900'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className='flex justify-center mt-6 space-x-2'>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "bg-primary-600 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className='mt-12 text-center'>
          <p className='text-lg text-gray-600 mb-4'>
            Ready to transform your lawn?
          </p>
          <a
            href='#quote'
            className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors'>
            Get Your Free Quote
            <svg
              className='ml-2 w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 7l5 5m0 0l-5 5m5-5H6'
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default BeforeAfterGallery;
