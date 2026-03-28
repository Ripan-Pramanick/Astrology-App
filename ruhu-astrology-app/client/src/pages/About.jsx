import React from 'react';
import PageHeader from '../components/common/PageHeader';
import TestimonialSection from '../components/home/TestimonialSection';

const About = () => {
  return (
    <div>
      <PageHeader title="About Us" breadcrumb="About" />
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-gray-300 rounded-xl h-96 flex items-center justify-center">
              <span className="text-gray-500">About Image Placeholder</span>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary mb-6">About Vedic Astrology</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Vedic astrology, also known as Jyotish Shastra or Jyotisha, is a traditional system of astrology that originated in ancient India. 
                It is based on the Vedas, the oldest sacred texts of Hinduism, and has been practiced for thousands of years.
              </p>
              <p>
                Vedic Astrology or Jyotisha connects human life with cosmic order and karmic patterns. It is not just about making predictions or analyzing personality traits, 
                but about understanding the cosmic play of karma, the soul's journey, and the individual's role in the greater scheme of the universe.
              </p>
              <p>
                Vedic astrology offers guidance, self-awareness, and a deeper understanding of life's purpose and challenges. 
                Rooted in ancient wisdom, it provides insights into the karmic forces at play and helps us live more fulfilling and purposeful lives, 
                making informed choices leading to material and spiritual success.
              </p>
            </div>
          </div>
        </div>
      </div>
      <TestimonialSection />
    </div>
  );
};

export default About;