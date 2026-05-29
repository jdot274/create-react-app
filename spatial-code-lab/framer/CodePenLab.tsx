/**
 * CodePen Lab — Framer Code Component
 *
 * Paste in Framer → Assets → Code → New Code File
 *
 * Features:
 * - 4-card grid with browser chrome headers
 * - Drop real CodePen embed URLs in the 'pens' prop
 * - CSS-animated placeholder demos when no URL provided
 * - Glassmorphism cards with hover lift
 * - Lazy-loading iframes
 */
import { addPropertyControls, ControlType } from 'framer';
import { useEffect, useRef, useState } from 'react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
@keyframes scl-neonPulse {
  0%,100% { text-shadow: 0 0 8px #22d3ee, 0 0 20px #22d3ee, 0 0 40px #22d3ee; }
  50%      { text-shadow: 0 0 4px #22d3ee, 0 0 10px #22d3ee; }
}
@keyframes scl-dotPulse {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.35; transform: scale(0.65); }
}
@keyframes scl-morphBlob {
  0%,100% { border-radius: 60% 40% 30% 70%/60% 30% 70% 40%; }
  25%     { border-radius: 30% 60% 70% 40%/50% 60% 30% 60%; }
  50%     { border-radius: 50% 60% 40% 50%/30% 60% 70% 50%; }
  75%     { border-radius: 40% 50% 60% 30%/70% 40% 50% 60%; }
}
@keyframes scl-flip {
  0%      { transform: rotateY(20deg);  }
  45%     { transform: rotateY(20deg);  }
  55%     { transform: rotateY(200deg); }
  100%    { transform: rotateY(200deg); }
}
@keyframes scl-codeScroll {
  0%   { transform: translateY(0);    }
  100% { transform: translateY(-50%); }
}
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
  glass: 'rgba(255,255,255,0.04)',
  border: 'rgba(255,255,255,0.08)',
  borderH: 'rgba(255,255,255,0.16)',
  blue4: '#60a5fa',
  blue5: '#3b82f6',
  ind4: '#818cf8',
  ind5: '#6366f1',
  cyan4: '#22d3ee',
  purp4: '#c084fc',
  text: '#f8fafc',
  textM: 'rgba(248,250,252,0.55)',
  textD: 'rgba(248,250,252,0.28)',
};

// ── CSS-animated placeholder demos ──────────────────────────
function GlassMorphDemo() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, rgba(59,130,246,0.07), rgba(99,102,241,0.07))`,
      }}
    >
      <div
        style={{
          width: 200,
          height: 120,
          borderRadius: 20,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.14)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          boxShadow:
            '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${T.blue5}, ${T.ind5})`,
            opacity: 0.65,
          }}
        />
        <span style={{ fontSize: 11, color: T.textD, letterSpacing: '0.08em' }}>
          backdrop-filter: blur(20px)
        </span>
      </div>
    </div>
  );
}

function CardFlipDemo() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.10), transparent 70%)`,
        perspective: '600px',
      }}
    >
      <div
        style={{
          width: 160,
          height: 100,
          transformStyle: 'preserve-3d',
          animation: 'scl-flip 4s ease-in-out infinite',
          position: 'relative',
        }}
      >
        {/* Front */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, rgba(99,102,241,0.75), rgba(59,130,246,0.75))`,
            borderRadius: 14,
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}
        >
          ◈
        </div>
        {/* Back */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, rgba(6,182,212,0.75), rgba(99,102,241,0.75))`,
            borderRadius: 14,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}
        >
          ◉
        </div>
      </div>
    </div>
  );
}

function NeonTextDemo() {
  return (
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
          fontFamily: "'Inter', sans-serif",
          fontSize: 36,
          fontWeight: 900,
          letterSpacing: '-.02em',
          color: T.cyan4,
          animation: 'scl-neonPulse 2.2s ease-in-out infinite',
        }}
      >
        SPATIAL
      </span>
    </div>
  );
}

function LoaderDemo() {
  const dots = [T.blue4, T.ind4, T.cyan4, T.purp4];
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background: T.bg,
      }}
    >
      {dots.map((color, i) => (
        <div
          key={i}
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 12px ${color}`,
            animation: `scl-dotPulse 1.3s ease-in-out infinite`,
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

const DEMO_RENDERERS = [GlassMorphDemo, CardFlipDemo, NeonTextDemo, LoaderDemo];

const DEFAULT_LABELS = [
  { title: 'Glass Morphism', tag: 'CSS', tagColor: T.blue4 },
  { title: '3D Card Flip', tag: 'CSS', tagColor: T.ind4 },
  { title: 'Neon Text FX', tag: 'CSS', tagColor: T.cyan4 },
  { title: 'CSS Loader', tag: 'CSS', tagColor: T.purp4 },
];

// ── Lazy iframe with loading state ───────────────────────────
function LazyIframe({ src, height }: { src: string; height: number }) {
  const [loaded, setLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setReady(true);
          obs.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', height, background: T.bg }}>
      {!loaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: T.bg,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: `2px solid rgba(255,255,255,0.08)`,
              borderTopColor: T.blue4,
              animation: 'spin 0.7s linear infinite',
            }}
          />
          <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
      {ready && (
        <iframe
          src={src}
          allow="autoplay; fullscreen"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.4s ease',
            display: 'block',
          }}
        />
      )}
    </div>
  );
}

// ── Single card ───────────────────────────────────────────────
function PenCard({
  src,
  title,
  tag,
  tagColor,
  DemoComponent,
  penHeight,
  cornerRadius,
  hovered,
  onHover,
}: {
  src?: string;
  title: string;
  tag: string;
  tagColor: string;
  DemoComponent: () => JSX.Element;
  penHeight: number;
  cornerRadius: number;
  hovered: boolean;
  onHover: (v: boolean) => void;
}) {
  return (
    <div
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{
        borderRadius: cornerRadius,
        overflow: 'hidden',
        background: T.glass,
        border: `1px solid ${hovered ? T.borderH : T.border}`,
        backdropFilter: 'blur(20px)',
        boxShadow: hovered
          ? '0 30px 80px rgba(0,0,0,0.4), 0 0 40px rgba(99,102,241,0.12)'
          : '0 8px 32px rgba(0,0,0,0.18)',
        transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          background: 'rgba(7,7,16,0.65)',
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
        <span style={{ fontSize: 12, fontWeight: 600, color: T.textM }}>
          {title}
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 10px',
            borderRadius: 9999,
            background: `${tagColor}22`,
            border: `1px solid ${tagColor}44`,
            fontSize: 10,
            fontWeight: 600,
            color: tagColor,
          }}
        >
          {tag}
        </span>
      </div>

      {/* Content */}
      <div style={{ height: penHeight }}>
        {src ? <LazyIframe src={src} height={penHeight} /> : <DemoComponent />}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
interface PenConfig {
  title: string;
  src?: string;
  tag?: string;
}

interface Props {
  headline?: string;
  label?: string;
  description?: string;
  pen1?: PenConfig;
  pen2?: PenConfig;
  pen3?: PenConfig;
  pen4?: PenConfig;
  penHeight?: number;
  cornerRadius?: number;
  columns?: 1 | 2;
  style?: React.CSSProperties;
}

export default function CodePenLab({
  headline = 'Code Experiments',
  label = '● CodePen Lab',
  description = "Live CSS demos — swap in any CodePen embed URL via the 'src' prop",
  pen1,
  pen2,
  pen3,
  pen4,
  penHeight = 280,
  cornerRadius = 20,
  columns = 2,
  style,
}: Props) {
  useEffect(() => {
    injectCSS('scl-codepen-css', CSS);
  }, []);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const pens = [pen1, pen2, pen3, pen4];
  const cards = DEMO_LABELS.map((def, i) => ({
    title: pens[i]?.title ?? def.title,
    src: pens[i]?.src,
    tag: pens[i]?.tag ?? def.tag,
    tagColor: def.tagColor,
    Demo: DEMO_RENDERERS[i],
  }));

  return (
    <div
      style={{
        width: '100%',
        padding: '96px 0',
        boxSizing: 'border-box',
        fontFamily: "'Inter', -apple-system, sans-serif",
        background: 'transparent',
        ...style,
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 56 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: T.blue4,
            marginBottom: 12,
          }}
        >
          {label}
        </p>
        <h2
          style={{
            fontSize: 'clamp(2rem,5vw,3.25rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: T.text,
            margin: '0 0 16px',
          }}
        >
          {headline}
        </h2>
        <p
          style={{
            fontSize: 16,
            color: T.textM,
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          {description}
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 20,
        }}
      >
        {cards.map((card, i) => (
          <PenCard
            key={i}
            src={card.src}
            title={card.title}
            tag={card.tag}
            tagColor={card.tagColor}
            DemoComponent={card.Demo}
            penHeight={penHeight}
            cornerRadius={cornerRadius}
            hovered={hoveredIdx === i}
            onHover={v => setHoveredIdx(v ? i : null)}
          />
        ))}
      </div>

      {/* How-to hint */}
      <div
        style={{
          marginTop: 32,
          padding: '14px 20px',
          borderRadius: 12,
          background: 'rgba(59,130,246,0.06)',
          border: '1px solid rgba(59,130,246,0.15)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
        <p style={{ fontSize: 12, color: T.textM, lineHeight: 1.6, margin: 0 }}>
          <strong style={{ color: T.blue4 }}>
            Adding real CodePen embeds:
          </strong>{' '}
          Copy the CodePen embed URL (e.g.{' '}
          <code
            style={{
              background: 'rgba(255,255,255,0.08)',
              padding: '1px 6px',
              borderRadius: 4,
              fontSize: 11,
            }}
          >
            codepen.io/user/embed/abc123/?default-tab=result&theme-id=dark
          </code>
          ) and paste it into the{' '}
          <code
            style={{
              background: 'rgba(255,255,255,0.08)',
              padding: '1px 6px',
              borderRadius: 4,
              fontSize: 11,
            }}
          >
            pen1.src
          </code>{' '}
          property in the Framer panel.
        </p>
      </div>
    </div>
  );
}

const DEMO_LABELS = DEFAULT_LABELS;

addPropertyControls(CodePenLab, {
  headline: {
    type: ControlType.String,
    title: 'Headline',
    defaultValue: 'Code Experiments',
  },
  label: {
    type: ControlType.String,
    title: 'Label',
    defaultValue: '● CodePen Lab',
  },
  description: {
    type: ControlType.String,
    title: 'Description',
    defaultValue: 'Live CSS demos — swap in any CodePen embed URL',
  },
  columns: {
    type: ControlType.Enum,
    title: 'Columns',
    defaultValue: 2,
    options: [1, 2],
    optionTitles: ['1 Column', '2 Columns'],
  },
  penHeight: {
    type: ControlType.Number,
    title: 'Pen Height',
    defaultValue: 280,
    min: 160,
    max: 600,
    step: 20,
  },
  cornerRadius: {
    type: ControlType.Number,
    title: 'Radius',
    defaultValue: 20,
    min: 0,
    max: 32,
    step: 2,
  },
  pen1: {
    type: ControlType.Object,
    title: 'Pen 1',
    controls: {
      title: {
        type: ControlType.String,
        title: 'Title',
        defaultValue: 'Glass Morphism',
      },
      src: {
        type: ControlType.String,
        title: 'Embed URL',
        defaultValue: '',
        description: 'CodePen embed URL',
      },
      tag: { type: ControlType.String, title: 'Tag', defaultValue: 'CSS' },
    },
  },
  pen2: {
    type: ControlType.Object,
    title: 'Pen 2',
    controls: {
      title: {
        type: ControlType.String,
        title: 'Title',
        defaultValue: '3D Card Flip',
      },
      src: { type: ControlType.String, title: 'Embed URL', defaultValue: '' },
      tag: { type: ControlType.String, title: 'Tag', defaultValue: 'CSS' },
    },
  },
  pen3: {
    type: ControlType.Object,
    title: 'Pen 3',
    controls: {
      title: {
        type: ControlType.String,
        title: 'Title',
        defaultValue: 'Neon Text FX',
      },
      src: { type: ControlType.String, title: 'Embed URL', defaultValue: '' },
      tag: { type: ControlType.String, title: 'Tag', defaultValue: 'CSS' },
    },
  },
  pen4: {
    type: ControlType.Object,
    title: 'Pen 4',
    controls: {
      title: {
        type: ControlType.String,
        title: 'Title',
        defaultValue: 'CSS Loader',
      },
      src: { type: ControlType.String, title: 'Embed URL', defaultValue: '' },
      tag: { type: ControlType.String, title: 'Tag', defaultValue: 'CSS' },
    },
  },
});
