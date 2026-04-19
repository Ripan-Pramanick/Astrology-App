// client/src/components/ui/Sparkle.jsx
import React, { useEffect, useState } from 'react';

export const SparkleButton = ({ children, onClick, className = '', sparkleColor = '#F7931E', disabled = false }) => {
  const [sparkles, setSparkles] = useState([]);
  const buttonRef = React.useRef(null);

  const handleClick = (e) => {
    if (disabled) return;
    
    const rect = buttonRef.current?.getBoundingClientRect();
    const newSparkles = [];
    
    for (let i = 0; i < 15; i++) {
      newSparkles.push({
        id: Date.now() + i,
        x: Math.random() * (rect?.width || 100),
        y: Math.random() * (rect?.height || 40),
        size: Math.random() * 8 + 4,
        delay: Math.random() * 300
      });
    }
    
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 1500);
    
    if (onClick) onClick(e);
  };

  return (
    <div ref={buttonRef} className="relative inline-block">
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${className}`}
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
      {sparkles.map((spark) => (
        <SparkleIcon
          key={spark.id}
          x={spark.x}
          y={spark.y}
          size={spark.size}
          color={sparkleColor}
          delay={spark.delay}
        />
      ))}
    </div>
  );
};

const SparkleIcon = ({ x, y, size, color, delay }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        animation: 'sparkle 1.5s ease-out forwards',
        animationDelay: `${delay}ms`
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
          fill={color}
          stroke={color}
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

export const BackgroundSparkles = ({ count = 30, colors = ['#F7931E', '#FFD700', '#FF6B6B'] }) => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    const newSparkles = [];
    for (let i = 0; i < count; i++) {
      newSparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 5000,
      });
    }
    setSparkles(newSparkles);
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((spark) => (
        <div
          key={spark.id}
          className="absolute animate-pulse"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            animationDelay: `${spark.delay}ms`,
            animationDuration: '3s'
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" style={{ width: spark.size, height: spark.size }}>
            <path
              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
              fill={spark.color}
              opacity="0.4"
            />
          </svg>
        </div>
      ))}
      <style jsx>{`
        @keyframes sparkle {
          0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(180deg);
          }
          100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
          }
        }
        .animate-pulse {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};