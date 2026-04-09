// client/src/pages/Home.jsx
import React from 'react';
import HeroSection from './home/HeroSection.jsx';
import QuickPanchang from './home/QuickPanchang.jsx';
import HomeServices from './home/HomeServices.jsx';
import NewsArticles from './home/NewsArticles.jsx';
import Testimonials from './home/Testimonials.jsx';

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