import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Sparkles, User, MapPin } from 'lucide-react';

// Sample testimonials data (replace with your actual import)
const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Marketing Professional",
    zodiac: "Virgo",
    location: "Mumbai, India",
    content: "The personalized birth chart reading was incredibly accurate. It helped me understand my career path better and gave me confidence to pursue my dreams. The astrologer's insights were spot on!",
    rating: 5,
    avatar: "PS",
    date: "March 2024"
  },
  {
    id: 2,
    name: "Rajesh Mehta",
    role: "Business Owner",
    zodiac: "Taurus",
    location: "Delhi, India",
    content: "Matchmaking service was exceptional. The detailed analysis and compatibility report helped our families make an informed decision. Highly recommended for anyone serious about marriage.",
    rating: 5,
    avatar: "RM",
    date: "February 2024"
  },
  {
    id: 3,
    name: "Ananya Krishnan",
    role: "Software Engineer",
    zodiac: "Pisces",
    location: "Bangalore, India",
    content: "The muhurata consultation for our house warming was spot on. Everything went smoothly and auspiciously. Thank you for your wonderful guidance and support throughout.",
    rating: 4,
    avatar: "AK",
    date: "January 2024"
  },
  {
    id: 4,
    name: "Vikram Singh",
    role: "Entrepreneur",
    zodiac: "Leo",
    location: "Jaipur, India",
    content: "The career consultation gave me clarity on business timing. Following the advice led to successful funding rounds. Truly life-changing experience!",
    rating: 5,
    avatar: "VS",
    date: "March 2024"
  },
  {
    id: 5,
    name: "Neha Gupta",
    role: "Teacher",
    zodiac: "Cancer",
    location: "Lucknow, India",
    content: "Name correction service brought positive changes in my life. The process was professional and well-explained. I've noticed significant improvements in my confidence.",
    rating: 5,
    avatar: "NG",
    date: "February 2024"
  },
  {
    id: 6,
    name: "Arjun Nair",
    role: "Doctor",
    zodiac: "Sagittarius",
    location: "Chennai, India",
    content: "Excellent insights into health and wellbeing. The planetary remedies suggested have shown remarkable results. Very grateful for the guidance.",
    rating: 4,
    avatar: "AN",
    date: "January 2024"
  }
];

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
            {testimonial.avatar}
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

// Carousel Version for smaller screens
const CarouselTestimonials = ({ testimonials: items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

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
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'carousel'
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-switch to carousel on mobile
  const isMobile = windowWidth < 768;
  const displayMode = isMobile ? 'carousel' : viewMode;

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
        {!isMobile && (
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
        {displayMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        ) : (
          <CarouselTestimonials testimonials={testimonials} />
        )}

        {/* Stats Summary */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">50K+</p>
            <p className="text-sm text-gray-500">Happy Clients</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">4.9</p>
            <div className="flex items-center justify-center gap-1 mt-1">
              <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="text-sm text-gray-500">Average Rating</span>
            </div>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">15+</p>
            <p className="text-sm text-gray-500">Expert Astrologers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-800">25+</p>
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