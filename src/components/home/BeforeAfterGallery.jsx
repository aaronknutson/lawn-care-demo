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
    <div className='section-spacing bg-slate-50 relative overflow-hidden'>
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary-100/40 to-sky-100/40 rounded-full blur-3xl"></div>

      <div className='container-custom relative'>
        {/* Section Header */}
        <div className='text-center mb-20 animate-fade-in'>
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full mb-4">
            <svg className="w-5 h-5 text-primary-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-semibold text-primary-700 uppercase tracking-wide">
              Our Work
            </span>
          </div>
          <h2 className='text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight'>
            Before & After{' '}
            <span className="bg-gradient-to-r from-primary-600 to-sky-500 bg-clip-text text-transparent">
              Transformations
            </span>
          </h2>
          <p className='mt-6 max-w-3xl text-xl text-slate-600 mx-auto leading-relaxed'>
            See the difference professional lawn care makes
          </p>
        </div>

        {/* Gallery Slider */}
        <div className='relative max-w-6xl mx-auto'>
          {/* Main Slider */}
          <div className='relative overflow-hidden rounded-3xl shadow-2xl bg-slate-100'>
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ease-out ${
                  index === currentSlide
                    ? "opacity-100 relative"
                    : "opacity-0 absolute inset-0 pointer-events-none"
                }`}>
                {/* Before/After Images */}
                <div className='grid grid-cols-1 md:grid-cols-2'>
                  {/* Before */}
                  <div className='relative group overflow-hidden'>
                    <div className='absolute top-6 left-6 z-10'>
                      <span className='inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold shadow-xl backdrop-blur-sm transform group-hover:scale-110 transition-transform'>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Before
                      </span>
                    </div>
                    <img
                      src={slide.before}
                      alt='Before lawn care transformation'
                      className='w-full h-72 sm:h-96 md:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700'
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* After */}
                  <div className='relative group overflow-hidden'>
                    <div className='absolute top-6 left-6 z-10'>
                      <span className='inline-flex items-center px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold shadow-xl shadow-primary-500/50 backdrop-blur-sm transform group-hover:scale-110 transition-transform'>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        After
                      </span>
                    </div>
                    <img
                      src={slide.after}
                      alt='After lawn care transformation'
                      className='w-full h-72 sm:h-96 md:h-[500px] object-cover transform group-hover:scale-105 transition-transform duration-700'
                      onError={(e) => e.target.style.display = 'none'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Slide Info */}
                <div className='bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-10'>
                  <div className="max-w-3xl mx-auto text-center">
                    <h3 className='text-2xl sm:text-3xl font-extrabold mb-3'>
                      {slide.title}
                    </h3>
                    <p className='text-lg text-slate-300'>{slide.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-4 rounded-2xl shadow-2xl transition-all duration-200 transform hover:scale-110 hover:shadow-glow backdrop-blur-sm z-20'
            aria-label='Previous slide'>
            <svg
              className='w-6 h-6 text-slate-900'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={3}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white p-4 rounded-2xl shadow-2xl transition-all duration-200 transform hover:scale-110 hover:shadow-glow backdrop-blur-sm z-20'
            aria-label='Next slide'>
            <svg
              className='w-6 h-6 text-slate-900'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={3}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className='flex justify-center mt-8 space-x-3'>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-gradient-to-r from-primary-600 to-primary-500 w-12 shadow-lg shadow-primary-500/50"
                    : "bg-slate-300 hover:bg-slate-400 w-3"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className='mt-16 text-center animate-fade-in'>
          <div className="inline-block bg-white rounded-3xl shadow-2xl p-8">
            <p className='text-xl text-slate-700 font-medium mb-6'>
              Ready to transform your lawn?
            </p>
            <a
              href='#quote'
              className='inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-glow transform hover:scale-105 active:scale-95 transition-all duration-200'>
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
    </div>
  );
}

export default BeforeAfterGallery;
