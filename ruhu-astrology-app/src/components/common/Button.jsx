import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-6 py-2 rounded-full transition-all duration-300 font-semibold';
  const variants = {
    primary: 'bg-accent text-primaryDark hover:bg-accentDark',
    secondary: 'bg-primary text-white hover:bg-primaryDark',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-primaryDark',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;