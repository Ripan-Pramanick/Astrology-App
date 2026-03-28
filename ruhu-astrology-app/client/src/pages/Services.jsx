import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import TestimonialSection from '../components/home/TestimonialSection';

const services = [
  { name: 'Order Hard Copy of Kundali', price: '₹1100', desc: 'For convenient reference, personal keepsake, detailed layout and easy annotations' },
  { name: 'Kundali Analysis', price: '₹86000', original: '₹21000', desc: 'Overall with 3 areas of concern' },
  { name: 'Muhurata', price: '₹86000', original: '₹25000' },
  { name: 'Career/Profession', price: '₹86000', original: '₹25000' },
  { name: 'Marriage Consultation', price: '₹86000', original: '₹25000' },
  { name: 'Progeny/Children', price: '₹86000', original: '₹25000' },
  { name: 'Health', price: '₹86000', original: '₹25000' },
  { name: 'Education', price: '₹86000', original: '₹25000' },
  { name: 'Relationship', price: '₹86000', original: '₹25000' },
  { name: 'Match Matching', price: '₹86000', original: '₹25000' },
  { name: 'Good/Bad Times', price: '₹86000', original: '₹25000' },
  { name: 'Name Correction', price: '₹86000', original: '₹25000' },
];

const Services = () => {
  return (
    <div>
      <PageHeader title="Services" breadcrumb="Services" />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Our Services</h2>
          <p className="text-gray-600">May All The Worlds Be Happy</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => (
            <Card key={idx}>
              <h3 className="font-bold text-lg text-primary mb-2">{service.name}</h3>
              {service.desc && <p className="text-sm text-gray-600 mb-3">{service.desc}</p>}
              <div className="flex justify-between items-center mt-4">
                <div>
                  {service.original && (
                    <span className="line-through text-gray-400 text-sm">{service.original}</span>
                  )}
                  <span className="text-accent font-bold text-xl ml-2">{service.price}</span>
                </div>
                <Link to={`/services/${idx}`} className="text-accent hover:text-orange-600">
                  View →
                </Link>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-amber-50 p-8 rounded-xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-4">Every Problem Have A Solution</h3>
            <p className="text-gray-700 mb-6">
              Choose From our Services Offerings or Submit your query if it is a unique ask and not listed
            </p>
            <Link to="/kundli">
              <Button>Submit Unique Query</Button>
            </Link>
          </div>
        </div>
      </div>
      <TestimonialSection />
    </div>
  );
};

export default Services;