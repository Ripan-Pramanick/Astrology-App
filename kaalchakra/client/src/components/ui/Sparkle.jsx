import React from 'react';

export const SparkleButton = ({ children, onClick, className = '', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${className}`}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export const SparkleText = ({ children, className = '' }) => {
  return <span className={`inline-block ${className}`}>{children}</span>;
};

export const BackgroundSparkles = ({ children }) => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/20 to-amber-50/20"></div>
      {children}
    </div>
  );
};