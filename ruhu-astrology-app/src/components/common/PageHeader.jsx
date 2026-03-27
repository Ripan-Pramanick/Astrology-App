import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const PageHeader = ({ title, breadcrumb }) => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary/90 text-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <div className="flex items-center space-x-2 text-sm">
          <Link to="/" className="hover:text-accent transition">
            <Home size={16} className="inline mr-1" />
            Home
          </Link>
          {breadcrumb && (
            <>
              <span>/</span>
              <span>{breadcrumb}</span>
            </>
          )}
          {title !== 'Home' && (
            <>
              <span>/</span>
              <span className="text-accent">{title}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;