// client/src/components/ui/spiner.jsx
import React, { useEffect } from 'react';

const Spiner = () => {
  // 🟢 Sacred Particles Effect (Akshata)
  useEffect(() => {
    const particleContainer = document.getElementById('vedic-particles-container');
    if (!particleContainer) return;

    // Clear old particles if any
    particleContainer.innerHTML = '';

    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'fixed pointer-events-none rounded-full';
      const size = Math.random() * 3 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.background = `radial-gradient(circle, rgba(255, 153, 51, ${Math.random() * 0.5 + 0.2}), rgba(255, 102, 0, 0.2))`;
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      
      // Random animation duration
      const duration = Math.random() * 5 + 4;
      particle.style.animation = `floatVedic ${duration}s infinite ease-in-out`;
      particle.style.opacity = Math.random() * 0.6 + 0.2;
      
      particleContainer.appendChild(particle);
    }
  }, []);

  return (
    <>
      <style>
        {`
          /* 🟢 Custom Animations for Vedic Theme */
          @keyframes floatVedic {
              0% { transform: translateY(0px) translateX(0px) rotate(0deg); opacity: 0.2; }
              50% { transform: translateY(-25px) translateX(12px) rotate(180deg); opacity: 0.7; }
              100% { transform: translateY(-5px) translateX(-5px) rotate(360deg); opacity: 0.3; }
          }
          @keyframes vedicSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          @keyframes vedicSpinReverse { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
          @keyframes omPulse { 0% { opacity: 0.6; text-shadow: 0 0 5px #ff6600; } 100% { opacity: 1; text-shadow: 0 0 20px #ff9933, 0 0 5px #ff3300; } }
          @keyframes lotusGlow { 0% { filter: drop-shadow(0 0 5px #ff9933); transform: scale(0.98); } 100% { filter: drop-shadow(0 0 20px #ff6600); transform: scale(1.05); } }
          
          /* Navagraha Orbit Animations */
          @keyframes grahaOrbit1 { 0% { transform: rotate(0deg) translateX(75px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(75px) rotate(-360deg); } }
          @keyframes grahaOrbit2 { 0% { transform: rotate(60deg) translateX(60px) rotate(-60deg); } 100% { transform: rotate(420deg) translateX(60px) rotate(-420deg); } }
          @keyframes grahaOrbit3 { 0% { transform: rotate(120deg) translateX(88px) rotate(-120deg); } 100% { transform: rotate(480deg) translateX(88px) rotate(-480deg); } }
          @keyframes grahaOrbit4 { 0% { transform: rotate(180deg) translateX(50px) rotate(-180deg); } 100% { transform: rotate(540deg) translateX(50px) rotate(-540deg); } }
          @keyframes grahaOrbit5 { 0% { transform: rotate(240deg) translateX(95px) rotate(-240deg); } 100% { transform: rotate(600deg) translateX(95px) rotate(-600deg); } }
          @keyframes grahaOrbit6 { 0% { transform: rotate(300deg) translateX(68px) rotate(-300deg); } 100% { transform: rotate(660deg) translateX(68px) rotate(-660deg); } }
          
          .shadow-glow { box-shadow: 0 0 8px #ff9933; }
        `}
      </style>

      {/* 🟢 Full Screen Loading Overlay */}
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 overflow-hidden" 
           style={{ background: 'radial-gradient(ellipse at 30% 40%, #1a0a1a 0%, #0d050d 50%, #050208 100%)' }}>
        
        {/* Sacred Background Elements */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.08]" 
             style={{ backgroundImage: 'radial-gradient(circle at 25% 40%, #ff9933 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="fixed inset-0 pointer-events-none opacity-20" 
             style={{ background: 'repeating-linear-gradient(45deg, #ff993310 0px, #ff993310 2px, transparent 2px, transparent 8px)' }}></div>
        
        {/* Particle Container */}
        <div id="vedic-particles-container" className="fixed inset-0 pointer-events-none z-0"></div>

        {/* 🟢 Main Vedic Loading Card */}
        <div className="relative z-10 w-full max-w-sm mx-auto flex flex-col items-center">
          
          {/* Sri Yantra / Navagraha Chakra */}
          <div className="relative flex justify-center mb-8">
            <div className="relative w-56 h-56 md:w-64 md:h-64">
              
              {/* Outer Rings */}
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/40" style={{ animation: 'vedicSpin 20s linear infinite' }}></div>
              <div className="absolute inset-3 rounded-full border border-dashed border-orange-400/30" style={{ animation: 'vedicSpinReverse 24s linear infinite' }}></div>
              <div className="absolute inset-6 rounded-full border border-amber-600/20" style={{ animation: 'vedicSpin 15s linear infinite' }}></div>
              
              {/* 12 Zodiac Markers (Rashis) */}
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 bg-orange-400 rounded-full shadow-glow"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-3 h-3 bg-orange-400/60 rounded-full"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-3 h-3 bg-orange-400/60 rounded-full"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-3 h-3 bg-orange-400/60 rounded-full"></div>
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-500/40 rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-2 h-2 bg-amber-500/40 rounded-full"></div>
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-amber-500/40 rounded-full"></div>
                <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-amber-500/40 rounded-full"></div>
              </div>
              
              {/* Lotus Petals */}
              <div className="absolute inset-8">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-to-b from-amber-400/60 to-orange-600/40 rounded-full blur-sm" style={{ animation: 'lotusGlow 2.5s ease-in-out infinite alternate', top: '-6px' }}></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-5 bg-gradient-to-t from-amber-400/60 to-orange-600/40 rounded-full blur-sm" style={{ animation: 'lotusGlow 2.5s ease-in-out infinite alternate', bottom: '-6px' }}></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-r from-amber-400/60 to-orange-600/40 rounded-full blur-sm" style={{ animation: 'lotusGlow 2.5s ease-in-out infinite alternate', left: '-6px' }}></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-l from-amber-400/60 to-orange-600/40 rounded-full blur-sm" style={{ animation: 'lotusGlow 2.5s ease-in-out infinite alternate', right: '-6px' }}></div>
              </div>
              
              {/* Central OM / Bindu */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-orange-500/20 to-amber-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-amber-400/50 shadow-xl z-20">
                <span className="text-4xl font-bold text-amber-300" style={{ animation: 'omPulse 2s ease-in-out infinite' }}>ॐ</span>
              </div>
              
              {/* Navagraha (Orbiting Planets) */}
              <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg" style={{ animation: 'grahaOrbit1 6s linear infinite' }}></div>
              <div className="absolute top-1/2 left-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-gray-200 to-slate-300 shadow-md" style={{ animation: 'grahaOrbit2 8s linear infinite' }}></div>
              <div className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg" style={{ animation: 'grahaOrbit3 10s linear infinite' }}></div>
              <div className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 shadow-md" style={{ animation: 'grahaOrbit4 7s linear infinite' }}></div>
              <div className="absolute top-1/2 left-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-yellow-600 shadow-lg" style={{ animation: 'grahaOrbit5 9s linear infinite' }}></div>
              <div className="absolute top-1/2 left-1/2 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-pink-300 to-rose-500 shadow-md" style={{ animation: 'grahaOrbit6 5.5s linear infinite' }}></div>
            </div>
          </div>

          {/* Text Below Spinner */}
          <div className="text-center mt-6">
             <h2 className="text-[#f7e9cd] font-serif text-xl tracking-widest mb-1 animate-pulse">Calculating Cosmic Alignments</h2>
             <div className="text-amber-600/60 text-xs tracking-wider font-semibold">
                श्री गणेशाय नमः • Reading the Stars
             </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Spiner;