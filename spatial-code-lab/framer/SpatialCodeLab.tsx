/**
 * Spatial Code Lab — Full Page Component
 *
 * Framer Code Component that assembles the entire site.
 * Add to a Framer page as a full-width, auto-height component.
 *
 * Individual sections are also available as separate components:
 *   - HeroSection.tsx
 *   - SplineGallery.tsx
 *   - ReactPlayground.tsx
 *   - GlassCard.tsx
 *   - EmbedFrame.tsx
 *   - DockNav.tsx
 */
import { addPropertyControls, ControlType } from 'framer';
import { useState, useEffect } from 'react';

// ── Inline micro-components to keep this self-contained ──

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
@keyframes scl-heroGrad { 0%{opacity:1;transform:scale(1)} 100%{opacity:.75;transform:scale(1.04)} }
@keyframes scl-orbFloat { 0%,100%{transform:translate(0,0)} 50%{transform:translate(12px,-24px)} }
@keyframes scl-gradFlow { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes scl-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
@keyframes scl-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes scl-fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
@keyframes scl-cubeRot { from{transform:rotateY(0deg) rotateX(12deg)} to{transform:rotateY(360deg) rotateX(12deg)} }
@keyframes scl-morph { 0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%} 50%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%} }
@keyframes scl-modalIn { from{opacity:0;transform:scale(.92) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
@keyframes scl-backdropIn { from{opacity:0} to{opacity:1} }
`;

function injectCSS(id: string, css: string) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = css;
  document.head.appendChild(el);
}

const T = {
  bg: '#070710',
  text: '#f8fafc',
  textMuted: 'rgba(248,250,252,0.5)',
  blue: '#3b82f6',
  blue4: '#60a5fa',
  ind: '#6366f1',
  cyan: '#22d3ee',
  purp: '#c084fc',
  glass: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
};

const glassStyle = (cr = 20): React.CSSProperties => ({
  background: T.glass,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${T.border}`,
  borderRadius: cr,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.2)',
});

const sectionStyle: React.CSSProperties = {
  width: '100%',
  padding: '96px 80px',
  boxSizing: 'border-box',
  fontFamily: "'Inter', -apple-system, sans-serif",
};

function SectionHeader({
  label,
  title,
  desc,
}: {
  label: string;
  title: string;
  desc: string;
}) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 64 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: T.blue4,
          margin: '0 0 12px',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </p>
      <h2
        style={{
          fontSize: 'clamp(2rem,5vw,3rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          color: T.text,
          margin: '0 0 16px',
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 16,
          color: T.textMuted,
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        {desc}
      </p>
    </div>
  );
}

// Spline gallery scene cards (CSS-animated)
function OrbScene() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.15), transparent 70%)',
      }}
    >
      <div style={{ position: 'relative', width: 100, height: 100 }}>
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background:
              'conic-gradient(from 0deg, #3b82f6, #6366f1, #22d3ee, #3b82f6)',
            animation: 'scl-spin 6s linear infinite',
            boxShadow: '0 0 40px rgba(59,130,246,0.5)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 8,
            borderRadius: '50%',
            background: T.bg,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.2), transparent 55%)',
          }}
        />
      </div>
    </div>
  );
}

function LiquidScene() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.15), transparent 70%)',
      }}
    >
      <div
        style={{
          width: 90,
          height: 90,
          background:
            'linear-gradient(135deg, rgba(99,102,241,0.85), rgba(6,182,212,0.85))',
          animation: 'scl-morph 6s ease-in-out infinite',
          boxShadow: '0 0 40px rgba(99,102,241,0.4)',
        }}
      />
    </div>
  );
}

function GridScene() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(ellipse at 50% 60%, rgba(6,182,212,0.1), transparent 70%)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 200,
          height: 140,
          position: 'relative',
          transform: 'perspective(280px) rotateX(28deg)',
        }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              height: 1,
              top: `${(i / 7) * 100}%`,
              background:
                'linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)',
            }}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 1,
              left: `${(i / 7) * 100}%`,
              background:
                'linear-gradient(180deg, transparent, rgba(6,182,212,0.5), transparent)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ParticleScene() {
  const pts = Array.from({ length: 14 }, (_, i) => ({
    x: `${((i * 41) % 90) + 5}%`,
    bottom: `${(i * 19) % 60}%`,
    size: 3 + (i % 3),
    dur: `${3 + (i % 3)}s`,
    delay: `${(i * 0.5) % 3}s`,
    hue: 210 + ((i * 18) % 80),
  }));
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background:
          'radial-gradient(ellipse at 50% 80%, rgba(192,132,252,0.1), transparent 70%)',
      }}
    >
      {pts.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            width: p.size,
            height: p.size,
            left: p.x,
            bottom: p.bottom,
            background: `hsl(${p.hue},80%,65%)`,
            boxShadow: `0 0 ${p.size * 3}px hsl(${p.hue},80%,65%)`,
            animation: `scl-orbFloat ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function GeoScene() {
  const s = 60;
  const faces = [
    { bg: 'rgba(59,130,246,.7)', t: `translateZ(${s / 2}px)` },
    { bg: 'rgba(59,130,246,.35)', t: `rotateY(180deg) translateZ(${s / 2}px)` },
    { bg: 'rgba(59,130,246,.5)', t: `rotateY(90deg) translateZ(${s / 2}px)` },
    { bg: 'rgba(59,130,246,.28)', t: `rotateY(-90deg) translateZ(${s / 2}px)` },
    { bg: 'rgba(99,102,241,.6)', t: `rotateX(90deg) translateZ(${s / 2}px)` },
    { bg: 'rgba(99,102,241,.32)', t: `rotateX(-90deg) translateZ(${s / 2}px)` },
  ];
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(ellipse at 50% 50%, rgba(59,130,246,0.1), transparent 70%)',
        perspective: '400px',
      }}
    >
      <div
        style={{
          width: s,
          height: s,
          position: 'relative',
          transformStyle: 'preserve-3d',
          animation: 'scl-cubeRot 8s linear infinite',
        }}
      >
        {faces.map((f, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: s,
              height: s,
              background: f.bg,
              transform: f.t,
              border: '1px solid rgba(99,130,246,0.35)',
              backdropFilter: 'blur(4px)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function NeuralScene() {
  const nodes = [
    { cx: 40, cy: 60 },
    { cx: 120, cy: 30 },
    { cx: 190, cy: 80 },
    { cx: 160, cy: 140 },
    { cx: 80, cy: 120 },
    { cx: 230, cy: 50 },
    { cx: 260, cy: 120 },
    { cx: 50, cy: 170 },
  ];
  const edges = [
    [0, 1],
    [0, 4],
    [1, 2],
    [1, 5],
    [2, 6],
    [2, 3],
    [3, 4],
    [4, 7],
    [5, 6],
    [3, 6],
  ];
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(ellipse at 50% 50%, rgba(6,182,212,0.08), transparent 70%)',
      }}
    >
      <svg
        viewBox="0 0 300 200"
        width="240"
        height="160"
        style={{ overflow: 'visible' }}
      >
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke="rgba(6,182,212,0.3)"
            strokeWidth={1}
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.cx}
            cy={n.cy}
            r={5}
            fill="rgba(6,182,212,0.8)"
          />
        ))}
      </svg>
    </div>
  );
}

const GALLERY_SCENES = [
  {
    label: 'Cosmic Orb',
    desc: '3D gradient sphere',
    chip: 'Spline',
    chipC: T.blue4,
    SC: OrbScene,
  },
  {
    label: 'Neural Network',
    desc: 'Connected graph mesh',
    chip: 'WebGL',
    chipC: T.cyan,
    SC: NeuralScene,
  },
  {
    label: 'Liquid Metal',
    desc: 'Morphing CSS blob',
    chip: 'CSS',
    chipC: '#818cf8',
    SC: LiquidScene,
  },
  {
    label: 'Digital Grid',
    desc: '3D perspective mesh',
    chip: 'WebGL',
    chipC: T.cyan,
    SC: GridScene,
  },
  {
    label: 'Particle Storm',
    desc: 'Animated particles',
    chip: 'Canvas',
    chipC: T.purp,
    SC: ParticleScene,
  },
  {
    label: 'Geo Flow',
    desc: 'Rotating 3D cube',
    chip: 'Three.js',
    chipC: T.blue4,
    SC: GeoScene,
  },
];

// Toggle component
function Toggle({ label, initialOn }: { label: string; initialOn: boolean }) {
  const [on, setOn] = useState(initialOn);
  return (
    <div
      onClick={() => setOn(v => !v)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: 8,
        cursor: 'pointer',
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 500, color: T.textMuted }}>
        {label}
      </span>
      <div
        style={{
          width: 44,
          height: 24,
          borderRadius: 9999,
          position: 'relative',
          background: on
            ? `linear-gradient(135deg, ${T.blue}, ${T.ind})`
            : 'rgba(255,255,255,0.1)',
          boxShadow: on ? '0 0 16px rgba(59,130,246,0.4)' : 'none',
          transition: 'all .25s cubic-bezier(.34,1.56,.64,1)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: on ? 22 : 2,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'white',
            transition: 'left .25s cubic-bezier(.34,1.56,.64,1)',
            boxShadow: '0 2px 6px rgba(0,0,0,.25)',
          }}
        />
      </div>
    </div>
  );
}

interface Props {
  style?: React.CSSProperties;
  showHero?: boolean;
  showGallery?: boolean;
  showCodepen?: boolean;
  showDesign?: boolean;
  showPlayground?: boolean;
  showNav?: boolean;
  heroHeadline?: string;
}

export default function SpatialCodeLab({
  style,
  showHero = true,
  showGallery = true,
  showCodepen = true,
  showDesign = true,
  showPlayground = true,
  showNav = true,
  heroHeadline = 'Interactive\nSpatial Canvas',
}: Props) {
  useEffect(() => {
    injectCSS('scl-main-css', CSS);
  }, []);
  const [activeNav, setActiveNav] = useState('hero');
  const [hovCard, setHovCard] = useState<string | null>(null);
  const [tabActive, setTabActive] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const scrollTo = (id: string) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const navItems = [
    { id: 'hero', label: 'Home', icon: '⌂' },
    { id: 'spline', label: 'Spline', icon: '◉' },
    { id: 'codepen', label: 'Code', icon: '⌨' },
    { id: 'penpot', label: 'Design', icon: '◈' },
    { id: 'playground', label: 'Play', icon: '◇' },
  ];

  return (
    <div
      style={{
        width: '100%',
        background: T.bg,
        fontFamily: "'Inter', -apple-system, sans-serif",
        ...style,
      }}
    >
      {/* ── DOCK NAV ── */}
      {showNav && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '8px 12px',
            background: 'rgba(7,7,16,0.85)',
            backdropFilter: 'blur(24px)',
            border: `1px solid ${T.border}`,
            borderRadius: 9999,
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.55), 0 0 30px rgba(59,130,246,0.08)',
          }}
        >
          {navItems.map(item => {
            const isA = item.id === activeNav;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  padding: '8px 16px',
                  borderRadius: 9999,
                  border: 'none',
                  cursor: 'pointer',
                  background: isA ? 'rgba(59,130,246,0.18)' : 'transparent',
                  color: isA ? T.blue4 : 'rgba(248,250,252,0.38)',
                  fontSize: 11,
                  fontWeight: 500,
                  transition: 'all .2s',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: 14, lineHeight: 1 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ── HERO ── */}
      {showHero && (
        <section
          id="hero"
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 80px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 85% 50%, rgba(99,102,241,0.10) 0%, transparent 50%)',
              animation: 'scl-heroGrad 12s ease-in-out infinite alternate',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
              maskImage:
                'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 10,
              textAlign: 'center',
              maxWidth: 900,
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 18px',
                marginBottom: 32,
                background: 'rgba(59,130,246,0.10)',
                border: '1px solid rgba(59,130,246,0.25)',
                borderRadius: 9999,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: T.blue4,
                  display: 'inline-block',
                  animation: 'scl-pulse 2s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: T.blue4,
                  letterSpacing: '0.1em',
                }}
              >
                INTERACTIVE SPATIAL CANVAS
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.8rem,8vw,5.5rem)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                margin: '0 0 24px',
                background:
                  'linear-gradient(135deg,#f8fafc 0%,#60a5fa 40%,#818cf8 60%,#22d3ee 80%,#f8fafc 100%)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                animation: 'scl-gradFlow 8s ease infinite',
                whiteSpace: 'pre-line',
              }}
            >
              {heroHeadline}
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem,2.5vw,1.2rem)',
                color: T.textMuted,
                maxWidth: 580,
                margin: '0 auto 40px',
                lineHeight: 1.75,
              }}
            >
              A premium canvas for Spline 3D scenes, CodePen demos, Figma
              prototypes, and interactive React components.
            </p>

            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => scrollTo('spline')}
                style={{
                  padding: '14px 28px',
                  borderRadius: 9999,
                  border: 'none',
                  background: `linear-gradient(135deg, ${T.blue}, ${T.ind})`,
                  color: 'white',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 24px rgba(59,130,246,0.4)',
                  fontFamily: 'inherit',
                }}
              >
                Explore Lab →
              </button>
              <button
                style={{
                  padding: '14px 28px',
                  borderRadius: 9999,
                  cursor: 'pointer',
                  background: 'rgba(255,255,255,0.06)',
                  border: `1px solid ${T.border}`,
                  color: T.textMuted,
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                }}
              >
                View Source ↗
              </button>
            </div>
          </div>

          {/* Hero scene */}
          <div
            style={{
              position: 'relative',
              zIndex: 5,
              width: '100%',
              maxWidth: 900,
              marginTop: 64,
            }}
          >
            <div
              style={{
                ...glassStyle(24),
                height: 340,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)',
                }}
              />
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    margin: '0 auto 20px',
                    background:
                      'conic-gradient(from 0deg, #3b82f6, #6366f1, #22d3ee, #3b82f6)',
                    animation: 'scl-spin 8s linear infinite',
                    boxShadow:
                      '0 0 60px rgba(59,130,246,0.5), 0 0 120px rgba(99,102,241,0.2)',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 8,
                      borderRadius: '50%',
                      background: 'rgba(7,7,16,0.88)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      background:
                        'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.18), transparent 55%)',
                    }}
                  />
                </div>
                <p
                  style={{
                    color: 'rgba(248,250,252,0.25)',
                    fontSize: 11,
                    letterSpacing: '0.08em',
                  }}
                >
                  spline-viewer · Drop your Spline scene URL here
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── SPLINE GALLERY ── */}
      {showGallery && (
        <section id="spline" style={{ ...sectionStyle, background: T.bg }}>
          <SectionHeader
            label="● SPLINE GALLERY"
            title="Interactive 3D Scenes"
            desc="Drop any Spline scene URL into these cards for live 3D embeds"
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              maxWidth: 1200,
              margin: '0 auto',
            }}
          >
            {GALLERY_SCENES.map(sc => {
              const SC = sc.SC;
              const isHov = hovCard === sc.label;
              return (
                <div
                  key={sc.label}
                  onMouseEnter={() => setHovCard(sc.label)}
                  onMouseLeave={() => setHovCard(null)}
                  style={{
                    borderRadius: 20,
                    overflow: 'hidden',
                    background: T.glass,
                    border: `1px solid ${T.border}`,
                    transition: 'all .3s',
                    transform: isHov ? 'translateY(-6px) scale(1.01)' : 'none',
                    boxShadow: isHov
                      ? '0 30px 80px rgba(0,0,0,0.4), 0 0 40px rgba(59,130,246,0.15)'
                      : '0 8px 32px rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ height: 240, position: 'relative' }}>
                    <SC />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(7,7,16,0.4)',
                        backdropFilter: 'blur(2px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isHov ? 1 : 0,
                        transition: 'opacity .3s',
                      }}
                    >
                      <button
                        style={{
                          padding: '10px 24px',
                          borderRadius: 9999,
                          background: `linear-gradient(135deg, ${T.blue}, ${T.ind})`,
                          color: 'white',
                          fontSize: 13,
                          fontWeight: 600,
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        Open Scene ↗
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '14px 20px',
                      background: 'rgba(7,7,16,0.7)',
                      borderTop: `1px solid ${T.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: T.text,
                          margin: '0 0 2px',
                        }}
                      >
                        {sc.label}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: 'rgba(248,250,252,0.38)',
                          margin: 0,
                        }}
                      >
                        {sc.desc}
                      </p>
                    </div>
                    <span
                      style={{
                        padding: '3px 10px',
                        borderRadius: 9999,
                        background: `${sc.chipC}22`,
                        border: `1px solid ${sc.chipC}44`,
                        fontSize: 10,
                        fontWeight: 600,
                        color: sc.chipC,
                      }}
                    >
                      {sc.chip}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── CODEPEN LAB ── */}
      {showCodepen && (
        <section id="codepen" style={{ ...sectionStyle }}>
          <SectionHeader
            label="● CODEPEN LAB"
            title="Code Experiments"
            desc="Live CSS demos — swap in any CodePen or custom HTML/CSS/JS embed"
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 20,
              maxWidth: 1200,
              margin: '0 auto',
            }}
          >
            {[
              {
                title: 'Glass Morphism',
                lang: 'CSS',
                demo: (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.1))',
                    }}
                  >
                    <div
                      style={{
                        width: 200,
                        height: 120,
                        ...glassStyle(20),
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <span style={{ fontSize: 28 }}>◉</span>
                      <span style={{ fontSize: 12, color: T.textMuted }}>
                        backdrop-filter: blur(20px)
                      </span>
                    </div>
                  </div>
                ),
              },
              {
                title: '3D Card Flip',
                lang: 'CSS',
                demo: (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.1), transparent 70%)',
                    }}
                  >
                    <div
                      style={{ width: 160, height: 100, perspective: '600px' }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          transformStyle: 'preserve-3d',
                          transform: 'rotateY(20deg)',
                          transition: 'transform .6s',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            background:
                              'linear-gradient(135deg, rgba(99,102,241,0.6), rgba(59,130,246,0.6))',
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: 32 }}>◈</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                title: 'Neon Text FX',
                lang: 'CSS',
                demo: (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#050508',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 32,
                        fontWeight: 900,
                        color: T.cyan,
                        textShadow: `0 0 10px ${T.cyan}, 0 0 20px ${T.cyan}, 0 0 40px ${T.cyan}, 0 0 80px ${T.cyan}`,
                        fontFamily: 'inherit',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      SPATIAL
                    </span>
                  </div>
                ),
              },
              {
                title: 'CSS Loader',
                lang: 'CSS',
                demo: (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: T.bg,
                      gap: 16,
                    }}
                  >
                    {[T.blue, T.ind, T.cyan, T.purp].map((c, i) => (
                      <div
                        key={c}
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          background: c,
                          animation: `scl-pulse 1.2s ease-in-out infinite`,
                          animationDelay: `${i * 0.2}s`,
                          boxShadow: `0 0 12px ${c}`,
                        }}
                      />
                    ))}
                  </div>
                ),
              },
            ].map(card => (
              <div
                key={card.title}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  background: T.glass,
                  border: `1px solid ${T.border}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 16px',
                    background: 'rgba(7,7,16,0.6)',
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                      <div
                        key={c}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: c,
                        }}
                      />
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'rgba(248,250,252,0.5)',
                    }}
                  >
                    {card.title}
                  </span>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: 9999,
                      background: 'rgba(59,130,246,0.15)',
                      border: '1px solid rgba(59,130,246,0.25)',
                      fontSize: 10,
                      fontWeight: 700,
                      color: T.blue4,
                    }}
                  >
                    {card.lang}
                  </span>
                </div>
                <div style={{ height: 240 }}>{card.demo}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── DESIGN SYSTEM ── */}
      {showDesign && (
        <section id="penpot" style={{ ...sectionStyle }}>
          <SectionHeader
            label="● DESIGN SYSTEM"
            title="Visual Tokens"
            desc="Colors, typography, spacing, and component tokens"
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 20,
              maxWidth: 1200,
              margin: '0 auto',
            }}
          >
            {/* Color tokens */}
            <div style={{ ...glassStyle(20), padding: 24 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.textMuted,
                  margin: '0 0 16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Color Palette
              </p>
              {[
                { label: 'Blue 500', c: T.blue },
                { label: 'Blue 400', c: T.blue4 },
                { label: 'Indigo 500', c: T.ind },
                { label: 'Cyan 400', c: T.cyan },
                { label: 'Purple 400', c: T.purp },
              ].map(swatch => (
                <div
                  key={swatch.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: swatch.c,
                      flexShrink: 0,
                      boxShadow: `0 0 12px ${swatch.c}44`,
                    }}
                  />
                  <span
                    style={{ fontSize: 13, fontWeight: 500, color: T.text }}
                  >
                    {swatch.label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: T.textMuted,
                      marginLeft: 'auto',
                    }}
                  >
                    {swatch.c}
                  </span>
                </div>
              ))}
            </div>

            {/* Typography */}
            <div style={{ ...glassStyle(20), padding: 24 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.textMuted,
                  margin: '0 0 16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Type Scale
              </p>
              {[
                { size: '48px', style: 'Extra Bold', sample: 'Display' },
                { size: '32px', style: 'Bold', sample: 'Heading' },
                { size: '18px', style: 'Medium', sample: 'Body Large' },
                { size: '14px', style: 'Regular', sample: 'Body Default' },
                { size: '11px', style: 'Semi Bold', sample: 'LABEL' },
              ].map(t => (
                <div
                  key={t.size}
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 12,
                    marginBottom: 12,
                    paddingBottom: 12,
                    borderBottom: `1px solid ${T.border}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: t.size,
                      fontWeight: t.style.includes('Extra')
                        ? 800
                        : t.style.includes('Bold')
                        ? 700
                        : t.style === 'Semi Bold'
                        ? 600
                        : t.style === 'Medium'
                        ? 500
                        : 400,
                      color: T.text,
                      lineHeight: 1,
                    }}
                  >
                    {t.sample}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: T.textMuted,
                      marginLeft: 'auto',
                      flexShrink: 0,
                    }}
                  >
                    {t.size}
                  </span>
                </div>
              ))}
            </div>

            {/* Spacing + Radii */}
            <div style={{ ...glassStyle(20), padding: 24 }}>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.textMuted,
                  margin: '0 0 16px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Spacing & Radii
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 8,
                  marginBottom: 24,
                }}
              >
                {[4, 8, 16, 24, 32, 48].map(s => (
                  <div
                    key={s}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        width: Math.min(s, 32),
                        height: Math.min(s, 32),
                        background: 'rgba(59,130,246,0.4)',
                        borderRadius: 3,
                      }}
                    />
                    <span style={{ fontSize: 9, color: T.textMuted }}>{s}</span>
                  </div>
                ))}
              </div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: T.textMuted,
                  margin: '0 0 12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                Border Radius
              </p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                {[4, 8, 12, 16, 24, 32].map(r => (
                  <div
                    key={r}
                    style={{
                      width: 36,
                      height: 36,
                      background: 'rgba(59,130,246,0.15)',
                      border: '1px solid rgba(59,130,246,0.3)',
                      borderRadius: Math.min(r, 36),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span style={{ fontSize: 8, color: T.blue4 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── REACT PLAYGROUND ── */}
      {showPlayground && (
        <section id="playground" style={{ ...sectionStyle }}>
          <SectionHeader
            label="● REACT PLAYGROUND"
            title="Interactive Components"
            desc="Live React demos — toggle, tab, modal, and dashboard"
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 24,
              maxWidth: 1200,
              margin: '0 auto',
            }}
          >
            {/* Toggles */}
            <div style={{ ...glassStyle(20), overflow: 'hidden' }}>
              <div
                style={{
                  padding: '16px 24px',
                  borderBottom: `1px solid ${T.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'rgba(248,250,252,0.4)',
                    textTransform: 'uppercase',
                  }}
                >
                  Toggle Switches
                </span>
                <span style={{ fontSize: 10, color: 'rgba(248,250,252,0.2)' }}>
                  useState · React
                </span>
              </div>
              <div style={{ padding: 24 }}>
                {[
                  ['Dark Mode', true],
                  ['Notifications', false],
                  ['Auto Save', true],
                  ['Live Preview', false],
                ].map(([l, on]) => (
                  <Toggle
                    key={l as string}
                    label={l as string}
                    initialOn={on as boolean}
                  />
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ ...glassStyle(20), overflow: 'hidden' }}>
              <div
                style={{
                  padding: '16px 24px',
                  borderBottom: `1px solid ${T.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'rgba(248,250,252,0.4)',
                    textTransform: 'uppercase',
                  }}
                >
                  Tab Navigation
                </span>
                <span style={{ fontSize: 10, color: 'rgba(248,250,252,0.2)' }}>
                  useState · React
                </span>
              </div>
              <div style={{ padding: 24 }}>
                <div
                  style={{
                    display: 'flex',
                    gap: 2,
                    padding: 4,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)',
                    marginBottom: 16,
                  }}
                >
                  {['Overview', 'Analytics', 'Settings'].map((t, i) => (
                    <button
                      key={t}
                      onClick={() => setTabActive(i)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        borderRadius: 10,
                        border: 'none',
                        cursor: 'pointer',
                        background:
                          tabActive === i
                            ? 'rgba(59,130,246,0.2)'
                            : 'transparent',
                        color:
                          tabActive === i ? T.blue4 : 'rgba(248,250,252,0.4)',
                        fontSize: 13,
                        fontWeight: 500,
                        transition: 'all .2s',
                        fontFamily: 'inherit',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div
                  style={{
                    padding: 16,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${T.border}`,
                    fontSize: 13,
                    color: T.textMuted,
                    lineHeight: 1.7,
                  }}
                >
                  {
                    [
                      'Welcome to Spatial Code Lab. This canvas combines Spline 3D, CodePen demos, Figma prototypes, and React.',
                      'Page views: 42,840 · Unique visitors: 12,400 · Avg. session: 3m 24s · Conv. rate: 2.8%',
                      'Configure embed sources, animation settings, theme tokens, and component behavior.',
                    ][tabActive]
                  }
                </div>
              </div>
            </div>

            {/* Modal */}
            <div style={{ ...glassStyle(20), overflow: 'hidden' }}>
              <div
                style={{
                  padding: '16px 24px',
                  borderBottom: `1px solid ${T.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'rgba(248,250,252,0.4)',
                    textTransform: 'uppercase',
                  }}
                >
                  Modal Dialog
                </span>
                <span style={{ fontSize: 10, color: 'rgba(248,250,252,0.2)' }}>
                  useState · React
                </span>
              </div>
              <div
                style={{
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    padding: '12px 28px',
                    borderRadius: 9999,
                    border: 'none',
                    background: `linear-gradient(135deg, ${T.blue}, ${T.ind})`,
                    color: 'white',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
                    fontFamily: 'inherit',
                  }}
                >
                  Open Modal Dialog
                </button>
                <p
                  style={{
                    fontSize: 12,
                    color: 'rgba(248,250,252,0.25)',
                    textAlign: 'center',
                  }}
                >
                  Glassmorphism modal with backdrop blur &amp; spring animation
                </p>
              </div>
              {showModal && (
                <div
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    background: 'rgba(0,0,0,0.75)',
                    backdropFilter: 'blur(12px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'scl-backdropIn .2s ease forwards',
                  }}
                  onClick={e => {
                    if (e.target === e.currentTarget) setShowModal(false);
                  }}
                >
                  <div
                    style={{
                      width: 420,
                      background: 'rgba(13,13,26,0.96)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 28,
                      padding: 32,
                      position: 'relative',
                      boxShadow:
                        '0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(59,130,246,0.1)',
                      animation:
                        'scl-modalIn .3s cubic-bezier(.34,1.56,.64,1) forwards',
                      fontFamily: 'inherit',
                    }}
                  >
                    <button
                      onClick={() => setShowModal(false)}
                      style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(248,250,252,0.5)',
                        cursor: 'pointer',
                        fontSize: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'inherit',
                      }}
                    >
                      ×
                    </button>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        marginBottom: 20,
                        background: `linear-gradient(135deg, ${T.blue}, ${T.ind})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                      }}
                    >
                      ◉
                    </div>
                    <h3
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: T.text,
                        margin: '0 0 10px',
                      }}
                    >
                      Spatial Code Lab
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        color: T.textMuted,
                        lineHeight: 1.7,
                        margin: '0 0 28px',
                      }}
                    >
                      This modal is a React component with glassmorphism
                      styling, backdrop blur, and spring animation. Add any
                      HTML, CSS, JS, or React content here.
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        gap: 10,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <button
                        onClick={() => setShowModal(false)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 12,
                          background: 'rgba(255,255,255,0.06)',
                          border: `1px solid ${T.border}`,
                          color: T.textMuted,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        style={{
                          padding: '10px 20px',
                          borderRadius: 12,
                          background: `linear-gradient(135deg, ${T.blue}, ${T.ind})`,
                          border: 'none',
                          color: 'white',
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          boxShadow: '0 4px 16px rgba(59,130,246,0.4)',
                        }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dashboard */}
            <div style={{ ...glassStyle(20), overflow: 'hidden' }}>
              <div
                style={{
                  padding: '16px 24px',
                  borderBottom: `1px solid ${T.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    color: 'rgba(248,250,252,0.4)',
                    textTransform: 'uppercase',
                  }}
                >
                  Dashboard Widget
                </span>
                <span style={{ fontSize: 10, color: 'rgba(248,250,252,0.2)' }}>
                  useState · React
                </span>
              </div>
              <div style={{ padding: 24 }}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  {[
                    { l: 'Revenue', v: '$48.2k', ch: '+12.4%', up: true },
                    { l: 'Users', v: '12.4k', ch: '+8.2%', up: true },
                    { l: 'Orders', v: '3.2k', ch: '-2.1%', up: false },
                    { l: 'Conv.', v: '2.8%', ch: '+0.4%', up: true },
                  ].map(m => (
                    <div
                      key={m.l}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 12,
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${T.border}`,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 10,
                          color: T.textMuted,
                          margin: '0 0 4px',
                        }}
                      >
                        {m.l}
                      </p>
                      <p
                        style={{
                          fontSize: 20,
                          fontWeight: 800,
                          color: T.text,
                          margin: '0 0 4px',
                          letterSpacing: '-0.02em',
                        }}
                      >
                        {m.v}
                      </p>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 9999,
                          background: m.up
                            ? 'rgba(52,211,153,0.12)'
                            : 'rgba(248,113,113,0.12)',
                          color: m.up ? '#34d399' : '#f87171',
                        }}
                      >
                        {m.ch}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 8,
                    height: 72,
                  }}
                >
                  {[42, 68, 55, 80, 62, 90, 74].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          borderRadius: '4px 4px 0 0',
                          height: `${h}%`,
                          background: `linear-gradient(to top, rgba(59,130,246,0.6), rgba(99,102,241,0.85))`,
                          transition: 'all .2s',
                        }}
                      />
                      <span
                        style={{ fontSize: 9, color: 'rgba(248,250,252,0.25)' }}
                      >
                        {'MTWTFSS'[i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer
        style={{
          padding: '64px 80px',
          borderTop: `1px solid ${T.border}`,
          textAlign: 'center',
          position: 'relative',
          fontFamily: 'inherit',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60%',
            height: 1,
            background: `linear-gradient(90deg, transparent, ${T.blue}66, transparent)`,
          }}
        />
        <p
          style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            background: `linear-gradient(135deg, ${T.blue4}, "#818cf8")`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: '0 0 8px',
          }}
        >
          Spatial Code Lab
        </p>
        <p
          style={{
            fontSize: 13,
            color: 'rgba(248,250,252,0.3)',
            margin: '0 0 24px',
          }}
        >
          Built with Spline · Figma · React · Webflow · Framer
        </p>
        <div
          style={{
            display: 'flex',
            gap: 32,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[
            'Hero',
            'Spline Gallery',
            'CodePen Lab',
            'Design System',
            'Playground',
          ].map(link => (
            <span
              key={link}
              style={{
                fontSize: 13,
                color: 'rgba(248,250,252,0.3)',
                cursor: 'pointer',
                transition: 'color .2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = T.blue4)}
              onMouseLeave={e =>
                (e.currentTarget.style.color = 'rgba(248,250,252,0.3)')
              }
            >
              {link}
            </span>
          ))}
        </div>
      </footer>

      {/* Bottom padding for dock nav */}
      <div style={{ height: 88 }} />
    </div>
  );
}

addPropertyControls(SpatialCodeLab, {
  heroHeadline: {
    type: ControlType.String,
    title: 'Headline',
    defaultValue: 'Interactive\nSpatial Canvas',
    displayTextArea: true,
  },
  showHero: {
    type: ControlType.Boolean,
    title: 'Show Hero',
    defaultValue: true,
  },
  showGallery: {
    type: ControlType.Boolean,
    title: 'Show Spline Gallery',
    defaultValue: true,
  },
  showCodepen: {
    type: ControlType.Boolean,
    title: 'Show CodePen Lab',
    defaultValue: true,
  },
  showDesign: {
    type: ControlType.Boolean,
    title: 'Show Design System',
    defaultValue: true,
  },
  showPlayground: {
    type: ControlType.Boolean,
    title: 'Show Playground',
    defaultValue: true,
  },
  showNav: {
    type: ControlType.Boolean,
    title: 'Show Dock Nav',
    defaultValue: true,
  },
});
