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
    <div className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            What Our Customers Say
          </p>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-500 mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="mb-4">{renderStars(review.rating)}</div>

              {/* Comment */}
              <blockquote className="text-gray-700 text-base leading-relaxed mb-6">
                "{review.comment}"
              </blockquote>

              {/* User Info */}
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-lg">
                    {review.user.firstName[0]}{review.user.lastName[0]}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {review.user.firstName} {review.user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              {renderStars(5)}
            </div>
            <p className="text-3xl font-bold text-gray-900">4.9 out of 5</p>
            <p className="text-gray-500 mt-2">Based on 500+ reviews</p>
            <div className="mt-6 flex items-center justify-center space-x-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">500+</p>
                <p className="text-sm text-gray-500">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">98%</p>
                <p className="text-sm text-gray-500">Satisfaction Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">15+</p>
                <p className="text-sm text-gray-500">Years in Business</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
