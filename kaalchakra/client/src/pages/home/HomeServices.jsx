import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ icon, title, subtitle, oldPrice, newPrice, index }) => (
  <div className="relative group">
    {index < 8 && index % 3 !== 2 && (
      <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2">
        <div className="w-px h-32 bg-gray-300"></div>
      </div>
    )}
    <div className="text-center px-4 py-6 transition-all duration-300 hover:transform hover:-translate-y-1">
      <div className="flex justify-center mb-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
          {icon}
        </div>
      </div>
      <h3 className="text-gray-800 font-bold text-xl mb-2">{title}</h3>
      {subtitle && <p className="text-gray-500 text-sm mb-3">{subtitle}</p>}
      <div className="flex items-center justify-center gap-3 mt-4">
        {oldPrice && <span className="text-gray-400 line-through text-base font-medium">₹{oldPrice}</span>}
        <span className="text-[#F7931E] font-extrabold text-2xl tracking-tight">₹{newPrice}</span>
      </div>
    </div>
  </div>
);

const astrologyServicesData = [
  // ... (Paste the 9 objects from your original astrologyServicesData array here)
  { id: 1, title: "Kundali Analysis", subtitle: "Overall with 3 areas of concern", oldPrice: "15000", newPrice: "11000", icon: <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="2" fill="white" stroke="currentColor" strokeWidth="1.5" /></svg>},
  { id: 2, title: "Match - Matching", subtitle: null, oldPrice: "6000", newPrice: "25000", icon: <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.54L12 21.35Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" /></svg>},
  { id: 3, title: "Marriage Consultation", subtitle: null, oldPrice: "6000", newPrice: "25000", icon: <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" /><path d="M17 3.5L19 5.5L23 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>},
  { id: 4, title: "Progeny/ Children", subtitle: null, oldPrice: "6000", newPrice: "25000", icon: <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C10 2 8.5 3.5 8.5 5.5C8.5 7.5 10 9 12 9C14 9 15.5 7.5 15.5 5.5C15.5 3.5 14 2 12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" /><path d="M5 22V19C5 16.8 6.8 15 9 15H15C17.2 15 19 16.8 19 19V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M3 9L5 7L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M21 9L19 7L17 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>},
  { id: 5, title: "Education", subtitle: null, oldPrice: "6000", newPrice: "25000", icon: <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L2 9L12 15L22 9L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M6 12L6 18L12 21L18 18L18 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 21V15" stroke="currentColor" strokeWidth="1.5" /></svg>},
  { id: 6, title: "Career/ Profession", subtitle: null, oldPrice: "6000", newPrice: "25000", icon: <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" /><path d="M16 21V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V21" stroke="currentColor" strokeWidth="1.5" /><path d="M12 11V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M12 16V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>},
  { id: 7, title: "Name Correction", subtitle: null, oldPrice: "6000", newPrice: "25000", icon: <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="1.5" /><path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="12" r="2" fill="currentColor" /></svg>},
  { id: 8, title: "Muhurata", subtitle: null, oldPrice: "6000", newPrice: "25000", icon: <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" /><path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M4 4L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M20 4L16 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>},
  { id: 9, title: "Good / Bad Times", subtitle: null, oldPrice: "6000", newPrice: "25000", icon: <svg className="w-10 h-10 text-[#F7931E]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L15 8.5L22 9.5L17 14L18.5 21L12 17.5L5.5 21L7 14L2 9.5L9 8.5L12 2Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" /><path d="M12 8V13" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="16" r="1" fill="white" /></svg>}
];

const HomeServices = () => {
  return (
    <div className="bg-[#f5f5f5] py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4 tracking-tight">Our Services</h2>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span className="text-xl">🙏</span><p className="text-lg md:text-xl font-medium">May All The Worlds Be Happy</p><span className="text-xl">🙏</span>
          </div>
        </div>

        {/* Kundali Banner */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-[#f3e0c7] to-[#f7931e] rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-[1.01] duration-300">
            <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-8 gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-10 h-10 md:w-12 md:h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 7H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 11H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 15H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M17 15L19 17L17 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M19 17H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <p className="text-gray-800 font-semibold text-base md:text-lg leading-relaxed">
                  Order Hard Copy of Kundali (Birth Chart) for convenient reference, personal keepsake, detailed layout and easy annotations
                </p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-white/30 transition-all cursor-pointer">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
                <p className="text-white font-bold text-xl md:text-2xl text-center mt-2">₹1100</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#F7931E] rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#F7931E] rounded-full filter blur-3xl"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 relative z-10">
            {astrologyServicesData.map((service, index) => (
              <ServiceCard key={service.id} {...service} index={index} />
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Link to="/services">
            <button className="bg-[#F7931E] hover:bg-[#e0850c] text-white font-bold px-10 py-3.5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105 text-lg tracking-wide">
              View All
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomeServices;