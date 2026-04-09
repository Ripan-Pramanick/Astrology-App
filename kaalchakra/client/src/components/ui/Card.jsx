// client/src/components/ui/Card.jsx
import React from 'react';

const Card = ({ children, className = '', padding = true }) => {
  const paddingClass = padding ? 'p-6' : '';
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

export default Card;