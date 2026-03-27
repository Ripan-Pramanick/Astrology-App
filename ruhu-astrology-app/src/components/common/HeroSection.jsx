import React from 'react';
import Button from '../common/Button';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary to-primary/90 text-white py-20">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          ॐ गन् गणपत् र नगो नमः
        </h1>
        <p className="text-xl mb-8">Discover Your Cosmic Path with Ancient Wisdom</p>
        <Button variant="secondary">Explore Now</Button>
      </div>
    </div>
  );
};

export default HeroSection;