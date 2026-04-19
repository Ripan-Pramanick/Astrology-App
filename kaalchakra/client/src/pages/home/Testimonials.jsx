import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles, User, MapPin, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api.js';

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          className={`w-4 h-4 ${i < rating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`} 
        />
      ))}
    </div>
  );
};

// Individual Testimonial Card Component
const TestimonialCard = ({ testimonial, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className={`w-8 h-8 transition-colors duration-300 ${isHovered ? 'text-orange-400' : 'text-gray-200'}`} />
      </div>
      
      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={testimonial.rating} />
      </div>
      
      {/* Content */}
      <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">
        "{testimonial.content}"
      </p>
      
      {/* Divider */}
      <div className="border-t border-gray-100 pt-4 mt-2">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${isHovered ? 'from-orange-500 to-amber-500' : 'from-gray-400 to-gray-500'} flex items-center justify-center text-white font-semibold text-sm shadow-sm transition-all duration-300`}>
            {testimonial.avatar || testimonial.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{testimonial.name}</p>
            <p className="text-xs text-gray-400">{testimonial.role}</p>
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {testimonial.location}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3 h-3" /> {testimonial.zodiac}
          </span>
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton
const TestimonialCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
    <div className="w-8 h-8 bg-gray-200 rounded mb-4"></div>
    <div className="flex gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-4 h-4 bg-gray-200 rounded"></div>
      ))}
    </div>
    <div className="space-y-2 mb-5">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-11/12"></div>
      <div className="h-4 bg-gray-200 rounded w-10/12"></div>
    </div>
    <div className="border-t border-gray-100 pt-4 mt-2">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  </div>
);

// Carousel Version for smaller screens
const CarouselTestimonials = ({ testimonials: items, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating || loading || !items.length) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating || loading || !items.length) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    if (loading || !items.length) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, loading, items.length]);

  if (loading) {
    return (
      <div className="relative px-4">
        <div className="grid grid-cols-1 gap-6">
          <TestimonialCardSkeleton />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No testimonials available yet.</p>
      </div>
    );
  }

  return (
    <div className="relative px-4">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((testimonial) => (
            <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-4 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 transition-all"
      >
        <ChevronLeft className="w-4 h-4 text-gray-600" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-4 w-8 h-8 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center hover:bg-orange-50 hover:border-orange-200 transition-all"
      >
        <ChevronRight className="w-4 h-4 text-gray-600" />
      </button>
      
      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? 'w-6 bg-orange-500' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    happyClients: '50K+',
    averageRating: 4.9,
    expertAstrologers: '15+',
    yearsOfService: '25+'
  });
  const [viewMode, setViewMode] = useState('grid');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    fetchTestimonials();
    fetchStats();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/testimonials?is_approved=true&limit=6');
      if (response.data.success) {
        setTestimonials(response.data.testimonials);
      } else {
        setError('Failed to load testimonials');
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/testimonials/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      // Keep default stats
    }
  };

  // Auto-switch to carousel on mobile
  const isMobile = windowWidth < 768;
  const displayMode = isMobile ? 'carousel' : viewMode;

  if (error && !loading) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchTestimonials} 
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3">
            Our Customer Thoughts
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange-300"></div>
            <span className="text-orange-400 text-xl">✨</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-orange-300"></div>
          </div>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Trusted by thousands of satisfied clients for authentic astrological guidance
          </p>
        </div>

        {/* View Toggle (Desktop only) */}
        {!isMobile && !loading && testimonials.length > 0 && (
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                viewMode === 'grid'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('carousel')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                viewMode === 'carousel'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Carousel View
            </button>
          </div>
        )}

        {/* Testimonials Display */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <TestimonialCardSkeleton key={i} />
            ))}
          </div>
        ) : displayMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        ) : (
          <CarouselTestimonials testimonials={testimonials} loading={loading} />
        )}

        {/* Stats Summary - Now from Database */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">{stats.happyClients}</p>
            <p className="text-sm text-gray-500">Happy Clients</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">{stats.averageRating}</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="text-sm text-gray-500">Average Rating</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">{stats.expertAstrologers}</p>
            <p className="text-sm text-gray-500">Expert Astrologers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">{stats.yearsOfService}</p>
            <p className="text-sm text-gray-500">Years of Service</p>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-600">Trusted by clients worldwide</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;