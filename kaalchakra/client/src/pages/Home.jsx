// client/src/pages/Home.jsx
import React, { useEffect, useRef } from 'react';
import HeroSection from './home/HeroSection.jsx';
import QuickPanchang from './home/QuickPanchang.jsx';
import HomeServices from './home/HomeServices.jsx';
import NewsArticles from './home/NewsArticles.jsx';
import Testimonials from './home/Testimonials.jsx';
// import AIHoroscope from './home/AIHoroscope.jsx';

const Home = () => {
  // Smooth scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Intersection Observer for lazy loading sections
  const sectionRefs = {
    hero: useRef(null),
    panchang: useRef(null),
    services: useRef(null),
    articles: useRef(null),
    testimonials: useRef(null),
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Basic meta tags for localhost */}
      <title>Kaal Chakra | Vedic Astrology & Kundli Analysis Platform</title>
      <meta 
        name="description" 
        content="Discover ancient wisdom, planetary insights, and practical guidance for modern life. Get personalized Kundli analysis, horoscope matching, and astrological consultations at Kaal Chakra." 
      />
      <meta 
        name="keywords" 
        content="vedic astrology, kundli, horoscope, panchang, matchmaking, astrologer, jyotish, birth chart, zodiac signs, planetary positions" 
      />
      <meta name="author" content="Kaal Chakra" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      <div className="home-container overflow-x-hidden">
        {/* Hero Section */}
        <section 
          ref={sectionRefs.hero}
          className="opacity-0 transition-all duration-700"
        >
          <HeroSection />
        </section>

        {/* Quick Panchang Section */}
        <section 
          ref={sectionRefs.panchang}
          className="opacity-0 transition-all duration-700 delay-100"
        >
          <QuickPanchang />
        </section>

        {/* Services Section */}
        <section 
          ref={sectionRefs.services}
          className="opacity-0 transition-all duration-700 delay-200"
        >
          <HomeServices />
        </section>

        {/* News & Articles Section */}
        <section 
          ref={sectionRefs.articles}
          className="opacity-0 transition-all duration-700 delay-300"
        >
          <NewsArticles />
        </section>

        {/* Testimonials Section */}
        <section 
          ref={sectionRefs.testimonials}
          className="opacity-0 transition-all duration-700 delay-400"
        >
          <Testimonials />
        </section>

        {/* Optional: AI Horoscope Section (commented) */}
        {/* <section className="opacity-0 transition-all duration-700 delay-500">
          <AIHoroscope />
        </section> */}

        {/* Floating Action Button for quick consultation */}
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <a
            href="/contact"
            className="flex items-center justify-center w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            aria-label="Quick Consultation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </a>
        </div>

        {/* Scroll to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 hidden md:flex items-center justify-center w-10 h-10 bg-white text-orange-500 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110 border border-orange-200"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .home-container section {
          will-change: transform, opacity;
        }
      `}</style>
    </>
  );
};

export default Home;