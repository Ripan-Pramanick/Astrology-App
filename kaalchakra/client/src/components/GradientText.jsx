// client/src/components/GradientText.jsx
import React from 'react';

const GradientText = ({ 
  children, 
  className = '', 
  as: Component = 'span',
  fromColor = '#b8860b',
  toColor = '#d4af37',
  fontSize = 'clamp(0.75rem, 3vw, 0.875rem)',
  fontWeight = 'bold'
}) => {
  const style = {
    background: `linear-gradient(135deg, ${fromColor}, ${toColor})`,
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    fontSize: fontSize,
    fontWeight: fontWeight,
    letterSpacing: '0.05em'
  };

  return React.createElement(
    Component,
    { className, style },
    children
  );
};

export default GradientText;