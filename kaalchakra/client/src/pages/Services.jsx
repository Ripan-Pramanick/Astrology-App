// client/src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import api from '../services/api.js';
import { Loader2, AlertCircle } from 'lucide-react';

// Reusable Service Card Component
const ServiceCard = ({ icon, title, subtitle, oldPrice, newPrice, serviceId, onOrder }) => {
  return (
    <div className="flex flex-col items-center text-center group cursor-pointer">
      {/* Icon */}
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
        {icon}
      </div>
      
      {/* Title */}
      <h3 className="text-gray-800 font-bold text-lg mt-5 mb-1 leading-tight whitespace-pre-line">
        {title}
      </h3>
      
      {/* Subtitle (only for Kundali Analysis) */}
      {subtitle && (
        <p className="text-gray-500 text-xs mb-3 max-w-[140px] mx-auto">
          {subtitle}
        </p>
      )}
      
      {/* Price Section */}
      <div className="flex items-center justify-center gap-2 mt-2">
        {oldPrice && (
          <span className="text-gray-400 line-through text-sm font-medium">
            ₹{oldPrice}
          </span>
        )}
        <span className="text-[#F7931E] font-bold text-xl">
          ₹{newPrice}
        </span>
      </div>

      <Button 
        size="sm" 
        className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
        onClick={() => onOrder(serviceId)}
      >
        Order Now
      </Button>
    </div>
  );
};

// Loading Skeleton Component
const ServiceCardSkeleton = () => (
  <div className="flex flex-col items-center text-center animate-pulse">
    <div className="w-20 h-20 rounded-2xl bg-gray-200"></div>
    <div className="h-5 bg-gray-200 rounded w-24 mt-5 mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-16 mb-3"></div>
    <div className="flex gap-2 mt-2">
      <div className="h-4 bg-gray-200 rounded w-12"></div>
      <div className="h-5 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="h-8 bg-gray-200 rounded w-24 mt-4"></div>
  </div>
);

const Services = () => {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ordering, setOrdering] = useState(null);

  // Fetch services from backend database
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/services');
      if (response.data.success) {
        setServicesData(response.data.services);
      } else {
        setError('Failed to load services');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (serviceId) => {
    setOrdering(serviceId);
    try {
      // Get current user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!user || !user.id) {
        // Redirect to login if not logged in
        window.location.href = '/login';
        return;
      }

      const response = await api.post('/services/order', {
        serviceId: serviceId,
        userId: user.id,
        userName: user.name || 'Guest',
        userPhone: user.phone || ''
      });

      if (response.data.success) {
        // Redirect to checkout or kundli page
        window.location.href = '/kundli';
      } else {
        alert(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order error:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setOrdering(null);
    }
  };

  // Icon mapping based on service title
  const getServiceIcon = (serviceName, customIcon) => {
    if (customIcon) return customIcon;
    
    const iconPaths = {
      'Kundali': (
        <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="2" fill="white" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ),
      'Muhurata': (
        <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M4 4L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M20 4L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ),
      'Career': (
        <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M16 21V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V21" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12 11V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 16V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
      'Marriage': (
        <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M17 3.5L19 5.5L23 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'Progeny': (
        <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C10 2 8.5 3.5 8.5 5.5C8.5 7.5 10 9 12 9C14 9 15.5 7.5 15.5 5.5C15.5 3.5 14 2 12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M5 22V19C5 16.8 6.8 15 9 15H15C17.2 15 19 16.8 19 19V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M3 9L5 7L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 9L19 7L17 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'Health': (
        <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          <path d="M12 8V13" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="12" cy="16" r="1" fill="white"/>
        </svg>
      ),
      'Education': (
        <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3L2 9L12 15L22 9L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M6 12L6 18L12 21L18 18L18 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 21V15" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      ),
      'Relationship': (
        <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
      ),
      'Match': (
        <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M8 10L11 13L16 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      'Name': (
        <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>
      )
    };
    
    // Find matching icon based on service name
    for (const [key, icon] of Object.entries(iconPaths)) {
      if (serviceName.includes(key)) {
        return icon;
      }
    }
    
    // Default icon
    return (
      <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="2" fill="white" stroke="currentColor" strokeWidth="1.2"/>
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="bg-[#f5f5f5] min-h-screen py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1f2a44] mb-4 tracking-tight font-serif">
              Our Services
            </h1>
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <span className="text-xl md:text-2xl">🙏</span>
              <p className="text-lg md:text-xl font-medium">May All The Worlds Be Happy</p>
              <span className="text-xl md:text-2xl">🙏</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-6 relative max-w-6xl mx-auto">
            {[...Array(8)].map((_, index) => (
              <ServiceCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#f5f5f5] min-h-screen py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1f2a44] mb-4 tracking-tight font-serif">
              Our Services
            </h1>
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <span className="text-xl md:text-2xl">🙏</span>
              <p className="text-lg md:text-xl font-medium">May All The Worlds Be Happy</p>
              <span className="text-xl md:text-2xl">🙏</span>
            </div>
          </div>
          
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchServices} variant="primary" className="bg-[#F7931E] hover:bg-[#e68a1a] text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Subtle Radial/Mandala Astrology Pattern Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full border-[40px] border-[#F7931E]"></div>
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border-[30px] border-[#F7931E]"></div>
        <div className="absolute top-60 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full border-[20px] border-[#F7931E]"></div>
        <div className="absolute top-80 left-1/2 -translate-x-1/2 w-[200px] h-[200px] rounded-full border-[10px] border-[#F7931E]"></div>
        
        {/* Radial rays */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-[1px] h-[500px] bg-[#F7931E] origin-top"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-250px)`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1f2a44] mb-4 tracking-tight font-serif">
            Our Services
          </h1>
          <div className="flex items-center justify-center gap-3 text-gray-600">
            <span className="text-xl md:text-2xl">🙏</span>
            <p className="text-lg md:text-xl font-medium">May All The Worlds Be Happy</p>
            <span className="text-xl md:text-2xl">🙏</span>
          </div>
        </div>

        {/* Top Feature Banner */}
        <div className="mb-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#f3e0c7] to-[#f7931e] rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="flex flex-col md:flex-row items-center justify-between px-6 py-5 md:px-8 gap-4">
              {/* Left Icon */}
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M8 7H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M8 11H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M8 15H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M17 15L19 17L17 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M19 17H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
              
              {/* Center Text */}
              <div className="flex-1 text-center md:text-left">
                <p className="text-gray-800 font-semibold text-sm md:text-base leading-relaxed">
                  Order Hard Copy of Kundali (Birth Chart) for convenient reference, personal keepsake, detailed layout and easy annotations
                </p>
              </div>
              
              {/* Right Arrow & Price */}
              <Link to="/kundli" className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-white font-bold text-xl">₹1100</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Services Grid - 4 columns desktop, 2 tablet, 1 mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-6 relative max-w-6xl mx-auto">
          {servicesData.map((service, index) => (
            <React.Fragment key={service.id}>
              <div className="relative">
                <ServiceCard
                  icon={service.icon_svg ? (
                    <div dangerouslySetInnerHTML={{ __html: service.icon_svg }} className="w-10 h-10 text-[#F7931E]" />
                  ) : getServiceIcon(service.name, service.icon_svg)}
                  title={service.name}
                  subtitle={service.subtitle}
                  oldPrice={service.original_price}
                  newPrice={service.price}
                  serviceId={service.id}
                  onOrder={handleOrder}
                />
              </div>
              
              {/* Vertical separator between columns - hidden on mobile, visible on desktop */}
              {index < servicesData.length - 1 && (index + 1) % 4 !== 0 && (
                <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 right-[-12px] w-px h-24 bg-[#e5e5e5]"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-100 rounded-2xl p-8 mt-24 text-center max-w-4xl mx-auto shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">Every Problem Has A Solution</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Choose from our Services Offerings or submit your query if it is a unique ask and not listed here. Our expert astrologers are here to guide you.
          </p>
          <Button variant="primary" size="lg" className="bg-[#F7931E] hover:bg-[#e68a1a] text-white" onClick={() => window.location.href = '/contact'}>
            Submit Your Query
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Services;