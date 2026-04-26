// client/src/components/common/OptimizedParticles.jsx
import React, { useEffect, useRef, useCallback } from 'react';

const OptimizedParticles = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles = [];
    let particleCount = 150; // কমিয়ে 150 করা হয়েছে (পারফরম্যান্সের জন্য)

    // Set canvas size
    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    // Particle class
    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = `rgba(255, ${180 + Math.random() * 75}, ${100 + Math.random() * 155}, ${this.opacity})`;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleDir = 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Boundary check
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
        
        // Twinkle effect
        this.opacity += this.twinkleSpeed * this.twinkleDir;
        if (this.opacity >= 0.8) this.twinkleDir = -1;
        if (this.opacity <= 0.2) this.twinkleDir = 1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
        ctx.fill();
        
        // Glow effect for brighter stars
        if (this.size > 1.5) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity * 0.3})`;
          ctx.fill();
        }
      }
    }

    // Create larger planets (fewer for performance)
    class Planet {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 25 + 10;
        this.speedX = (Math.random() - 0.5) * 0.1;
        this.speedY = (Math.random() - 0.5) * 0.1;
        this.hue = Math.random() * 360;
        this.opacity = Math.random() * 0.08 + 0.03;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < -100) this.x = width + 100;
        if (this.x > width + 100) this.x = -100;
        if (this.y < -100) this.y = height + 100;
        if (this.y > height + 100) this.y = -100;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
        ctx.fill();
        
        // Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity * 0.5})`;
        ctx.fill();
      }
    }

    // Initialize particles
    const init = () => {
      particles = [];
      
      // Stars
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
      
      // Planets (only 5 for performance)
      for (let i = 0; i < 5; i++) {
        particles.push(new Planet());
      }
      
      particlesRef.current = particles;
    };

    // Animation loop
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(10, 10, 42, 0.15)';
      ctx.fillRect(0, 0, width, height);
      
      // Draw all particles
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Handle resize (debounced)
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setCanvasSize();
        init();
      }, 250);
    };

    // Mouse move effect (optional - কমেন্ট করে দিলে আরও ফাস্ট হবে)
    // const handleMouseMove = (e) => {
    //   mouseRef.current.x = e.clientX;
    //   mouseRef.current.y = e.clientY;
    // };

    setCanvasSize();
    init();
    animate();

    window.addEventListener('resize', handleResize);
    // window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      // window.removeEventListener('mousemove', handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        background: 'radial-gradient(ellipse at center, #0a0a2a 0%, #050510 100%)',
        zIndex: 0
      }}
    />
  );
};

export default OptimizedParticles;