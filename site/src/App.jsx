import { useRef, useState, useEffect, Suspense } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import Navbar from './components/Navbar';
import HeroScene from './components/HeroScene';
import Motion2D from './components/Motion2D';
import ComponentStage from './components/ComponentStage';

// Lazy-load the heavy 3D playground
import Scene3DPlayground from './components/Scene3DPlayground';

const SECTION_IDS = {
  Hero: 'hero',
  '2D Motion': 'motion2d',
  '3D Scene': 'scene3d',
  Components: 'components',
};

function SectionLabel({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        marginBottom: 12,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div
        style={{
          width: 20,
          height: 2,
          background: 'linear-gradient(90deg, #7c3aed, #2563eb)',
          borderRadius: 2,
        }}
      />
      <span
        style={{
          color: '#7c3aed',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}
      >
        {children}
      </span>
    </motion.div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      style={{ marginBottom: 48 }}
    >
      <h2
        style={{
          fontSize: 'clamp(28px, 4vw, 44px)',
          fontWeight: 800,
          color: '#f1f5f9',
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
          marginBottom: 12,
        }}
      >
        {children}
      </h2>
      {sub && (
        <p
          style={{
            color: '#64748b',
            fontSize: 16,
            maxWidth: 520,
            lineHeight: 1.6,
          }}
        >
          {sub}
        </p>
      )}
    </motion.div>
  );
}

function GlowDivider() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        margin: '0 auto',
        maxWidth: 800,
      }}
    >
      <div
        style={{
          flex: 1,
          height: 1,
          background: 'linear-gradient(90deg, transparent, #ffffff12)',
        }}
      />
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#7c3aed',
          boxShadow: '0 0 12px #7c3aed',
        }}
      />
      <div
        style={{
          flex: 1,
          height: 1,
          background: 'linear-gradient(90deg, #ffffff12, transparent)',
        }}
      />
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState('Hero');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const scrollTo = sectionName => {
    const id = SECTION_IDS[sectionName];
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const name = Object.keys(SECTION_IDS).find(
              k => SECTION_IDS[k] === entry.target.id
            );
            if (name) setActiveSection(name);
          }
        });
      },
      { threshold: 0.3 }
    );
    Object.values(SECTION_IDS).forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: '#080810', minHeight: '100vh' }}>
      <Navbar activeSection={activeSection} onNav={scrollTo} />

      {/* ── HERO ── */}
      <section
        id="hero"
        ref={heroRef}
        style={{
          position: 'relative',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Full-bleed 3D canvas */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>

        {/* Gradient vignette */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 50%, transparent 40%, #080810 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Hero copy */}
        <motion.div
          style={{
            position: 'relative',
            textAlign: 'center',
            padding: '0 24px',
            opacity: heroOpacity,
            y: heroY,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div style={{ marginBottom: 20 }}>
              <span
                style={{
                  display: 'inline-block',
                  padding: '6px 18px',
                  borderRadius: 20,
                  border: '1px solid #7c3aed50',
                  background: '#7c3aed12',
                  color: '#a78bfa',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                }}
              >
                FRAMER MOTION + REACT THREE FIBER
              </span>
            </motion.div>

            <h1
              style={{
                fontSize: 'clamp(40px, 7vw, 88px)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
                background:
                  'linear-gradient(135deg, #ffffff 30%, #a78bfa 60%, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 24,
              }}
            >
              Interactive
              <br />
              2D + 3D
            </h1>

            <p
              style={{
                color: '#64748b',
                fontSize: 'clamp(15px, 2vw, 19px)',
                maxWidth: 480,
                margin: '0 auto 40px',
                lineHeight: 1.6,
              }}
            >
              Drop in any React component. Animate with spring physics. Render
              real-time 3D — all in one site.
            </p>

            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: '0 8px 40px #7c3aed60' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo('2D Motion')}
                style={{
                  padding: '14px 32px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  border: 'none',
                  color: '#fff',
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '-0.01em',
                }}
              >
                Explore Demos
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo('3D Scene')}
                style={{
                  padding: '14px 32px',
                  borderRadius: 12,
                  border: '1.5px solid #ffffff20',
                  background: '#ffffff08',
                  color: '#e2e8f0',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                View 3D Scene
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#475569',
            fontSize: 12,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ letterSpacing: '0.08em', fontWeight: 500 }}>
            SCROLL
          </span>
          <div
            style={{
              width: 1,
              height: 28,
              background: 'linear-gradient(#7c3aed, transparent)',
            }}
          />
        </motion.div>
      </section>

      {/* ── 2D MOTION ── */}
      <section
        id="motion2d"
        style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 6vw, 80px)' }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <SectionLabel>Framer Motion</SectionLabel>
          <SectionTitle sub="Spring physics, drag gestures, staggered reveals, 3D perspective transforms — all driven by Framer Motion.">
            2D Interactions
          </SectionTitle>
          <Motion2D />
        </div>
      </section>

      <GlowDivider />

      {/* ── 3D SCENE ── */}
      <section
        id="scene3d"
        style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 6vw, 80px)' }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <SectionLabel>React Three Fiber</SectionLabel>
          <SectionTitle sub="A real-time 3D scene rendered with React Three Fiber. Drag to orbit, scroll to zoom.">
            3D Playground
          </SectionTitle>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 480,
              borderRadius: 24,
              border: '1.5px solid #ffffff12',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #0d0d20, #080814)',
              position: 'relative',
            }}
          >
            <Suspense
              fallback={
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#475569',
                    fontSize: 14,
                  }}
                >
                  Loading 3D scene…
                </div>
              }
            >
              <Scene3DPlayground />
            </Suspense>

            {/* Corner hint */}
            <div
              style={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                padding: '6px 12px',
                borderRadius: 8,
                background: '#000000aa',
                backdropFilter: 'blur(8px)',
                color: '#64748b',
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              Drag to orbit · Scroll to zoom
            </div>
          </motion.div>

          {/* Feature chips */}
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              marginTop: 24,
            }}
          >
            {[
              'PBR Materials',
              'Contact Shadows',
              'HDR Environment',
              'Spring Physics',
              'Float Animation',
              'OrbitControls',
            ].map(f => (
              <div
                key={f}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid #ffffff12',
                  background: '#ffffff06',
                  color: '#64748b',
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      <GlowDivider />

      {/* ── COMPONENT STAGE ── */}
      <section
        id="components"
        style={{ padding: 'clamp(80px, 10vw, 130px) clamp(20px, 6vw, 80px)' }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <SectionLabel>Component Stage</SectionLabel>
          <SectionTitle sub="Live React components rendered in a sandboxed stage. Click between them to see instant swaps with animated transitions.">
            Drop Any Component
          </SectionTitle>
          <ComponentStage />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: '1px solid #ffffff0a',
          padding: '48px clamp(20px, 6vw, 80px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 900,
              color: '#fff',
            }}
          >
            R
          </div>
          <span style={{ color: '#475569', fontSize: 13, fontWeight: 500 }}>
            React 2D+3D Interactive
          </span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Framer Motion', 'React Three Fiber', 'Three.js'].map(t => (
            <span
              key={t}
              style={{ color: '#334155', fontSize: 12, fontWeight: 500 }}
            >
              {t}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
