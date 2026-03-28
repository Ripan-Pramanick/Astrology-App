// client/src/pages/Services.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { services } from '../data/mockData';

const Services = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Our Services</h1>
        <p className="text-gray-600">May All The Worlds Be Happy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
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

      <div className="bg-indigo-50 rounded-lg p-8 mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Every Problem Have A Solution</h2>
        <p className="text-gray-700 mb-6">
          Choose From our Services Offerings or Submit your query if it is a unique ask and not listed
        </p>
        <Button variant="primary" size="lg" onClick={() => window.location.href = '/contact'}>
          Submit Your Query
        </Button>
      </div>
    </div>
  );
};

export default Services;