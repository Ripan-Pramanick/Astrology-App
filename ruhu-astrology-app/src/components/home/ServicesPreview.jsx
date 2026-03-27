import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';

const services = [
  { name: 'Kundali Analysis', price: '₹86000', original: '₹21000' },
  { name: 'Match Matching', price: '₹86000', original: '₹25000' },
  { name: 'Marriage Consultation', price: '₹86000', original: '₹25000' },
  { name: 'Career/Profession', price: '₹86000', original: '₹25000' },
];

const ServicesPreview = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Our Services</h2>
      <div className="space-y-4">
        {services.map((service, idx) => (
          <Card key={idx} hover={false}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{service.name}</h3>
                <div className="text-sm">
                  <span className="line-through text-gray-400">{service.original}</span>
                  <span className="text-accent font-bold ml-2">{service.price}</span>
                </div>
              </div>
              <Link to="/services" className="text-accent hover:text-orange-600">
                View →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServicesPreview;