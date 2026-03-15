import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const LETTERS = ['B', 'A', 'H', 'R', 'A', 'I', 'N'];
const BAHRAIN_RED = '#CE1126';
const BAHRAIN_WHITE = '#FFFFFF';
const N = LETTERS.length;

// ─── Bahrain Flag Particle Grid ────────────────────────────────────────────
// Flag anatomy: white stripe (left) + 5 serrated teeth pointing into red (right)
// Standard Bahrain flag ratio: white occupies ~25%, zigzag teeth tip to ~35%
const F_COLS = 34;  // horizontal particles
const F_ROWS = 25;  // vertical particles — 5 rows per tooth = clear zigzag
const WAVE_PERIOD = 3.5; // seconds for one full wave cycle (seamless loop)

function isFlagWhite(col: number, row: number): boolean {
  const colFrac = col / (F_COLS - 1);
  const rowFrac = row / (F_ROWS - 1);

  const WHITE_SOLID = 0.21;  // solid white zone left of zigzag
  const WHITE_TIP   = 0.33;  // rightmost extent of each triangular tooth
  const TEETH = 5;

  if (colFrac <= WHITE_SOLID) return true;
  if (colFrac >= WHITE_TIP)   return false;

  // Triangular zigzag wave — 5 teeth pointing right into the red field
  // rowFrac 0→1 spans TEETH teeth; each tooth is a symmetric triangle
  const sawVal = (rowFrac * TEETH * 2) % 2;          // sawtooth 0-2
  const triangle = sawVal <= 1 ? sawVal : 2 - sawVal; // triangle wave 0-1

  const boundary = WHITE_SOLID + (WHITE_TIP - WHITE_SOLID) * triangle;
  return colFrac <= boundary;
}

export function BahrainScene() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const blocksRef      = useRef<HTMLDivElement[]>([]);
  const flagParticles  = useRef<HTMLDivElement[]>([]);
  const glowRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const blocks = blocksRef.current;
      const E = 'power4.inOut';

      // ─── Letter block initial state ────────────────────────────
      gsap.set(blocks, {
        y: 220, opacity: 0, rotationX: -90,
        rotationZ: 0, rotationY: 0, scale: 0.3,
        scaleX: 1, scaleY: 1,
      });

      // ─── Seamless flag wave ────────────────────────────────────
      // waveObj.t goes 0→1 linearly (ease:'none'), then repeats.
      // sin(2π·t - phaseOffset) is periodic with period 1 in t,
      // so the wave loops with ZERO discontinuity at the repeat boundary.
      // Amplitude grows left→right (pole-fixed flag, free end blows widest).
      const waveObj = { t: 0 };

      gsap.to(waveObj, {
        t: 1,
        duration: WAVE_PERIOD,
        ease: 'none',     // linear → seamless repeat
        repeat: -1,
        onUpdate() {
          const phase = waveObj.t * Math.PI * 2;
          flagParticles.current.forEach((el, idx) => {
            if (!el) return;
            const col = idx % F_COLS;
            const colFrac = col / (F_COLS - 1);
            // Phase offset: wave travels rightward (from pole to free end)
            const phaseOff = colFrac * Math.PI * 5; // ~2.5 visible wave cycles
            // Amplitude: small near pole, large at free end
            const amp = 3 + colFrac * 18;
            el.style.transform = `translateY(${amp * Math.sin(phase - phaseOff)}px)`;
          });
        },
      });

      // ─── Ambient glow pulse ────────────────────────────────────
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          opacity: 0.28, scale: 1.5,
          duration: 2.5, repeat: -1, yoyo: true,
          ease: 'sine.inOut',
        });
      }

      // ══════════════════════════════════════════════════════════
      // ████  Main choreography timeline — 17 stops + 9 pauses  ████
      // ══════════════════════════════════════════════════════════
      const tl = gsap.timeline({ repeat: -1 });

      // STOP 1 — Deck Work Entrance
      tl.to(blocks, {
        y: 0, opacity: 1, rotationX: 0, scale: 1,
        duration: 1.7, ease: E,
        stagger: { each: 0.13, from: 'start' },
      })

      // STOP 2 — Eggbeater Bob
      .to(blocks, {
        y: (i) => i % 2 === 0 ? -22 : 22,
        duration: 0.45, ease: E,
        stagger: { each: 0.06, from: 'start' },
      }, '+=0.05')
      .to(blocks, {
        y: (i) => i % 2 === 0 ? 22 : -22,
        duration: 0.45, ease: E,
        stagger: { each: 0.06, from: 'end' },
      })
      .to(blocks, { y: 0, duration: 0.35, ease: E })

      // ★ GRAND PAUSE 1 — Symmetrical Fan
      .to(blocks, {
        rotationZ: (i) => (i - 3) * 9,
        y: (i) => Math.abs(i - 3) * 12,
        scale: (i) => 1 + (3 - Math.abs(i - 3)) * 0.04,
        duration: 0.95, ease: E,
        stagger: { each: 0.07, from: 'center' },
      }, '+=0.15')
      .to({}, { duration: 0.95 })

      // STOP 3 — Barracuda Sweep
      .to(blocks, { rotationZ: 0, y: 0, scale: 1, duration: 0.5, ease: E })
      .to(blocks, {
        y: -85, scaleY: 1.2, scaleX: 0.85,
        duration: 0.6, ease: E,
        stagger: { each: 0.09, from: 'start' },
      })
      .to(blocks, {
        y: 0, scaleY: 1, scaleX: 1,
        duration: 0.6, ease: E,
        stagger: { each: 0.09, from: 'end' },
      })

      // STOP 4 — Pirouette Wave
      .to(blocks, {
        rotationY: '+=360', y: -65, scale: 1.12,
        duration: 1.05, ease: E,
        stagger: { each: 0.11, from: 'start' },
      }, '+=0.1')
      .to(blocks, {
        rotationY: '+=360', y: 0, scale: 1,
        duration: 1.0, ease: E,
        stagger: { each: 0.1, from: 'end' },
      })

      // ★ GRAND PAUSE 2 — Diamond Tableau
      .to(blocks, {
        y: (i) => [0, -45, -75, -100, -75, -45, 0][i],
        rotationZ: (i) => [-22, -12, -5, 0, 5, 12, 22][i],
        scale: (i) => [0.88, 1.0, 1.06, 1.18, 1.06, 1.0, 0.88][i],
        duration: 1.05, ease: E,
        stagger: { each: 0.08, from: 'center' },
      }, '+=0.18')
      .to({}, { duration: 1.05 })

      // STOP 5 — Ballet Leg Figure
      .to(blocks, { rotationZ: 0, y: 0, scale: 1, duration: 0.4, ease: E })
      .to(blocks, {
        scaleY: 1.9, scaleX: 0.55, y: -25,
        duration: 0.8, ease: E,
        stagger: { each: 0.07, from: 'center' },
      }, '+=0.12')
      .to(blocks, {
        scaleY: 1, scaleX: 1, y: 0,
        duration: 0.7, ease: E,
        stagger: { each: 0.06, from: 'edges' },
      })

      // STOP 6 — Diagonal Sway
      .to(blocks, {
        rotationZ: (i) => i % 2 === 0 ? -32 : 32,
        y: (i) => i % 2 === 0 ? -28 : 28,
        duration: 0.65, ease: E,
        stagger: { each: 0.06, from: 'start' },
      }, '+=0.12')
      .to(blocks, {
        rotationZ: (i) => i % 2 === 0 ? 32 : -32,
        y: (i) => i % 2 === 0 ? 28 : -28,
        duration: 0.65, ease: E,
        stagger: { each: 0.06, from: 'end' },
      })
      .to(blocks, { rotationZ: 0, y: 0, duration: 0.5, ease: E })

      // ★ GRAND PAUSE 3 — Starburst 3D
      .to(blocks, {
        rotationZ: (i) => [-38, 22, -18, 0, 18, -22, 38][i],
        rotationX: (i) => [12, -18, 22, 0, -22, 18, -12][i],
        y: (i) => [-18, -55, -35, -90, -35, -55, -18][i],
        scale: (i) => [1.0, 1.1, 1.0, 1.25, 1.0, 1.1, 1.0][i],
        duration: 1.1, ease: E,
        stagger: { each: 0.09, from: 'random' },
      }, '+=0.18')
      .to({}, { duration: 1.1 })

      // STOP 7 — Vertical Figure (inverted)
      .to(blocks, { rotationZ: 0, rotationX: 0, y: 0, scale: 1, duration: 0.5, ease: E })
      .to(blocks, {
        rotationX: 160, y: 20, scaleY: 1.25, scaleX: 0.75,
        duration: 0.9, ease: E,
        stagger: { each: 0.08, from: 'center' },
      })
      .to(blocks, {
        rotationX: 0, y: 0, scaleY: 1, scaleX: 1,
        duration: 0.85, ease: E,
        stagger: { each: 0.07, from: 'edges' },
      })

      // STOP 8 — Back Tuck Somersault
      .to(blocks, {
        rotationY: '-=360', scale: 0.75, y: -40,
        duration: 0.9, ease: E,
        stagger: { each: 0.1, from: 'end' },
      }, '+=0.1')
      .to(blocks, {
        rotationY: '-=360', scale: 1, y: 0,
        duration: 0.9, ease: E,
        stagger: { each: 0.09, from: 'start' },
      })

      // STOP 9 — Zigzag Jump
      .to(blocks, {
        y: (i) => i % 2 === 0 ? -95 : 22,
        scale: (i) => i % 2 === 0 ? 1.12 : 0.88,
        duration: 0.68, ease: E,
        stagger: { each: 0.07, from: 'start' },
      }, '+=0.1')
      .to(blocks, {
        y: (i) => i % 2 === 0 ? 22 : -95,
        scale: (i) => i % 2 === 0 ? 0.88 : 1.12,
        duration: 0.68, ease: E,
        stagger: { each: 0.07, from: 'end' },
      })
      .to(blocks, { y: 0, scale: 1, duration: 0.5, ease: E })

      // ★ GRAND PAUSE 4 — Outward Lean
      .to(blocks, {
        x: (i) => (i - 3) * 18,
        rotationZ: (i) => (i - 3) * -11,
        y: (i) => Math.abs(i - 3) * 18,
        scale: 1.06,
        duration: 1.0, ease: E,
        stagger: { each: 0.08, from: 'center' },
      }, '+=0.18')
      .to({}, { duration: 0.95 })

      // ╔══════════════════════════════════════════════════════════╗
      // ║           ★★★ HUMAN TOWER (Stack Lift) ★★★              ║
      // ╚══════════════════════════════════════════════════════════╝
      .to(blocks, { x: 0, rotationZ: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, duration: 0.45, ease: E })
      // Bases crouch, pushers brace
      .to(blocks, {
        y: (i) => i === 3 ? -8 : i === 2 || i === 4 ? 18 : i === 1 || i === 5 ? 28 : 35,
        scaleY: (i) => i === 3 ? 1.1 : i === 2 || i === 4 ? 0.9 : 0.8,
        scaleX: (i) => i === 3 ? 0.95 : i === 2 || i === 4 ? 1.05 : 1.12,
        rotationZ: (i) => i === 0 ? 8 : i === 6 ? -8 : i === 1 ? 5 : i === 5 ? -5 : 0,
        duration: 0.75, ease: E,
        stagger: { each: 0.06, from: 'edges' },
      }, '+=0.2')
      // Flyer rockets to peak altitude
      .to(blocks[3], { y: -195, scaleY: 1.55, scaleX: 0.7, duration: 0.65, ease: E }, '+=0.05')
      .to({}, { duration: 1.2 })
      // Flyer spins at peak
      .to(blocks[3], { rotationY: '+=360', scale: 1.3, duration: 0.8, ease: E })
      .to({}, { duration: 0.4 })
      // Controlled descent
      .to(blocks[3], { y: 0, scaleY: 1, scaleX: 1, rotationY: 0, scale: 1, duration: 0.9, ease: E })
      .to(blocks, { y: 0, scaleY: 1, scaleX: 1, rotationZ: 0, scale: 1, duration: 0.7, ease: E, stagger: { each: 0.06, from: 'edges' } }, '-=0.4')

      // ★ GRAND PAUSE 5 — Triumphant Fan (post-tower)
      .to(blocks, {
        y: (i) => i === 3 ? -55 : Math.abs(i - 3) * 8,
        scale: (i) => i === 3 ? 1.3 : 1.02,
        rotationZ: (i) => (i - 3) * 7,
        duration: 1.0, ease: E,
        stagger: { each: 0.07, from: 'center' },
      }, '+=0.2')
      .to({}, { duration: 1.1 })

      // STOP 10 — Platform Formation
      .to(blocks, { y: 0, rotationZ: 0, scale: 1, duration: 0.45, ease: E })
      .to(blocks, {
        y: (i) => Math.abs(Math.sin((i / (N - 1)) * Math.PI)) * -50 - 20,
        scaleY: 0.82, scaleX: 1.12,
        duration: 0.8, ease: E,
        stagger: { each: 0.06, from: 'center' },
      }, '+=0.15')
      .to(blocks, { y: 0, scaleY: 1, scaleX: 1, duration: 0.65, ease: E, stagger: { each: 0.07, from: 'edges' } })

      // STOP 11 — Accordion Squeeze
      .to(blocks, {
        scaleX: 0.58, scaleY: 1.45,
        duration: 0.55, ease: E,
        stagger: { each: 0.07, from: 'center' },
      }, '+=0.15')
      .to(blocks, {
        scaleX: 1.32, scaleY: 0.68,
        duration: 0.55, ease: E,
        stagger: { each: 0.07, from: 'edges' },
      })
      .to(blocks, { scaleX: 1, scaleY: 1, duration: 0.5, ease: E })

      // STOP 12 — Kaleidoscope
      .to(blocks, {
        rotationX: (i) => i % 2 === 0 ? 360 : -360,
        rotationY: (i) => i % 3 === 0 ? 360 : i % 3 === 1 ? -360 : 180,
        duration: 1.25, ease: E,
        stagger: { each: 0.09, from: 'random' },
      }, '+=0.12')
      .to(blocks, { rotationX: 0, rotationY: 0, duration: 0.6, ease: E })

      // STOP 13 — Scale Burst (Airborne Lift)
      .to(blocks, { scale: 1.55, duration: 0.28, ease: E, stagger: { each: 0.045, from: 'center' } }, '+=0.1')
      .to(blocks, { scale: 0.65, duration: 0.28, ease: E, stagger: { each: 0.045, from: 'edges' } })
      .to(blocks, { scale: 1, duration: 0.5, ease: E })

      // STOP 14 — Rolling Sine Wave
      .to(blocks, {
        y: -65, duration: 0.65, ease: E,
        stagger: { each: 0.1, from: 'start', repeat: 1, yoyo: true },
      }, '+=0.1')

      // ★ GRAND PAUSE 6 — Inward Bow
      .to(blocks, {
        rotationZ: (i) => i < 3 ? 20 + (3 - i) * 5 : i > 3 ? -(20 + (i - 3) * 5) : 0,
        y: (i) => i === 3 ? -50 : Math.abs(i - 3) * 5,
        scale: (i) => i === 3 ? 1.35 : 1.0,
        duration: 1.05, ease: E,
        stagger: { each: 0.07, from: 'edges' },
      }, '+=0.18')
      .to({}, { duration: 1.0 })

      // ★ GRAND PAUSE 7 — Tall & Proud
      .to(blocks, { rotationZ: 0, y: 0, scale: 1, duration: 0.4, ease: E })
      .to(blocks, {
        scaleY: 1.35, scaleX: 0.82, y: -12,
        duration: 0.82, ease: E,
        stagger: { each: 0.07, from: 'center' },
      }, '+=0.15')
      .to({}, { duration: 1.05 })

      // STOP 15 — Ripple Scatter
      .to(blocks, { scaleY: 1, scaleX: 1, y: 0, duration: 0.4, ease: E })
      .to(blocks, {
        y: (i) => [-50, 30, -70, 10, -70, 30, -50][i],
        x: (i) => [-15, 10, -8, 0, 8, -10, 15][i],
        scale: (i) => [1.05, 0.92, 1.08, 1.0, 1.08, 0.92, 1.05][i],
        duration: 0.7, ease: E,
        stagger: { each: 0.07, from: 'random' },
      })
      .to(blocks, { y: 0, x: 0, scale: 1, duration: 0.65, ease: E, stagger: { each: 0.07, from: 'center' } })

      // ★ GRAND PAUSE 8 — Final Tableau
      .to(blocks, {
        y: (i) => [-65, 18, -88, -42, -88, 18, -65][i],
        x: (i) => [-22, -12, -5, 0, 5, 12, 22][i],
        rotationZ: (i) => [-16, 11, -21, 0, 21, -11, 16][i],
        scale: (i) => [1.0, 1.1, 1.16, 1.22, 1.16, 1.1, 1.0][i],
        duration: 1.15, ease: E,
        stagger: { each: 0.09, from: 'random' },
      }, '+=0.18')
      .to({}, { duration: 1.15 })

      // STOP 16 — Final Bow
      .to(blocks, { x: 0, y: 0, rotationZ: 0, scale: 1, duration: 0.45, ease: E })
      .to(blocks, { rotationX: 50, y: 32, scale: 0.82, duration: 0.82, ease: E, stagger: { each: 0.09, from: 'center' } })
      .to(blocks, { rotationX: 0, y: 0, scale: 1, duration: 0.82, ease: E, stagger: { each: 0.07, from: 'edges' } })

      // STOP 17 — Double Pirouette Finale
      .to(blocks, {
        rotationY: '+=720', y: -80, scale: 1.18,
        duration: 1.2, ease: E,
        stagger: { each: 0.08, from: 'center' },
      }, '+=0.1')
      .to(blocks, { y: 0, scale: 1, duration: 0.6, ease: E })

      // ★ GRAND PAUSE 9 — Final Stand
      .to(blocks, {
        y: 0, scale: 1.06, rotationZ: 0,
        duration: 0.7, ease: E,
        stagger: { each: 0.06, from: 'start' },
      }, '+=0.15')
      .to({}, { duration: 1.0 })
      .to(blocks, { scale: 1, duration: 0.5, ease: E })

      // GRAND EXIT
      .to(blocks, {
        y: (i) => i % 2 === 0 ? -window.innerHeight * 1.2 : window.innerHeight * 1.2,
        x: (i) => (i - 3) * 120,
        opacity: 0, scale: 0.2,
        rotationZ: (i) => (i - 3) * 35,
        rotationY: (i) => i % 2 === 0 ? 360 : -360,
        duration: 1.45, ease: E,
        stagger: { each: 0.09, from: 'random' },
      }, '+=0.35')

      // Reset
      .set(blocks, { y: 220, x: 0, opacity: 0, rotationX: -90, rotationY: 0, rotationZ: 0, scale: 0.3, scaleX: 1, scaleY: 1 })
      .to({}, { duration: 0.4 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Pre-compute flag particle data once (avoids recalculating on re-renders)
  const flagGrid = Array.from({ length: F_COLS * F_ROWS }, (_, idx) => {
    const col = idx % F_COLS;
    const row = Math.floor(idx / F_COLS);
    const white = isFlagWhite(col, row);
    return {
      idx, col, row, white,
      left: `${(col / (F_COLS - 1)) * 100}%`,
      top:  `${(row / (F_ROWS - 1)) * 100}%`,
      size: white ? 7 : 5,
    };
  });

  return (
    <motion.div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#060606' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* ─── Bahrain Flag Particle Grid (background layer) ─── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {flagGrid.map(({ idx, white, left, top, size }) => (
          <div
            key={`f${idx}`}
            ref={el => { if (el) flagParticles.current[idx] = el; }}
            className="absolute rounded-full"
            style={{
              left,
              top,
              width: size,
              height: size,
              marginLeft: -(size / 2),
              marginTop:  -(size / 2),
              backgroundColor: white ? BAHRAIN_WHITE : BAHRAIN_RED,
              boxShadow: white
                ? `0 0 ${size * 3}px rgba(255,255,255,0.75), 0 0 ${size * 6}px rgba(255,255,255,0.25)`
                : `0 0 ${size * 2.5}px rgba(206,17,38,0.65), 0 0 ${size * 5}px rgba(206,17,38,0.2)`,
              opacity: white ? 0.55 : 0.42,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* ─── Ambient glow layer ─── */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          zIndex: 1,
          background:
            'radial-gradient(ellipse 70% 50% at 50% 55%, rgba(206,17,38,0.3) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'radial-gradient(ellipse 35% 28% at 18% 78%, rgba(206,17,38,0.07) 0%, transparent 55%)',
        }}
      />

      {/* ─── The 7 Ballerina Blocks ─── */}
      <div
        className="relative flex"
        style={{ gap: 'clamp(10px, 1.5vw, 28px)', perspective: 1400, zIndex: 10 }}
      >
        {LETTERS.map((letter, i) => (
          <div
            key={`${letter}-${i}`}
            ref={el => { if (el) blocksRef.current[i] = el; }}
            className="flex items-center justify-center font-black select-none"
            style={{
              width:  'clamp(50px, 7vw, 108px)',
              height: 'clamp(74px, 10.5vw, 158px)',
              fontSize: 'clamp(28px, 4vw, 70px)',
              borderRadius: 'clamp(10px, 1.4vw, 18px)',
              background: `linear-gradient(148deg, #F0182F 0%, ${BAHRAIN_RED} 38%, #9A0018 100%)`,
              color: BAHRAIN_WHITE,
              boxShadow: `
                0 28px 55px rgba(206,17,38,0.5),
                0 6px 18px rgba(206,17,38,0.35),
                inset 0 2px 0 rgba(255,255,255,0.38),
                inset 0 -3px 0 rgba(0,0,0,0.25)
              `,
              border: '1.5px solid rgba(255,255,255,0.14)',
              transformStyle: 'preserve-3d',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            }}
          >
            {letter}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
