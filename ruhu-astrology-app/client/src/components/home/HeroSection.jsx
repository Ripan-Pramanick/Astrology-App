import React from 'react';
import Button from '../ui/Button';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary to-primary/90 text-white py-20">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-relaxed">
          ॐ गन् गणपत् र नगो नमः
        </h1>
        <p className="text-lg md:text-xl mb-8">श्री हिंदू विजयक नगो नमः अष्टविनायक नगो नमः गणपति बाष्प मोदया।</p>
        <Button variant="secondary">Explore Now</Button>
      </div>
    </div>
  );
};

export default HeroSection;