// client/src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { services, testimonials, articles, panchang } from '../data/mockData';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ॐ गन् गणपत् र नमो नमः
          </h1>
          <p className="text-xl mb-8">श्री हिंदू विजयक नमो नमः अष्टविनायक नमो नमः गणपति बाष्प मोदया।</p>
          <Button variant="secondary" size="lg">
            <Link to="/services">Explore Services</Link>
          </Button>
        </div>
      </div>

      {/* Panchang & Quick Info */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8">
          <Card className="text-center">
            <h3 className="text-2xl font-bold mb-4">Aaj Ka Panchang</h3>
            <p className="text-gray-600">{panchang.date}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="font-semibold">Tithi</p>
                <p>{panchang.tithi}</p>
              </div>
              <div>
                <p className="font-semibold">Nakshatra</p>
                <p>{panchang.nakshatra}</p>
              </div>
              <div>
                <p className="font-semibold">Yoga</p>
                <p>{panchang.yoga}</p>
              </div>
              <div>
                <p className="font-semibold">Time</p>
                <p>{panchang.time}</p>
              </div>
            </div>
          </Card>
          <Card className="text-center">
            <h3 className="text-2xl font-bold mb-4">Navagraha</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Rahu</p>
                <p>{panchang.navagraha.Rahu}</p>
              </div>
              <div>
                <p className="font-semibold">Ketu</p>
                <p>{panchang.navagraha.Ketu}</p>
              </div>
            </div>
            <hr className="my-4" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Weekday</p>
                <p>{panchang.weekdays.weekday}</p>
              </div>
              <div>
                <p className="font-semibold">Weekend</p>
                <p>{panchang.weekdays.weekend}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Services</h2>
            <p className="text-gray-600 mt-2">May All The Worlds Be Happy</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl">{service.icon}</span>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-lg font-bold text-indigo-600">{service.price}</span>
                    {service.originalPrice && (
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        {service.originalPrice}
                      </span>
                    )}
                  </div>
                  <Button size="sm" onClick={() => window.location.href = '/kundli'}>
                    Order
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services" className="text-indigo-600 hover:underline">
              View All Services →
            </Link>
          </div>
        </div>
      </div>

      {/* News & Articles */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">News & Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <p className="text-sm text-gray-500">{article.date}</p>
                  <h3 className="text-xl font-semibold mt-2">{article.title}</h3>
                  <p className="text-gray-600 mt-2">{article.excerpt}</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Read More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Customer Thoughts</h2>
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
    </div>
  );
};

export default Home;