// client/src/components/common/SimpleStarParticles.jsx
import React, { useEffect, useState } from 'react';

const SimpleStarParticles = () => {
  const [stars, setStars] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    // Generate brighter stars (আরও উজ্জ্বল তারকা)
    const starCount = 500;
    const newStars = [];
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 4 + 1.5,
        opacity: Math.random() * 0.8 + 0.4,
        animationDelay: Math.random() * 5,
        color: `rgba(255, ${210 + Math.random() * 45}, ${120 + Math.random() * 135}, ${Math.random() * 0.7 + 0.5})`
      });
    }
    setStars(newStars);

    // Generate glowing planets (আলোকিত গ্রহ)
    const planetCount = 20;
    const newPlanets = [];
    for (let i = 0; i < planetCount; i++) {
      newPlanets.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 80 + 25,
        animationDuration: 25 + Math.random() * 25,
        animationDelay: Math.random() * 10,
        color: `rgba(${140 + Math.random() * 115}, ${100 + Math.random() * 155}, ${180 + Math.random() * 75}, ${Math.random() * 0.12 + 0.05})`,
        glowColor: `rgba(${180 + Math.random() * 75}, ${150 + Math.random() * 105}, ${220 + Math.random() * 35}, ${Math.random() * 0.15 + 0.08})`
      });
    }
    setPlanets(newPlanets);

    // Generate shooting stars (উল্কা)
    const shootingStarCount = 8;
    const newShootingStars = [];
    for (let i = 0; i < shootingStarCount; i++) {
      newShootingStars.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        angle: Math.random() * 360,
        animationDelay: Math.random() * 15,
        duration: 2 + Math.random() * 3,
        active: false
      });
    }
    setShootingStars(newShootingStars);

    // Animate shooting stars
    const interval = setInterval(() => {
      setShootingStars(prev => prev.map(star => ({
        ...star,
        active: true,
        left: Math.random() * 100,
        top: Math.random() * 100,
        angle: 45 + Math.random() * 90
      })));
      
      setTimeout(() => {
        setShootingStars(prev => prev.map(star => ({ ...star, active: false })));
      }, 3000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ background: 'radial-gradient(ellipse at center, #0a0a2a 0%, #050510 100%)' }}>
      
      {/* Stars Background - Brighter */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full animate-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.animationDelay}s`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
          }}
        />
      ))}
      
      {/* Glowing Planets */}
      {planets.map((planet) => (
        <div
          key={`planet-${planet.id}`}
          className="absolute rounded-full animate-float"
          style={{
            left: `${planet.left}%`,
            top: `${planet.top}%`,
            width: `${planet.size}px`,
            height: `${planet.size}px`,
            animationDuration: `${planet.animationDuration}s`,
            animationDelay: `${planet.animationDelay}s`,
            background: `radial-gradient(circle at 35% 35%, ${planet.color}, rgba(20, 10, 40, 0.3))`,
            boxShadow: `0 0 ${planet.size / 3}px ${planet.glowColor}, inset 0 0 20px rgba(255,255,255,0.1)`,
            border: '1px solid rgba(255,255,255,0.15)',
            backdropFilter: 'blur(1px)'
          }}
        />
      ))}
      
      {/* Shooting Stars */}
      {shootingStars.map((star) => star.active && (
        <div
          key={`shooting-${star.id}`}
          className="absolute animate-shooting"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            transform: `rotate(${star.angle}deg)`,
            animationDuration: `${star.duration}s`,
            animationDelay: '0s'
          }}
        >
          <div className="w-1 h-1 bg-white rounded-full" />
          <div className="absolute top-0 left-0 w-20 h-0.5" style={{ backgroundImage: 'linear-gradient(to right, #ffffff, #808080)' }} />
        </div>
      ))}
      
      {/* Subtle Nebula Clouds */}
      <div className="absolute top-[10%] left-[5%] w-[300px] h-[300px] rounded-full bg-purple-500/5 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl animate-pulse-slow-delayed" />
      <div className="absolute top-[40%] left-[30%] w-[250px] h-[250px] rounded-full bg-pink-500/5 blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-[10%] left-[20%] w-[350px] h-[350px] rounded-full bg-cyan-500/5 blur-3xl animate-pulse-slow-delayed" />
      
      {/* Milky Way Effect */}
      <div className="absolute inset-0  opacity-30" style={{ backgroundImage: 'linear-gradient(to top, transparent, rgba(255, 255, 255, 0.05), transparent)' }} />
      
      <style>{`
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.2; 
            transform: scale(1); 
          }
          50% { 
            opacity: 0.9; 
            transform: scale(1.3);
            box-shadow: 0 0 12px currentColor;
          }
        }
        
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg); 
          }
          25% { 
            transform: translateY(-15px) translateX(12px) rotate(3deg); 
          }
          50% { 
            transform: translateY(0px) translateX(25px) rotate(0deg); 
          }
          75% { 
            transform: translateY(15px) translateX(12px) rotate(-3deg); 
          }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(8px); }
          50% { transform: translateY(0px) translateX(15px); }
          75% { transform: translateY(10px) translateX(8px); }
        }
        
        @keyframes shooting {
          0% {
            transform: translateX(0) translateY(0) rotate(var(--angle));
            opacity: 1;
          }
          100% {
            transform: translateX(-200px) translateY(100px) rotate(var(--angle));
            opacity: 0;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes pulse-slow-delayed {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.08); }
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        .animate-float {
          animation: float 22s ease-in-out infinite;
        }
        
        .animate-shooting {
          animation: shooting var(--duration, 2s) linear forwards;
          --angle: 45deg;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 12s ease-in-out infinite;
        }
        
        .animate-pulse-slow-delayed {
          animation: pulse-slow-delayed 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SimpleStarParticles;