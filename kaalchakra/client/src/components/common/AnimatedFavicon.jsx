// client/src/components/common/AnimatedFavicon.jsx
import React, { useEffect, useRef } from 'react';

const AnimatedFavicon = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      frameRef.current++;
      
      // Clear canvas
      ctx.clearRect(0, 0, 64, 64);
      
      // Draw background
      ctx.fillStyle = '#0a0a2a';
      ctx.fillRect(0, 0, 64, 64);
      
      // Draw outer ring
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(${Date.now() / 20 % 360}, 70%, 60%)`;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw inner ring
      ctx.beginPath();
      ctx.arc(32, 32, 25, 0, Math.PI * 2);
      ctx.strokeStyle = `hsl(${Date.now() / 30 % 360}, 70%, 50%)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Draw rotating line
      const angle = Date.now() / 50;
      const x = 32 + 20 * Math.cos(angle);
      const y = 32 + 20 * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(32, 32);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw center dot
      ctx.beginPath();
      ctx.arc(32, 32, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + Math.sin(Date.now() / 500) * 0.3})`;
      ctx.fill();
      
      // Convert canvas to data URL and set as favicon
      const dataUrl = canvas.toDataURL('image/x-icon');
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = dataUrl;
      document.head.appendChild(link);
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  return null;
};

export default AnimatedFavicon;