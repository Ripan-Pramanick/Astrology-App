// client/src/pages/About.jsx
import React from 'react';
import Card from '../components/ui/Card';
import { testimonials } from '../data/mockData';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">About Vedic Astrology</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Vedic astrology, also known as Jyotish Shastra or Jyotisha, is a traditional system of astrology that originated in ancient India. It is based on the Vedas, the oldest sacred texts of Hinduism, and has been practiced for thousands of years.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <p className="text-gray-700 mb-4">
            Vedic Astrology or Jyotisha connects human life with cosmic order and karmic patterns. It is not just about making predictions or analyzing personality traits, but about understanding the cosmic play of karma, the soul's journey, and the individual's role in the greater scheme of the universe.
          </p>
          <p className="text-gray-700 mb-4">
            Vedic astrology offers guidance, self-awareness, and a deeper understanding of life's purpose and challenges. Rooted in ancient wisdom, it provides insights into the karmic forces at play and helps us live more fulfilling and purposeful lives, making informed choices leading to material and spiritual success.
          </p>
          <p className="text-gray-700">
            At Ruhu Astrology, we combine traditional Jyotish knowledge with modern technology to provide accurate and personalized astrological services. Our team of experienced astrologers is dedicated to helping you navigate life's complexities.
          </p>
        </div>
        <div className="bg-indigo-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
          <p className="text-gray-700 mb-4">
            To empower individuals with the wisdom of the stars, helping them make informed decisions and live in harmony with cosmic rhythms.
          </p>
          <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
          <p className="text-gray-700">
            To be a trusted bridge between ancient Vedic wisdom and modern seekers, offering clarity and direction in all aspects of life.
          </p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">What Our Clients Say</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <div className="flex items-center gap-2 text-yellow-500 mb-3">
                {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
              </div>
              <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
              <div className="border-t pt-3">
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
                <p className="text-sm text-gray-500">Zodiac: {testimonial.zodiac}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;