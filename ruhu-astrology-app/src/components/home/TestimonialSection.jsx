import React from 'react';
import Card from '../common/Card';

const TestimonialSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">Our Customer Thoughts</h2>
        <div className="max-w-2xl mx-auto">
          <Card>
            <p className="text-gray-700 mb-4">
              Accumsan lacus vel facilisis volutpat est. Ornare suspendisse sed nisi lacus sed viverra tellus in. 
              Lobortis scelerisque fermentum dui faucibus. Et odio pellentesque diam volutpat commodo.
            </p>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-primary">Saara - Manager</h4>
                <p className="text-sm text-gray-500">Zodiac - Leo</p>
              </div>
              <div className="text-accent">★★★★☆</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;