/* ============================================================
   SPATIAL CODE LAB — React App (CDN / Babel)
   ============================================================ */

const { useState, useEffect, useRef, useCallback } = React;

/* ── useScrollSpy ────────────────────────────────────────── */
function useScrollSpy(sectionIds) {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const observers = [];
    const visible = {};

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          visible[id] = entry.isIntersecting;
          const found = sectionIds.find(sid => visible[sid]);
          if (found) setActiveId(found);
        },
        { threshold: 0.25, rootMargin: '-20% 0px -60% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return activeId;
}

/* ── useInView ───────────────────────────────────────────── */
function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);

  return inView;
}

/* ── GlassCard ───────────────────────────────────────────── */
function GlassCard({ children, className = '', onClick, glow = false }) {
  return (
    <div
      className={`glass-card${glow ? ' glow' : ''}${
        onClick ? ' clickable' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/* ── FloatingButton ──────────────────────────────────────── */
function FloatingButton({
  children,
  variant = 'primary',
  onClick,
  size = 'md',
}) {
  const cls = [
    'floating-btn',
    `floating-btn-${variant}`,
    size !== 'md' ? `floating-btn-${size}` : '',
  ].join(' ');
  return (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

/* ── Chip ────────────────────────────────────────────────── */
function Chip({ label, color = 'blue' }) {
  return <span className={`chip chip-${color}`}>{label}</span>;
}

/* ── SectionHeader ───────────────────────────────────────── */
function SectionHeader({ label, title, desc }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  return (
    <div
      className={`section-header fade-in-up${inView ? ' in-view' : ''}`}
      ref={ref}
    >
      <span className="section-label">{label}</span>
      <h2 className="section-title">{title}</h2>
      {desc && <p className="section-desc">{desc}</p>}
    </div>
  );
}

/* ── OrbScene ────────────────────────────────────────────── */
function OrbScene({ hue1 = '220', hue2 = '250' }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(ellipse at 50% 60%, hsl(${hue1},60%,8%) 0%, transparent 80%)`,
        overflow: 'hidden',
      }}
    >
      <div
        className="scene-orb"
        style={{
          '--orb-hue1': hue1,
          '--orb-hue2': hue2,
        }}
      >
        <div
          className="scene-orb-inner"
          style={{
            background: `radial-gradient(circle at 35% 35%,
            hsl(${hue1},100%,75%) 0%,
            hsl(${hue2},80%,45%) 50%,
            hsl(${Number(hue1) + 20},70%,25%) 100%)`,
            boxShadow: `0 0 40px hsl(${hue1},80%,50%,0.5)`,
          }}
        />
      </div>
    </div>
  );
}

/* ── NeuralScene ─────────────────────────────────────────── */
function NeuralScene() {
  const nodes = [
    { x: 50, y: 20 },
    { x: 20, y: 45 },
    { x: 80, y: 45 },
    { x: 35, y: 70 },
    { x: 65, y: 70 },
    { x: 50, y: 90 },
    { x: 10, y: 75 },
    { x: 90, y: 25 },
  ];
  const edges = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 4],
    [3, 5],
    [4, 5],
    [1, 6],
    [2, 7],
    [0, 7],
    [3, 4],
    [6, 3],
    [7, 4],
  ];

  return (
    <div className="scene-neural">
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="nodeGrad" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="rgba(59,130,246,0.35)"
            strokeWidth="0.5"
            style={{
              animation: `pulse ${
                1.5 + i * 0.2
              }s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r="3"
            fill="url(#nodeGrad)"
            filter="url(#glow)"
            style={{
              animation: `pulse ${2 + i * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ── LiquidScene ─────────────────────────────────────────── */
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
          'radial-gradient(ellipse at 50% 60%, rgba(6,182,212,0.04) 0%, transparent 80%)',
      }}
    >
      <div className="scene-liquid">
        <div className="scene-liquid-blob" />
      </div>
    </div>
  );
}

/* ── GridScene ───────────────────────────────────────────── */
function GridScene() {
  return (
    <div className="scene-grid">
      <div className="scene-grid-inner">
        <div className="scene-grid-glow" />
        <div className="scene-grid-lines" />
      </div>
    </div>
  );
}

/* ── ParticleScene ───────────────────────────────────────── */
function ParticleScene() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: 3 + Math.random() * 5,
    x: 5 + Math.random() * 90,
    y: 10 + Math.random() * 80,
    hue: [220, 240, 185, 280][i % 4],
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 4,
    px: -40 + Math.random() * 80 + 'px',
    py: -60 - Math.random() * 40 + 'px',
  }));

  return (
    <div
      className="scene-particle"
      style={{
        background:
          'radial-gradient(ellipse at 50% 80%, rgba(99,102,241,0.05) 0%, transparent 70%)',
      }}
    >
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `hsl(${p.hue}, 80%, 65%)`,
            boxShadow: `0 0 ${p.size * 2}px hsl(${p.hue}, 80%, 65%, 0.5)`,
            '--px': p.px,
            '--py': p.py,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── GeoScene ────────────────────────────────────────────── */
function GeoScene() {
  return (
    <div className="scene-geo">
      <div className="scene-cube">
        {['front', 'back', 'left', 'right', 'top', 'bottom'].map(f => (
          <div key={f} className={`scene-cube-face face-${f}`} />
        ))}
      </div>
    </div>
  );
}

/* ── DockNav ─────────────────────────────────────────────── */
function DockNav({ activeId, onNavigate }) {
  const items = [
    { id: 'hero', label: 'Home', icon: '⌂' },
    { id: 'spline', label: 'Spline', icon: '◉' },
    { id: 'codepen', label: 'Code', icon: '⌨' },
    { id: 'penpot', label: 'Design', icon: '◈' },
    { id: 'playground', label: 'Playground', icon: '◇' },
  ];

  return (
    <nav className="dock-nav">
      {items.map(item => (
        <button
          key={item.id}
          className={`dock-nav-item${activeId === item.id ? ' active' : ''}`}
          onClick={() => onNavigate(item.id)}
          title={item.label}
        >
          <span className="dock-icon">{item.icon}</span>
          <span className="dock-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ── HeroSection ─────────────────────────────────────────── */
function HeroSection({ onNavigate }) {
  return (
    <div className="hero">
      <div className="hero-gradient" />
      <div className="hero-grid" />
      <div className="hero-orbs">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot" />
          Interactive Spatial Canvas — v2.0
        </div>

        <h1 className="hero-headline">
          Spatial Code
          <br />
          Lab
        </h1>

        <p className="hero-subtitle">
          An immersive playground where 3D scenes, live code demos, design
          systems, and interactive React components collide in one unified
          spatial canvas.
        </p>

        <div className="hero-actions">
          <FloatingButton
            variant="primary"
            onClick={() => onNavigate('spline')}
            size="lg"
          >
            ◉ &nbsp;Explore Lab
          </FloatingButton>
          <FloatingButton
            variant="secondary"
            onClick={() => onNavigate('playground')}
            size="lg"
          >
            ◇ &nbsp;View Playground
          </FloatingButton>
        </div>

        <div className="hero-scene-glass">
          <OrbScene hue1="220" hue2="250" />
        </div>
      </div>
    </div>
  );
}

/* ── SplineGallery ───────────────────────────────────────── */
const SPLINE_CARDS = [
  {
    id: 'orb',
    title: 'Cosmic Orb',
    desc: '3D Scene',
    chip: 'blue',
    scene: () => <OrbScene hue1="220" hue2="260" />,
  },
  {
    id: 'neural',
    title: 'Neural Net',
    desc: 'AI Viz',
    chip: 'indigo',
    scene: () => <NeuralScene />,
  },
  {
    id: 'liquid',
    title: 'Liquid Metal',
    desc: 'Fluid',
    chip: 'cyan',
    scene: () => <LiquidScene />,
  },
  {
    id: 'grid',
    title: 'Digital Grid',
    desc: 'Matrix',
    chip: 'blue',
    scene: () => <GridScene />,
  },
  {
    id: 'particle',
    title: 'Particle Storm',
    desc: 'FX',
    chip: 'purple',
    scene: () => <ParticleScene />,
  },
  {
    id: 'geo',
    title: 'Geo Flow',
    desc: '3D Geo',
    chip: 'pink',
    scene: () => <GeoScene />,
  },
];

function SplineGallery() {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <div className="section">
      <div className="section-inner">
        <SectionHeader
          label="◉ Spline Gallery"
          title="Spatial 3D Scenes"
          desc="Handcrafted CSS-driven 3D and animated scenes — each a standalone visual system with depth, motion, and light."
        />

        <div
          ref={ref}
          className={`spline-gallery-grid fade-in-up${
            inView ? ' in-view' : ''
          }`}
        >
          {SPLINE_CARDS.map((card, i) => (
            <div
              key={card.id}
              className="spline-card"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className="spline-scene-bg">{card.scene()}</div>
              <div className="spline-card-overlay">
                <div className="spline-card-title">{card.title}</div>
                <Chip label={card.desc} color={card.chip} />
              </div>
              <div className="spline-card-hover-btn">
                <FloatingButton variant="primary" size="sm">
                  Open ↗
                </FloatingButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── CodePenLab ──────────────────────────────────────────── */
function GlassDemo() {
  return (
    <div className="css-glass-demo">
      <div className="glass-demo-card">
        <div className="glass-demo-avatar">🌊</div>
        <div className="glass-demo-text-lg">Glass Card</div>
        <div className="glass-demo-text-sm">backdrop-filter: blur(20px)</div>
        <div className="glass-demo-bar" />
      </div>
    </div>
  );
}

function FlipDemo() {
  return (
    <div className="css-flip-demo">
      <div className="flip-inner">
        <div className="flip-front">
          <span className="flip-front-icon">✦</span>
          <span>Hover Me</span>
        </div>
        <div className="flip-back">
          <span style={{ fontSize: '1.5rem' }}>◈</span>
          <span>3D Flip!</span>
        </div>
      </div>
    </div>
  );
}

function NeonDemo() {
  return (
    <div className="css-neon-demo">
      <div className="neon-text">NEON</div>
      <div className="neon-sub">text-shadow glow fx</div>
    </div>
  );
}

function LoaderDemo() {
  return (
    <div className="css-loader-demo">
      <div className="loader-dots">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="loader-dot" />
        ))}
      </div>
      <div className="loader-ring" />
      <div className="loader-label">Loading...</div>
    </div>
  );
}

const CODEPEN_CARDS = [
  {
    title: 'Glass Morphism',
    component: GlassDemo,
  },
  {
    title: '3D Card Flip',
    component: FlipDemo,
  },
  {
    title: 'Neon Text FX',
    component: NeonDemo,
  },
  {
    title: 'CSS Loader',
    component: LoaderDemo,
  },
];

function CodePenLab() {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <div
      className="section"
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(59,130,246,0.04) 0%, transparent 70%)',
      }}
    >
      <div className="section-inner">
        <SectionHeader
          label="⌨ CodePen Lab"
          title="Live CSS Demos"
          desc="Pure CSS demonstrations running live in the browser — glassmorphism, 3D transforms, neon effects, and animated loaders."
        />

        <div
          ref={ref}
          className={`codepen-grid fade-in-up${inView ? ' in-view' : ''}`}
        >
          {CODEPEN_CARDS.map((card, i) => {
            const Demo = card.component;
            return (
              <div
                key={i}
                className="codepen-card"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="codepen-header">
                  <div className="codepen-traffic">
                    <div className="traffic-dot traffic-red" />
                    <div className="traffic-dot traffic-yellow" />
                    <div className="traffic-dot traffic-green" />
                  </div>
                  <div className="codepen-title">{card.title}</div>
                </div>
                <div className="codepen-embed-area">
                  <Demo />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── PenpotDesign ────────────────────────────────────────── */
const BLUE_SHADES = [
  { hex: '#eff6ff', name: 'blue-50' },
  { hex: '#bfdbfe', name: 'blue-200' },
  { hex: '#3b82f6', name: 'blue-500' },
  { hex: '#1d4ed8', name: 'blue-700' },
  { hex: '#1e3a8a', name: 'blue-900' },
];

const INDIGO_SHADES = [
  { hex: '#eef2ff', name: 'indigo-50' },
  { hex: '#c7d2fe', name: 'indigo-200' },
  { hex: '#6366f1', name: 'indigo-500' },
  { hex: '#4338ca', name: 'indigo-700' },
  { hex: '#312e81', name: 'indigo-900' },
];

const TYPE_SCALE = [
  { size: '12px', weight: 400, sample: 'Caption text' },
  { size: '14px', weight: 400, sample: 'Body small' },
  { size: '16px', weight: 400, sample: 'Body regular' },
  { size: '20px', weight: 600, sample: 'Heading 5' },
  { size: '24px', weight: 700, sample: 'Heading 4' },
  { size: '32px', weight: 800, sample: 'Display' },
];

const SPACING = [
  { name: 'space-1', value: 4 },
  { name: 'space-2', value: 8 },
  { name: 'space-4', value: 16 },
  { name: 'space-6', value: 24 },
  { name: 'space-8', value: 32 },
  { name: 'space-12', value: 48 },
];

const RADII = [
  { name: 'sm', value: '8px' },
  { name: 'md', value: '12px' },
  { name: 'lg', value: '16px' },
  { name: 'xl', value: '24px' },
  { name: '2xl', value: '32px' },
  { name: 'full', value: '9999px' },
];

const ELEVATIONS = [
  { name: 'flat', shadow: 'none', desc: 'No elevation' },
  { name: 'sm', shadow: '0 1px 3px rgba(0,0,0,0.4)', desc: 'Surface level' },
  { name: 'md', shadow: '0 4px 16px rgba(0,0,0,0.5)', desc: 'Cards, panels' },
  { name: 'lg', shadow: '0 8px 32px rgba(0,0,0,0.6)', desc: 'Dropdowns' },
  {
    name: 'xl',
    shadow: '0 16px 64px rgba(0,0,0,0.7)',
    desc: 'Modals, overlays',
  },
];

function PenpotDesign() {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <div className="section">
      <div className="section-inner">
        <SectionHeader
          label="◈ Penpot Design"
          title="Design System"
          desc="Color palettes, typography scales, spacing tokens, elevation levels, and motion primitives forming a cohesive design language."
        />

        <div
          ref={ref}
          className={`penpot-grid fade-in-up${inView ? ' in-view' : ''}`}
        >
          {/* Color Palette */}
          <div className="penpot-card" style={{ transitionDelay: '0ms' }}>
            <div className="penpot-card-title">Color Palette</div>
            <div className="color-swatches">
              <div className="color-row">
                {BLUE_SHADES.map(c => (
                  <div
                    key={c.name}
                    className="color-swatch"
                    style={{ background: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
              <div className="color-swatch-label">Blue Scale</div>
              <div className="color-row">
                {INDIGO_SHADES.map(c => (
                  <div
                    key={c.name}
                    className="color-swatch"
                    style={{ background: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
              <div className="color-swatch-label">Indigo Scale</div>
            </div>
          </div>

          {/* Typography */}
          <div className="penpot-card" style={{ transitionDelay: '60ms' }}>
            <div className="penpot-card-title">Type Scale</div>
            <div className="type-scale">
              {TYPE_SCALE.map(t => (
                <div key={t.size} className="type-row">
                  <span className="type-size">{t.size}</span>
                  <span
                    className="type-sample"
                    style={{ fontSize: t.size, fontWeight: t.weight }}
                  >
                    {t.sample}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div className="penpot-card" style={{ transitionDelay: '120ms' }}>
            <div className="penpot-card-title">Spacing System</div>
            {SPACING.map(s => (
              <div key={s.name} className="spacing-row">
                <div
                  className="spacing-block"
                  style={{ width: s.value * 1.5 }}
                />
                <span className="spacing-label">
                  {s.name} · {s.value}px
                </span>
              </div>
            ))}
          </div>

          {/* Border Radius */}
          <div className="penpot-card" style={{ transitionDelay: '180ms' }}>
            <div className="penpot-card-title">Border Radius</div>
            <div className="radius-samples">
              {RADII.map(r => (
                <div key={r.name} className="radius-sample">
                  <div
                    className="radius-box"
                    style={{ borderRadius: r.value }}
                  />
                  <div className="radius-name">
                    <div
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '11px',
                      }}
                    >
                      --r-{r.name}
                    </div>
                    <div
                      style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '10px',
                      }}
                    >
                      {r.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Elevation */}
          <div className="penpot-card" style={{ transitionDelay: '240ms' }}>
            <div className="penpot-card-title">Elevation</div>
            <div className="elevation-samples">
              {ELEVATIONS.map(e => (
                <div key={e.name} className="elevation-row">
                  <div
                    className="elevation-box"
                    style={{ boxShadow: e.shadow }}
                  />
                  <span className="elevation-name">
                    <span style={{ fontWeight: 600 }}>{e.name}</span>
                    <span
                      style={{
                        color: 'var(--text-tertiary)',
                        marginLeft: 8,
                        fontSize: '11px',
                      }}
                    >
                      {e.desc}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Motion */}
          <div className="penpot-card" style={{ transitionDelay: '300ms' }}>
            <div className="penpot-card-title">Motion Curves</div>
            <div className="motion-samples">
              {[
                { label: 'ease-in', cls: 'ease-in' },
                { label: 'ease-out', cls: 'ease-out' },
                { label: 'spring', cls: 'spring' },
              ].map(m => (
                <div key={m.label} className="motion-row">
                  <div className="motion-label">{m.label}</div>
                  <div className="motion-bar-track">
                    <div className={`motion-bar-fill ${m.cls}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── ToggleSwitches ──────────────────────────────────────── */
function ToggleSwitches() {
  const [toggles, setToggles] = useState({
    darkMode: true,
    notifications: false,
    autoSave: true,
    livePreview: false,
  });

  const toggle = key => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const items = [
    { key: 'darkMode', label: 'Dark Mode' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'autoSave', label: 'Auto Save' },
    { key: 'livePreview', label: 'Live Preview' },
  ];

  return (
    <div className="playground-card">
      <div className="playground-card-header">
        <div className="playground-card-title">Toggle Switches</div>
        <Chip label="useState" color="blue" />
      </div>
      <div className="playground-card-body">
        <div className="toggle-list">
          {items.map(item => (
            <div key={item.key} className="toggle-row">
              <span className="toggle-label">{item.label}</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={toggles[item.key]}
                  onChange={() => toggle(item.key)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── TabNav ──────────────────────────────────────────────── */
function TabNavDemo() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="playground-card">
      <div className="playground-card-header">
        <div className="playground-card-title">Tab Navigation</div>
        <Chip label="useState" color="indigo" />
      </div>
      <div className="playground-card-body">
        <div className="tab-nav">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`tab-btn${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="tab-panel active">
              <div className="tab-stat-grid">
                <div className="tab-stat">
                  <div className="tab-stat-value">4.8k</div>
                  <div className="tab-stat-label">Visitors</div>
                </div>
                <div className="tab-stat">
                  <div className="tab-stat-value">92%</div>
                  <div className="tab-stat-label">Uptime</div>
                </div>
                <div className="tab-stat">
                  <div className="tab-stat-value">128</div>
                  <div className="tab-stat-label">Deploys</div>
                </div>
                <div className="tab-stat">
                  <div className="tab-stat-value">1.2s</div>
                  <div className="tab-stat-label">Avg Load</div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="tab-panel active">
              <div style={{ padding: '8px 0' }}>
                {['Organic', 'Direct', 'Referral', 'Social'].map((src, i) => (
                  <div key={src} style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {src}
                      </span>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--accent-blue)',
                          fontWeight: 600,
                        }}
                      >
                        {[45, 28, 18, 9][i]}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${[45, 28, 18, 9][i]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="tab-panel active">
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
              >
                {['Compact View', 'Email Reports', 'API Access'].map((s, i) => (
                  <div
                    key={s}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: 'rgba(0,0,0,0.2)',
                      borderRadius: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {s}
                    </span>
                    <Chip
                      label={i === 1 ? 'Off' : 'On'}
                      color={i === 1 ? 'indigo' : 'cyan'}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── ModalDemo ───────────────────────────────────────────── */
function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="playground-card">
      <div className="playground-card-header">
        <div className="playground-card-title">Modal Dialog</div>
        <Chip label="useState" color="cyan" />
      </div>
      <div
        className="playground-card-body"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          paddingTop: 32,
          paddingBottom: 32,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>◈</div>
          <div
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              marginBottom: 20,
            }}
          >
            Click to open a glass modal with backdrop blur
          </div>
        </div>
        <FloatingButton variant="primary" onClick={() => setOpen(true)}>
          Open Modal ↗
        </FloatingButton>

        {open && (
          <div className="modal-backdrop" onClick={() => setOpen(false)}>
            <div className="modal-dialog" onClick={e => e.stopPropagation()}>
              <button className="modal-close-x" onClick={() => setOpen(false)}>
                ✕
              </button>
              <div className="modal-title">Spatial Modal</div>
              <div className="modal-body">
                This glass modal features a backdrop blur overlay, spring
                animation entrance, and click-outside-to-close behavior — all
                with pure React state.
              </div>
              <div className="modal-footer">
                <FloatingButton
                  variant="secondary"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </FloatingButton>
                <FloatingButton
                  variant="primary"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Confirm
                </FloatingButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── DashboardWidget ─────────────────────────────────────── */
function DashboardWidget() {
  const [highlighted, setHighlighted] = useState(null);

  const metrics = [
    { label: 'Revenue', value: '$48.2k', delta: '+12.4%', dir: 'up' },
    { label: 'Users', value: '12.4k', delta: '+8.1%', dir: 'up' },
    { label: 'Orders', value: '3.2k', delta: '-2.3%', dir: 'down' },
    { label: 'Conv.', value: '2.8%', delta: '+0.4%', dir: 'up' },
  ];

  const barHeights = [55, 72, 44, 88, 61, 78, 95];

  return (
    <div className="playground-card">
      <div className="playground-card-header">
        <div className="playground-card-title">Dashboard Widget</div>
        <Chip label="Interactive" color="purple" />
      </div>
      <div className="playground-card-body">
        <div className="dashboard-metrics">
          {metrics.map(m => (
            <div key={m.label} className="metric-card">
              <div className="metric-label">{m.label}</div>
              <div className="metric-value">
                {m.value}
                <span className={`metric-delta ${m.dir}`}>{m.delta}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            marginBottom: 8,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Weekly Trend
        </div>
        <div className="bar-chart">
          {barHeights.map((h, i) => (
            <div
              key={i}
              className="bar-chart-bar"
              style={{
                height: `${h}%`,
                background:
                  highlighted === i
                    ? 'linear-gradient(180deg, var(--accent-blue) 0%, rgba(59,130,246,0.6) 100%)'
                    : undefined,
              }}
              onMouseEnter={() => setHighlighted(i)}
              onMouseLeave={() => setHighlighted(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── ReactPlayground ─────────────────────────────────────── */
function ReactPlayground() {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <div
      className="section"
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(99,102,241,0.04) 0%, transparent 70%)',
      }}
    >
      <div className="section-inner">
        <SectionHeader
          label="◇ Playground"
          title="React Demos"
          desc="Fully interactive React components — toggles, tabs, modals, and a live dashboard widget, all powered by useState."
        />

        <div
          ref={ref}
          className={`playground-grid fade-in-up${inView ? ' in-view' : ''}`}
        >
          <ToggleSwitches />
          <TabNavDemo />
          <ModalDemo />
          <DashboardWidget />
        </div>
      </div>
    </div>
  );
}

/* ── Footer ──────────────────────────────────────────────── */
function Footer({ onNavigate }) {
  const navLinks = [
    { label: 'Hero', id: 'hero' },
    { label: 'Spline', id: 'spline' },
    { label: 'CodePen', id: 'codepen' },
    { label: 'Design', id: 'penpot' },
    { label: 'Playground', id: 'playground' },
  ];

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-logo">Spatial Code Lab</div>
        <div className="footer-tagline">
          Built with Spline · Figma · React · Webflow
        </div>
        <nav className="footer-nav">
          {navLinks.map((link, i) => (
            <React.Fragment key={link.id}>
              {i > 0 && <div className="footer-divider" />}
              <span
                className="footer-nav-link"
                onClick={() => onNavigate(link.id)}
              >
                {link.label}
              </span>
            </React.Fragment>
          ))}
        </nav>
        <div className="footer-copy">
          © 2025 Spatial Code Lab. A spatial canvas experience.
        </div>
      </div>
    </footer>
  );
}

/* ── App ─────────────────────────────────────────────────── */
function App() {
  const activeId = useScrollSpy([
    'hero',
    'spline',
    'codepen',
    'penpot',
    'playground',
  ]);

  const scrollTo = useCallback(id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="app">
      <DockNav activeId={activeId} onNavigate={scrollTo} />
      <main>
        <section id="hero">
          <HeroSection onNavigate={scrollTo} />
        </section>
        <section id="spline">
          <SplineGallery />
        </section>
        <section id="codepen">
          <CodePenLab />
        </section>
        <section id="penpot">
          <PenpotDesign />
        </section>
        <section id="playground">
          <ReactPlayground />
        </section>
      </main>
      <Footer onNavigate={scrollTo} />
    </div>
  );
}

/* ── Mount ───────────────────────────────────────────────── */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
