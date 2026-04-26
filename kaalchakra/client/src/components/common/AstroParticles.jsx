// client/src/components/common/AstroParticles.jsx
import React, { useEffect, useRef } from 'react';

const AstroParticles = () => {
  const canvasRef = useRef(null);
  const matterRef = useRef(null);

  useEffect(() => {
    // Dynamic import for Matter.js
    const initMatter = async () => {
      const Matter = await import('matter-js');
      
      // Load attractors plugin
      const { default: MatterAttractors } = await import('matter-attractors');
      Matter.use(MatterAttractors);

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      let dimensions = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      // Astro Color Palette (Space themed)
      const colorPalette = {
        stars: ['#FFD700', '#FFF8DC', '#FFE4B5', '#F0E68C', '#FFFACD'], // Gold/Yellow tones
        planets: ['#EBCB8B', '#A3BE8C', '#B48EAD', '#88C0D0', '#5E81AC', '#D8DEE9', '#BF616A', '#D08770'],
        nebula: ['#4C566A', '#434C5E', '#3B4252', '#2E3440', '#81A1C1', '#8FBCBB']
      };

      function getRandomColor(type = 'planets') {
        if (type === 'stars') {
          return colorPalette.stars[Math.floor(Math.random() * colorPalette.stars.length)];
        }
        return colorPalette.planets[Math.floor(Math.random() * colorPalette.planets.length)];
      }

      function getRandomStarColor() {
        const starColors = ['#FFD700', '#FFF8DC', '#FFE4B5', '#F0E68C', '#FFDAB9', '#FFFACD'];
        return starColors[Math.floor(Math.random() * starColors.length)];
      }

      function setCanvasSize() {
        if (!canvas) return;
        canvas.width = dimensions.width;
        canvas.height = dimensions.height;
      }

      setCanvasSize();

      const { Engine, Events, Runner, Render, World, Body, Mouse, Common, Bodies, Vertices } = Matter;

      const engine = Engine.create();
      engine.world.gravity.y = 0;
      engine.world.gravity.x = 0;
      engine.world.gravity.scale = 0;

      const render = Render.create({
        element: canvas,
        engine: engine,
        options: {
          width: dimensions.width,
          height: dimensions.height,
          wireframes: false,
          background: 'transparent',
          pixelRatio: window.devicePixelRatio,
        },
      });

      const runner = Runner.create();
      const world = engine.world;
      world.gravity.scale = 0;

      // Create central attractor (like a cosmic center)
      const attractiveBody = Bodies.circle(
        dimensions.width / 2,
        dimensions.height / 2,
        Math.max(dimensions.width / 40, dimensions.height / 40),
        {
          render: {
            fillStyle: 'rgba(136, 192, 208, 0.15)',
            strokeStyle: 'rgba(136, 192, 208, 0.3)',
            lineWidth: 2,
          },
          isStatic: true,
          plugin: {
            attractors: [
              function (bodyA, bodyB) {
                return {
                  x: (bodyA.position.x - bodyB.position.x) * 1e-5,
                  y: (bodyA.position.y - bodyB.position.y) * 1e-5,
                };
              },
            ],
          },
        }
      );

      World.add(world, attractiveBody);

      // Create Stars (Small particles with glow)
      const stars = [];
      for (let i = 0; i < 200; i++) {
        const x = Common.random(0, dimensions.width);
        const y = Common.random(0, dimensions.height);
        const size = Common.random(2, 5);
        
        const star = Bodies.circle(x, y, size, {
          mass: 0.05,
          friction: 0,
          frictionAir: 0.005,
          render: {
            fillStyle: getRandomStarColor(),
            strokeStyle: 'transparent',
            lineWidth: 0,
          },
        });
        stars.push(star);
        World.add(world, star);
      }

      // Create Planets (Medium sized bodies)
      const planets = [];
      const planetTypes = ['circle', 'polygon', 'hexagon'];
      
      for (let i = 0; i < 45; i++) {
        let x = Common.random(0, dimensions.width);
        let y = Common.random(0, dimensions.height);
        let size = Common.random(8, 35);
        let planetType = planetTypes[Math.floor(Math.random() * planetTypes.length)];
        
        let body;
        if (planetType === 'circle') {
          body = Bodies.circle(x, y, size, {
            mass: size / 15,
            friction: 0,
            frictionAir: 0.008,
            render: {
              fillStyle: getRandomColor('planets'),
              strokeStyle: '#2E3440',
              lineWidth: 1.5,
            },
          });
        } else {
          const sides = planetType === 'hexagon' ? 6 : Common.random(4, 8);
          body = Bodies.polygon(x, y, sides, size, {
            mass: size / 15,
            friction: 0,
            frictionAir: 0.008,
            render: {
              fillStyle: getRandomColor('planets'),
              strokeStyle: '#2E3440',
              lineWidth: 1.5,
            },
          });
        }
        planets.push(body);
        World.add(world, body);
      }

      // Create Nakshatra / Constellation patterns (Glowing dots)
      const nakshatras = [];
      for (let i = 0; i < 80; i++) {
        const x = Common.random(0, dimensions.width);
        const y = Common.random(0, dimensions.height);
        const size = Common.random(3, 7);
        
        const nakshatra = Bodies.circle(x, y, size, {
          mass: 0.08,
          friction: 0,
          frictionAir: 0.003,
          render: {
            fillStyle: '#EBCB8B',
            strokeStyle: 'rgba(235, 203, 139, 0.6)',
            lineWidth: 1,
          },
        });
        nakshatras.push(nakshatra);
        World.add(world, nakshatra);
      }

      // Create Nebula clouds (Large transparent shapes)
      for (let i = 0; i < 8; i++) {
        const x = Common.random(0, dimensions.width);
        const y = Common.random(0, dimensions.height);
        const size = Common.random(40, 120);
        
        const nebula = Bodies.circle(x, y, size, {
          mass: 0.5,
          friction: 0,
          frictionAir: 0.002,
          render: {
            fillStyle: `rgba(129, 161, 193, ${Common.random(0.03, 0.08)})`,
            strokeStyle: 'transparent',
            lineWidth: 0,
          },
        });
        World.add(world, nebula);
      }

      // Mouse interaction
      const mouse = Mouse.create(render.canvas);
      mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
      render.mouse = mouse;

      // Update attractor position with mouse
      Events.on(engine, 'afterUpdate', function () {
        if (!mouse.position.x) return;
        Body.translate(attractiveBody, {
          x: (mouse.position.x - attractiveBody.position.x) * 0.08,
          y: (mouse.position.y - attractiveBody.position.y) * 0.08,
        });
        
        // Add subtle glow to center
        const centerX = attractiveBody.position.x;
        const centerY = attractiveBody.position.y;
      });

      // Draw custom elements (glow effects)
      Events.on(render, 'afterRender', function () {
        const canvasCtx = render.context;
        
        // Draw glow effect for stars
        stars.forEach(star => {
          canvasCtx.beginPath();
          canvasCtx.arc(star.position.x, star.position.y, star.circleRadius + 1, 0, Math.PI * 2);
          canvasCtx.fillStyle = `rgba(255, 215, 0, ${Math.random() * 0.3 + 0.1})`;
          canvasCtx.fill();
        });
        
        // Draw glow for nakshatras
        nakshatras.forEach(nak => {
          canvasCtx.beginPath();
          canvasCtx.arc(nak.position.x, nak.position.y, nak.circleRadius + 2, 0, Math.PI * 2);
          canvasCtx.fillStyle = `rgba(235, 203, 139, ${Math.random() * 0.2 + 0.05})`;
          canvasCtx.fill();
        });
      });

      // Window resize handler
      const handleResize = () => {
        dimensions.width = window.innerWidth;
        dimensions.height = window.innerHeight;
        
        if (render.canvas) {
          render.canvas.width = dimensions.width;
          render.canvas.height = dimensions.height;
          render.options.width = dimensions.width;
          render.options.height = dimensions.height;
        }
        
        // Update attractive body position
        Body.setPosition(attractiveBody, {
          x: dimensions.width / 2,
          y: dimensions.height / 2,
        });
      };

      window.addEventListener('resize', handleResize);

      // Start the engine
      Runner.run(runner, engine);
      Render.run(render);

      matterRef.current = { engine, runner, render, world, bodies: { stars, planets, nakshatras } };

      return () => {
        window.removeEventListener('resize', handleResize);
        if (matterRef.current) {
          Render.stop(render);
          Runner.stop(runner);
          World.clear(world);
          Engine.clear(engine);
        }
      };
    };

    initMatter();

    return () => {
      if (matterRef.current) {
        const { engine, runner, render } = matterRef.current;
        if (render) Render.stop(render);
        if (runner) Runner.stop(runner);
        if (engine) Engine.clear(engine);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export default AstroParticles;