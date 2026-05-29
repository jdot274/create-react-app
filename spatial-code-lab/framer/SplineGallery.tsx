import { addPropertyControls, ControlType } from 'framer';
import { useState, useEffect } from 'react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@keyframes scl-orbRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes scl-neuralPulse { 0%,100%{opacity:.4;r:3} 50%{opacity:1;r:5} }
@keyframes scl-liquidMorph {
  0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}
  25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}
  50%{border-radius:50% 60% 40% 50%/30% 60% 70% 50%}
  75%{border-radius:40% 50% 60% 30%/70% 40% 50% 60%}
}
@keyframes scl-gridShift { 0%{transform:perspective(300px) rotateX(20deg) translateY(0)} 100%{transform:perspective(300px) rotateX(20deg) translateY(-30px)} }
@keyframes scl-particleUp { 0%{transform:translateY(0) scale(1);opacity:.7} 100%{transform:translateY(-80px) scale(0);opacity:0} }
@keyframes scl-cubeRotate { from{transform:rotateY(0deg) rotateX(10deg)} to{transform:rotateY(360deg) rotateX(10deg)} }
@keyframes scl-waveFlow { 0%,100%{d:path("M0,32 Q80,0 160,32 Q240,64 320,32 L320,80 L0,80 Z")} 50%{d:path("M0,32 Q80,64 160,32 Q240,0 320,32 L320,80 L0,80 Z")} }
`;

function injectCSS(id: string, css: string) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = css;
  document.head.appendChild(s);
}

// ── Scene renderers ──
function OrbScene({
  hue1 = '220',
  hue2 = '260',
}: {
  hue1?: string;
  hue2?: string;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(ellipse at 50% 50%, hsla(${hue1},80%,30%,0.3), transparent 70%)`,
      }}
    >
      <div style={{ position: 'relative', width: 120, height: 120 }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `conic-gradient(from 0deg, hsl(${hue1},80%,55%), hsl(${hue2},80%,55%), hsl(${hue1},80%,55%))`,
            animation: 'scl-orbRotate 6s linear infinite',
            boxShadow: `0 0 40px hsla(${hue1},80%,55%,0.5)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 8,
            borderRadius: '50%',
            background: '#070710',
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
          width: 110,
          height: 110,
          background:
            'linear-gradient(135deg, rgba(99,102,241,0.8), rgba(6,182,212,0.8))',
          animation: 'scl-liquidMorph 6s ease-in-out infinite',
          boxShadow: '0 0 40px rgba(99,102,241,0.4)',
        }}
      />
    </div>
  );
}

function GridScene() {
  const lines = Array.from({ length: 8 });
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
          width: 240,
          height: 160,
          position: 'relative',
          transform: 'perspective(300px) rotateX(25deg)',
          animation: 'scl-gridShift 4s ease-in-out infinite alternate',
        }}
      >
        {lines.map((_, i) => (
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
        {lines.map((_, i) => (
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
  const pts = Array.from({ length: 18 }, (_, i) => ({
    x: `${((i * 37) % 90) + 5}%`,
    bottom: `${(i * 17) % 60}%`,
    size: 3 + (i % 4),
    dur: `${3 + (i % 4)}s`,
    delay: `${(i * 0.4) % 3}s`,
    hue: 210 + ((i * 15) % 80),
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
            animation: `scl-particleUp ${p.dur} ease-in infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function GeoScene() {
  const size = 70;
  const faces = [
    {
      bg: 'rgba(59,130,246,0.7)',
      transform: `translateZ(${size / 2}px)`,
      w: size,
      h: size,
    },
    {
      bg: 'rgba(59,130,246,0.4)',
      transform: `rotateY(180deg) translateZ(${size / 2}px)`,
      w: size,
      h: size,
    },
    {
      bg: 'rgba(59,130,246,0.5)',
      transform: `rotateY(90deg) translateZ(${size / 2}px)`,
      w: size,
      h: size,
    },
    {
      bg: 'rgba(59,130,246,0.3)',
      transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
      w: size,
      h: size,
    },
    {
      bg: 'rgba(99,102,241,0.6)',
      transform: `rotateX(90deg) translateZ(${size / 2}px)`,
      w: size,
      h: size,
    },
    {
      bg: 'rgba(99,102,241,0.35)',
      transform: `rotateX(-90deg) translateZ(${size / 2}px)`,
      w: size,
      h: size,
    },
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
          width: size,
          height: size,
          position: 'relative',
          transformStyle: 'preserve-3d',
          animation: 'scl-cubeRotate 8s linear infinite',
          boxShadow: 'none',
        }}
      >
        {faces.map((f, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              background: f.bg,
              transform: f.transform,
              border: '1px solid rgba(99,130,246,0.4)',
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
    { cx: 200, cy: 80 },
    { cx: 160, cy: 140 },
    { cx: 80, cy: 120 },
    { cx: 240, cy: 50 },
    { cx: 280, cy: 120 },
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
        viewBox="0 0 320 200"
        width="260"
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
            style={{
              animation: `scl-neuralPulse ${1.5 + (i % 3) * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const SCENES = [
  {
    id: 'orb',
    label: 'Cosmic Orb',
    desc: '3D gradient sphere',
    chip: 'Spline',
    chipColor: '#60a5fa',
    Component: () => <OrbScene hue1="220" hue2="260" />,
  },
  {
    id: 'neural',
    label: 'Neural Network',
    desc: 'Connected graph mesh',
    chip: 'WebGL',
    chipColor: '#22d3ee',
    Component: NeuralScene,
  },
  {
    id: 'liquid',
    label: 'Liquid Metal',
    desc: 'Morphing CSS blob',
    chip: 'CSS',
    chipColor: '#818cf8',
    Component: LiquidScene,
  },
  {
    id: 'grid',
    label: 'Digital Grid',
    desc: '3D perspective mesh',
    chip: 'WebGL',
    chipColor: '#22d3ee',
    Component: GridScene,
  },
  {
    id: 'particle',
    label: 'Particle Storm',
    desc: 'Animated particles',
    chip: 'Canvas',
    chipColor: '#c084fc',
    Component: ParticleScene,
  },
  {
    id: 'geo',
    label: 'Geo Flow',
    desc: 'Rotating 3D cube',
    chip: 'Three.js',
    chipColor: '#60a5fa',
    Component: GeoScene,
  },
];

interface Props {
  columns?: 1 | 2 | 3;
  cardHeight?: number;
  style?: React.CSSProperties;
}

export default function SplineGallery({
  columns = 3,
  cardHeight = 280,
  style,
}: Props) {
  useEffect(() => {
    injectCSS('scl-gallery-css', CSS);
  }, []);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        width: '100%',
        background: '#070710',
        padding: '96px 80px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', -apple-system, sans-serif",
        ...style,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: '#60a5fa',
            marginBottom: 12,
            textTransform: 'uppercase',
          }}
        >
          ● SPLINE GALLERY
        </p>
        <h2
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#f8fafc',
            margin: '0 0 16px',
          }}
        >
          Interactive 3D Scenes
        </h2>
        <p
          style={{
            fontSize: 16,
            color: 'rgba(248,250,252,0.5)',
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          Drop any Spline scene URL into these cards for live 3D embeds
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 20,
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        {SCENES.map(scene => {
          const isHov = hovered === scene.id;
          const SC = scene.Component;
          return (
            <div
              key={scene.id}
              onMouseEnter={() => setHovered(scene.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                transform: isHov
                  ? 'translateY(-6px) scale(1.01)'
                  : 'translateY(0) scale(1)',
                boxShadow: isHov
                  ? '0 30px 80px rgba(0,0,0,0.4), 0 0 40px rgba(59,130,246,0.15)'
                  : '0 8px 32px rgba(0,0,0,0.2)',
                cursor: 'pointer',
              }}
            >
              {/* Scene area */}
              <div style={{ height: cardHeight, position: 'relative' }}>
                <SC />
                {/* Hover overlay */}
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
                    transition: 'opacity 0.3s',
                  }}
                >
                  <button
                    style={{
                      padding: '10px 24px',
                      borderRadius: 9999,
                      background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
                      color: 'white',
                      fontSize: 13,
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
                      fontFamily: 'inherit',
                    }}
                  >
                    Open Scene ↗
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: '14px 20px',
                  background: 'rgba(7,7,16,0.7)',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
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
                      color: '#f8fafc',
                      margin: '0 0 2px',
                    }}
                  >
                    {scene.label}
                  </p>
                  <p
                    style={{
                      fontSize: 11,
                      color: 'rgba(248,250,252,0.38)',
                      margin: 0,
                    }}
                  >
                    {scene.desc}
                  </p>
                </div>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: 9999,
                    background: `${scene.chipColor}22`,
                    border: `1px solid ${scene.chipColor}44`,
                    fontSize: 10,
                    fontWeight: 600,
                    color: scene.chipColor,
                  }}
                >
                  {scene.chip}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

addPropertyControls(SplineGallery, {
  columns: {
    type: ControlType.Enum,
    title: 'Columns',
    defaultValue: 3,
    options: [1, 2, 3],
    optionTitles: ['1 Col', '2 Cols', '3 Cols'],
  },
  cardHeight: {
    type: ControlType.Number,
    title: 'Card Height',
    defaultValue: 280,
    min: 160,
    max: 480,
    step: 20,
  },
});
