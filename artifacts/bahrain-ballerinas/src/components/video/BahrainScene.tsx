import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const LETTERS = ['B', 'A', 'H', 'R', 'A', 'I', 'N'];
const BAHRAIN_RED = '#CE1126';
const BAHRAIN_WHITE = '#FFFFFF';

export function BahrainScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef<HTMLDivElement[]>([]);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // GSAP Context to easily clean up all animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Initial Setup
      gsap.set(blocksRef.current, { 
        y: 150, 
        opacity: 0, 
        rotationX: -90,
        rotationZ: -10,
        scale: 0.3
      });
      
      gsap.set(particlesRef.current, {
        x: () => gsap.utils.random(0, window.innerWidth),
        y: () => gsap.utils.random(0, window.innerHeight),
        scale: () => gsap.utils.random(0.1, 1.2),
        opacity: () => gsap.utils.random(0.2, 0.9)
      });

      // Particle floating "secret sauce"
      gsap.to(particlesRef.current, {
        y: '-=150',
        x: 'random(-100, 100)',
        rotation: 'random(-360, 360)',
        duration: 'random(4, 7)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.05,
          from: 'random'
        }
      });

      // The Ballerina Dance Choreography
      // 1. Enter the stage
      tl.to(blocksRef.current, {
        y: 0,
        opacity: 1,
        rotationX: 0,
        rotationZ: 0,
        scale: 1,
        duration: 1.8,
        ease: 'power4.inOut',
        stagger: 0.1
      })
      // 2. Synchronized Pirouettes and Leaps
      .to(blocksRef.current, {
        y: -80,
        rotationY: 360,
        scale: 1.1,
        duration: 1.2,
        ease: 'power4.inOut',
        stagger: {
          each: 0.1,
          yoyo: true,
          repeat: 1
        }
      }, "-=0.2")
      // 3. The Grand Pause (Synchronized poses)
      .to(blocksRef.current, {
        scale: 1.2,
        rotationZ: () => gsap.utils.random(-15, 15),
        duration: 1,
        ease: 'power4.inOut',
        stagger: 0.05
      }, "+=0.1")
      .to(blocksRef.current, {
        scale: 1,
        rotationZ: 0,
        duration: 1,
        ease: 'power4.inOut'
      })
      // 4. Graceful Exit
      .to(blocksRef.current, {
        y: 150,
        opacity: 0,
        rotationX: 90,
        scale: 0.3,
        duration: 1.5,
        ease: 'power4.inOut',
        stagger: 0.1
      }, "+=0.5");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div 
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0A0A0A' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Dynamic ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(206,17,38,0.15)_0%,_transparent_70%)]" />

      {/* Secret Sauce Particles */}
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          ref={el => { if (el) particlesRef.current[i] = el; }}
          className="absolute w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]"
          style={{
            backgroundColor: i % 3 === 0 ? BAHRAIN_WHITE : BAHRAIN_RED,
            color: i % 3 === 0 ? BAHRAIN_WHITE : BAHRAIN_RED,
            filter: 'blur(1px)'
          }}
        />
      ))}

      {/* The 7 Blocks (Ballerinas) */}
      <div className="relative z-10 flex gap-4 md:gap-8" style={{ perspective: 1200 }}>
        {LETTERS.map((letter, i) => (
          <div
            key={`${letter}-${i}`}
            ref={el => { if (el) blocksRef.current[i] = el; }}
            className="flex items-center justify-center w-16 h-24 md:w-28 md:h-40 rounded-2xl text-5xl md:text-7xl font-black tracking-tighter"
            style={{
              background: `linear-gradient(135deg, ${BAHRAIN_RED} 0%, #800000 100%)`,
              color: BAHRAIN_WHITE,
              boxShadow: `0 20px 40px rgba(206, 17, 38, 0.4), inset 0 2px 0 rgba(255, 255, 255, 0.3)`,
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {letter}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
