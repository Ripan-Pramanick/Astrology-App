import React from 'react';
import HeroSection from '../components/home/HeroSection';
import PanchangCard from '../components/home/PanchangCard';
import ServicesPreview from '../components/home/ServicesPreview';
import SocialFeed from '../components/home/SocialFeed';
import NewsPreview from '../components/home/NewsPreview';
import TestimonialSection from '../components/home/TestimonialSection';

const Home = () => {
  return (
    <div>
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-8">
            <PanchangCard />
            <SocialFeed />
            <NewsPreview />
          </div>
          <div className="md:col-span-2">
            <ServicesPreview />
          </div>
        </div>
      </div>
      <TestimonialSection />
    </div>
  );
};

export default Home;