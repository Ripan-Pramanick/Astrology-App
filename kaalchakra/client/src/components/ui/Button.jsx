// client/src/components/ui/Button.jsx (enhanced)
import React from 'react';
import { SparkleButton } from './Sparkle';

const Button = ({ children, variant = 'primary', size = 'md', className = '', onClick, disabled, ...props }) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:scale-105 focus:ring-orange-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    outline: 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50 focus:ring-orange-500',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-400'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg'
  };
  
  const buttonClass = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;
  
  if (variant === 'primary') {
    return (
      <SparkleButton onClick={onClick} className={buttonClass} sparkleColor="#FFD700">
        {children}
      </SparkleButton>
    );
  }
  
  return (
    <button onClick={onClick} disabled={disabled} className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;