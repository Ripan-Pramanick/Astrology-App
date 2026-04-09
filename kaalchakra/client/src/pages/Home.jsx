// client/src/pages/Home.jsx
import React from 'react';
import HeroSection from './home/HeroSection';
import QuickPanchang from './home/QuickPanchang';
import HomeServices from './home/HomeServices';
import NewsArticles from './home/NewsArticles';
import Testimonials from './home/Testimonials';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <QuickPanchang />
      <HomeServices />
      <NewsArticles />
      <Testimonials />
    </div>
  );
};

export default Home;