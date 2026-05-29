import { addPropertyControls, ControlType } from 'framer';
import { useState, useRef, useEffect } from 'react';

interface Props {
  src?: string;
  title?: string;
  embedType?: 'spline' | 'codepen' | 'figma' | 'penpot' | 'custom';
  height?: number;
  cornerRadius?: number;
  showChrome?: boolean;
  lazyLoad?: boolean;
  style?: React.CSSProperties;
}

const EMBED_TYPE_META = {
  spline: { label: 'Spline 3D', color: '#60a5fa', icon: '◉' },
  codepen: { label: 'CodePen', color: '#f6f5f4', icon: '⌨' },
  figma: { label: 'Figma', color: '#c084fc', icon: '◈' },
  penpot: { label: 'Penpot', color: '#22d3ee', icon: '◇' },
  custom: { label: 'Embed', color: '#818cf8', icon: '⬡' },
};

const PLACEHOLDER_LABELS = {
  spline: "Drop your Spline URL in the 'src' prop",
  codepen: "Drop your CodePen embed URL in the 'src' prop",
  figma: "Drop your Figma share URL in the 'src' prop",
  penpot: "Drop your Penpot share URL in the 'src' prop",
  custom: "Drop your embed URL in the 'src' prop",
};

export default function EmbedFrame({
  src,
  title = 'Embed',
  embedType = 'custom',
  height = 400,
  cornerRadius = 16,
  showChrome = true,
  lazyLoad = true,
  style,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazyLoad || !!src);
  const containerRef = useRef<HTMLDivElement>(null);
  const meta = EMBED_TYPE_META[embedType];

  useEffect(() => {
    if (!lazyLoad || !src) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [lazyLoad, src]);

  return (
    <div
      ref={containerRef}
      style={{
        borderRadius: cornerRadius,
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        fontFamily: "'Inter', -apple-system, sans-serif",
        ...style,
      }}
    >
      {/* Chrome bar */}
      {showChrome && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            background: 'rgba(7,7,16,0.6)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
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
          <div
            style={{
              flex: 1,
              margin: '0 16px',
              padding: '4px 12px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: 11,
              color: 'rgba(248,250,252,0.3)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {src || `${embedType}.example.com/…`}
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 10px',
              borderRadius: 9999,
              background: `${meta.color}22`,
              border: `1px solid ${meta.color}44`,
              fontSize: 10,
              fontWeight: 600,
              color: meta.color,
            }}
          >
            {meta.icon} {meta.label}
          </span>
        </div>
      )}

      {/* Embed area */}
      <div style={{ position: 'relative', height }}>
        {src && shouldLoad ? (
          <>
            {!loaded && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#070710',
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: '2px solid rgba(255,255,255,0.1)',
                    borderTopColor: meta.color,
                    animation: 'spin 0.8s linear infinite',
                  }}
                />
                <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
              </div>
            )}
            <iframe
              src={src}
              title={title}
              onLoad={() => setLoaded(true)}
              allow="autoplay; fullscreen; vr"
              allowFullScreen
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.4s',
                display: 'block',
              }}
            />
          </>
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              background: `radial-gradient(ellipse at 50% 50%, ${meta.color}12, transparent 70%)`,
            }}
          >
            <div style={{ fontSize: 40, opacity: 0.3 }}>{meta.icon}</div>
            <span
              style={{
                padding: '4px 14px',
                borderRadius: 9999,
                background: `${meta.color}18`,
                border: `1px solid ${meta.color}30`,
                fontSize: 12,
                fontWeight: 600,
                color: meta.color,
              }}
            >
              {meta.label}
            </span>
            <p
              style={{
                fontSize: 12,
                color: 'rgba(248,250,252,0.28)',
                textAlign: 'center',
                maxWidth: 260,
                lineHeight: 1.6,
              }}
            >
              {PLACEHOLDER_LABELS[embedType]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

addPropertyControls(EmbedFrame, {
  src: {
    type: ControlType.String,
    title: 'Embed URL',
    defaultValue: '',
    description: 'The URL to embed (Spline, CodePen, Figma, etc.)',
  },
  title: { type: ControlType.String, title: 'Title', defaultValue: 'Embed' },
  embedType: {
    type: ControlType.Enum,
    title: 'Type',
    defaultValue: 'custom',
    options: ['spline', 'codepen', 'figma', 'penpot', 'custom'],
    optionTitles: ['Spline 3D', 'CodePen', 'Figma', 'Penpot', 'Custom'],
  },
  height: {
    type: ControlType.Number,
    title: 'Height',
    defaultValue: 400,
    min: 160,
    max: 800,
    step: 20,
  },
  cornerRadius: {
    type: ControlType.Number,
    title: 'Radius',
    defaultValue: 16,
    min: 0,
    max: 32,
    step: 2,
  },
  showChrome: {
    type: ControlType.Boolean,
    title: 'Show Chrome',
    defaultValue: true,
  },
  lazyLoad: {
    type: ControlType.Boolean,
    title: 'Lazy Load',
    defaultValue: true,
  },
});
