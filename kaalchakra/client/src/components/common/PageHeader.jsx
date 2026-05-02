import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle }) => {
  return (
    <div className="bg-[#fcf8f2] py-16 border-b-4 border-[#ff9933]">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          {title}
        </h1>
        {subtitle && (
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;