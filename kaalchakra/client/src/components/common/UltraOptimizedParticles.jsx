// client/src/components/common/UltraOptimizedParticles.jsx
import React, { useEffect, useRef } from 'react';

const UltraOptimizedParticles = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars = [];
    let shootingStars = [];
    let lastShootingStarTime = 0;
    let starCount = 200; // Dark theme এ বেশি তারকা (ভালো দেখায়)

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    // Star class
    class Star {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleDir = 1;
        // Dark theme এর জন্য গাঢ় রং
        this.color = `rgba(255, ${200 + Math.random() * 55}, ${100 + Math.random() * 155}, ${this.opacity})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;
        
        this.opacity += this.twinkleSpeed * this.twinkleDir;
        if (this.opacity >= 0.8) this.twinkleDir = -1;
        if (this.opacity <= 0.2) this.twinkleDir = 1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // গ্লো ইফেক্ট
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = `rgba(255, 215, 0, ${this.opacity * 0.8})`;
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
        ctx.fill();
        
        // Reset shadow for other drawings
        ctx.shadowBlur = 0;
      }
    }

    // Shooting star class
    class ShootingStar {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.active = true;
        this.x = Math.random() * width;
        this.y = Math.random() * height * 0.3;
        this.length = Math.random() * 80 + 40;
        this.speedX = (Math.random() * 8 + 5);
        this.speedY = (Math.random() * 4 + 2);
        this.opacity = 0.8;
        this.age = 0;
        this.maxAge = 60;
      }
      
      update() {
        if (!this.active) return;
        
        this.x += this.speedX;
        this.y += this.speedY;
        this.age++;
        this.opacity -= 0.02;
        
        if (this.x > width + 100 || this.y > height + 100 || this.age > this.maxAge) {
          this.active = false;
        }
      }
      
      draw() {
        if (!this.active) return;
        
        const gradient = ctx.createLinearGradient(this.x, this.y, this.x - this.length, this.y - this.length * 0.5);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length, this.y - this.length * 0.5);
        ctx.lineWidth = 2;
        ctx.strokeStyle = gradient;
        ctx.stroke();
        
        // Star head
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 200, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Planet class (dark theme)
    class Planet {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 30 + 15;
        this.speedX = (Math.random() - 0.5) * 0.05;
        this.speedY = (Math.random() - 0.5) * 0.05;
        this.hue = Math.random() * 360;
        this.opacity = Math.random() * 0.15 + 0.05;
        this.glowSize = this.size * 1.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x < -200) this.x = width + 200;
        if (this.x > width + 200) this.x = -200;
        if (this.y < -200) this.y = height + 200;
        if (this.y > height + 200) this.y = -200;
      }

      draw() {
        // Outer glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity * 0.5})`;
        ctx.fill();
        
        // Planet body
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          this.x - this.size * 0.3, 
          this.y - this.size * 0.3, 
          0,
          this.x, 
          this.y, 
          this.size
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 65%, ${this.opacity * 1.5})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 80%, 40%, ${this.opacity})`);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Initialize particles
    const initParticles = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
      
      // Add some planets (dark theme - কম সংখ্যক)
      for (let i = 0; i < 5; i++) {
        stars.push(new Planet());
      }
      
      shootingStars = [];
      for (let i = 0; i < 3; i++) {
        shootingStars.push(new ShootingStar());
      }
    };

    // Animation loop
    let frameCount = 0;
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas with transparent (so background shows through)
      ctx.clearRect(0, 0, width, height);
      
      // Draw stars
      stars.forEach(star => {
        star.update();
        star.draw();
      });
      
      // Generate shooting stars occasionally
      frameCount++;
      if (frameCount % 200 === 0 && shootingStars.some(s => !s.active)) {
        const inactiveStar = shootingStars.find(s => !s.active);
        if (inactiveStar) inactiveStar.reset();
      }
      
      // Draw shooting stars
      shootingStars.forEach(star => {
        star.update();
        star.draw();
      });
      
      requestAnimationFrame(animate);
    };

    setCanvasSize();
    initParticles();
    animate();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setCanvasSize();
        initParticles();
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ 
        background: 'transparent', // No background - লাইট থিম অপরিবর্তিত থাকে
        zIndex: 0
      }}
    />
  );
};

export default UltraOptimizedParticles;