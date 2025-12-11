import { useState, useEffect } from 'react';
import api from '../../services/api';

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews?approved=true&limit=6');
      if (response.success) {
        setReviews(response.data.reviews);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      // Fallback to sample reviews if API fails
      setReviews([
        {
          id: 1,
          rating: 5,
          comment: 'GreenScape transformed our lawn completely! Professional, reliable, and the results speak for themselves. Highly recommended!',
          user: { firstName: 'Sarah', lastName: 'M.' },
        },
        {
          id: 2,
          rating: 5,
          comment: 'Best lawn care service in the area. They are always on time and do an excellent job. Our yard has never looked better!',
          user: { firstName: 'Michael', lastName: 'R.' },
        },
        {
          id: 3,
          rating: 5,
          comment: 'We have been using GreenScape for over 2 years now and couldn\'t be happier. Great communication and quality work.',
          user: { firstName: 'Jennifer', lastName: 'T.' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => (
          <svg
            key={index}
            className={`w-5 h-5 ${
              index < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="section-spacing bg-white">
        <div className="container-custom">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500/30 border-t-primary-600"></div>
              <span className="text-lg text-slate-600 font-medium">Loading testimonials...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-spacing bg-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-sky-100/60 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl"></div>

      <div className="container-custom relative">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-sky-100 rounded-full mb-4">
            <svg className="w-5 h-5 text-sky-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-sky-700 uppercase tracking-wide">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
            What Our{' '}
            <span className="bg-gradient-to-r from-primary-600 to-sky-500 bg-clip-text text-transparent">
              Customers
            </span>{' '}
            Say
          </h2>
          <p className="mt-6 max-w-3xl text-xl text-slate-600 mx-auto leading-relaxed">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mb-20">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="group relative bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon Background */}
              <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <svg className="w-24 h-24 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Stars */}
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {renderStars(review.rating)}
              </div>

              {/* Comment */}
              <blockquote className="text-slate-700 text-base leading-relaxed mb-8 relative z-10">
                "{review.comment}"
              </blockquote>

              {/* User Info */}
              <div className="flex items-center mt-auto pt-6 border-t border-slate-200">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-glow transition-shadow">
                    {review.user.firstName[0]}{review.user.lastName[0]}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-base font-bold text-slate-900">
                    {review.user.firstName} {review.user.lastName}
                  </p>
                  <div className="flex items-center mt-1">
                    <svg className="w-4 h-4 text-primary-600 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-slate-600 font-medium">Verified Customer</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating Banner */}
        <div className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-sky-500 rounded-3xl shadow-2xl shadow-primary-500/50 p-12 overflow-hidden animate-fade-in">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-300/20 rounded-full blur-2xl"></div>

          <div className="relative text-center">
            <div className="inline-flex items-center justify-center space-x-2 mb-6">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className="w-8 h-8 text-sunshine-400 animate-bounce-soft"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-6xl font-extrabold text-white mb-2">4.9</p>
            <p className="text-2xl text-white/90 font-medium mb-8">Based on 500+ reviews</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center group cursor-default">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <p className="text-4xl font-extrabold text-white">500+</p>
                </div>
                <p className="text-base text-white/90 font-medium">Happy Customers</p>
              </div>
              <div className="text-center group cursor-default">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <p className="text-4xl font-extrabold text-white">98%</p>
                </div>
                <p className="text-base text-white/90 font-medium">Satisfaction Rate</p>
              </div>
              <div className="text-center group cursor-default">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <p className="text-4xl font-extrabold text-white">15+</p>
                </div>
                <p className="text-base text-white/90 font-medium">Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
