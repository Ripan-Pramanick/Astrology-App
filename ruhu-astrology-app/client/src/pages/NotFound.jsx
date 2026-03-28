import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-6xl font-bold text-[#ff9933] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">দুঃখিত, আপনি যে পেজটি খুঁজছেন তা খুঁজে পাওয়া যায়নি।</p>
      <Link 
        to="/" 
        className="bg-[#ff9933] text-white px-6 py-2 rounded-md hover:bg-orange-600 transition font-semibold"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;