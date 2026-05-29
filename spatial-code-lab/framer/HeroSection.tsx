import { addPropertyControls, ControlType } from 'framer';
import { useEffect, useRef, useState } from 'react';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
@keyframes scl-heroGradient { 0%{opacity:1;transform:scale(1)} 100%{opacity:.7;transform:scale(1.05)} }
@keyframes scl-orbFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(20px,-30px) scale(1.05)} 66%{transform:translate(-15px,20px) scale(.95)} }
@keyframes scl-gradientFlow { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
@keyframes scl-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.75)} }
@keyframes scl-orbRotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
@keyframes scl-fadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
@keyframes scl-particleFloat { 0%,100%{transform:translateY(0) scale(1);opacity:.6} 50%{transform:translateY(-24px) scale(1.2);opacity:1} }
`;

const TOKENS = {
  bgBase: '#070710',
  bgElevated: '#0d0d1a',
  blue400: '#60a5fa',
  blue500: '#3b82f6',
  indigo500: '#6366f1',
  cyan400: '#22d3ee',
  text: '#f8fafc',
  textMuted: 'rgba(248,250,252,0.55)',
  border: 'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.16)',
  glass: 'rgba(255,255,255,0.04)',
};

function injectCSS(id: string, css: string) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = css;
  document.head.appendChild(s);
}

interface Props {
  headline: string;
  subline: string;
  badgeText: string;
  primaryCTA: string;
  secondaryCTA: string;
  showScene: boolean;
  showParticles: boolean;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  style?: React.CSSProperties;
}

export default function HeroSection({
  headline = 'Interactive\nSpatial Canvas',
  subline = 'A premium canvas for Spline 3D scenes, CodePen demos, Figma prototypes, and interactive React components.',
  badgeText = 'INTERACTIVE SPATIAL CANVAS',
  primaryCTA = 'Explore Lab →',
  secondaryCTA = 'View Source ↗',
  showScene = true,
  showParticles = true,
  onPrimaryClick,
  onSecondaryClick,
  style,
}: Props) {
  useEffect(() => {
    injectCSS('scl-hero-css', CSS);
  }, []);

  const particles = [
    { x: '12%', y: '18%', size: 5, delay: '0s', dur: '6s' },
    { x: '85%', y: '12%', size: 4, delay: '1.2s', dur: '8s' },
    { x: '8%', y: '65%', size: 3, delay: '2.4s', dur: '7s' },
    { x: '90%', y: '70%', size: 6, delay: '0.8s', dur: '9s' },
    { x: '45%', y: '8%', size: 4, delay: '3.2s', dur: '6.5s' },
    { x: '72%', y: '85%', size: 3, delay: '1.6s', dur: '8.5s' },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: TOKENS.bgBase,
        fontFamily: "'Inter', -apple-system, sans-serif",
        padding: '64px 24px',
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {/* Background gradient mesh */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `
          radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.15) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 85% 50%, rgba(99,102,241,0.10) 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 15% 75%, rgba(6,182,212,0.07) 0%, transparent 50%)
        `,
          animation: 'scl-heroGradient 12s ease-in-out infinite alternate',
        }}
      />

      {/* Grid lines */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `
          linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)
        `,
          backgroundSize: '60px 60px',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 70%)',
        }}
      />

      {/* Ambient orbs */}
      {[
        {
          size: 400,
          top: -100,
          left: -100,
          color: 'rgba(59,130,246,0.12)',
          delay: '0s',
        },
        {
          size: 300,
          bottom: -60,
          right: -60,
          color: 'rgba(99,102,241,0.10)',
          delay: '-3s',
        },
        {
          size: 200,
          top: '45%',
          right: '12%',
          color: 'rgba(6,182,212,0.07)',
          delay: '-6s',
        },
      ].map((orb, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            width: orb.size,
            height: orb.size,
            background: orb.color,
            filter: 'blur(60px)',
            pointerEvents: 'none',
            top: orb.top as any,
            left: orb.left as any,
            bottom: (orb as any).bottom,
            right: (orb as any).right,
            animation: `scl-orbFloat 8s ease-in-out infinite`,
            animationDelay: orb.delay,
          }}
        />
      ))}

      {/* Particles */}
      {showParticles &&
        particles.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              width: p.size,
              height: p.size,
              left: p.x,
              top: p.y,
              background: TOKENS.blue400,
              boxShadow: `0 0 ${p.size * 2}px ${TOKENS.blue400}`,
              animation: `scl-particleFloat ${p.dur} ease-in-out infinite`,
              animationDelay: p.delay,
              pointerEvents: 'none',
            }}
          />
        ))}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          maxWidth: 900,
          width: '100%',
        }}
      >
        {/* Badge */}
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
            animation: 'scl-fadeInUp 0.8s ease forwards',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: TOKENS.blue400,
              display: 'inline-block',
              animation: 'scl-pulse 2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: TOKENS.blue400,
              letterSpacing: '0.1em',
            }}
          >
            {badgeText}
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            margin: '0 0 24px',
            background:
              'linear-gradient(135deg, #f8fafc 0%, rgba(248,250,252,0.9) 20%, #60a5fa 40%, #818cf8 60%, #22d3ee 80%, #f8fafc 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation:
              'scl-gradientFlow 8s ease infinite, scl-fadeInUp 0.8s ease 0.1s forwards',
            opacity: 0,
            whiteSpace: 'pre-line',
          }}
        >
          {headline}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: TOKENS.textMuted,
            maxWidth: 580,
            margin: '0 auto 40px',
            lineHeight: 1.75,
            animation: 'scl-fadeInUp 0.8s ease 0.2s forwards',
            opacity: 0,
          }}
        >
          {subline}
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'scl-fadeInUp 0.8s ease 0.3s forwards',
            opacity: 0,
          }}
        >
          <button
            onClick={onPrimaryClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 28px',
              borderRadius: 9999,
              border: 'none',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow:
                '0 4px 24px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 8px 32px rgba(59,130,246,0.5), inset 0 1px 0 rgba(255,255,255,0.15)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform =
                'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow =
                '0 4px 24px rgba(59,130,246,0.4), inset 0 1px 0 rgba(255,255,255,0.1)';
            }}
          >
            {primaryCTA}
          </button>

          <button
            onClick={onSecondaryClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '14px 28px',
              borderRadius: 9999,
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(248,250,252,0.7)',
              fontSize: 14,
              fontWeight: 600,
              backdropFilter: 'blur(12px)',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background =
                'rgba(255,255,255,0.10)';
              (e.currentTarget as HTMLElement).style.color = '#f8fafc';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background =
                'rgba(255,255,255,0.06)';
              (e.currentTarget as HTMLElement).style.color =
                'rgba(248,250,252,0.7)';
            }}
          >
            {secondaryCTA}
          </button>
        </div>
      </div>

      {/* 3D Scene frame */}
      {showScene && (
        <div
          style={{
            position: 'relative',
            zIndex: 5,
            width: '100%',
            maxWidth: 900,
            marginTop: 64,
            animation: 'scl-fadeInUp 0.8s ease 0.4s forwards',
            opacity: 0,
          }}
        >
          <div
            style={{
              height: 360,
              borderRadius: 24,
              overflow: 'hidden',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              boxShadow:
                '0 40px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Scene bg */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(59,130,246,0.12) 0%, transparent 70%)',
              }}
            />
            {/* Spline-like orb */}
            <div
              style={{ position: 'relative', textAlign: 'center', zIndex: 1 }}
            >
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: '50%',
                  margin: '0 auto 20px',
                  background:
                    'conic-gradient(from 0deg, #3b82f6, #6366f1, #22d3ee, #3b82f6)',
                  filter: 'blur(1px)',
                  animation: 'scl-orbRotate 8s linear infinite',
                  position: 'relative',
                  boxShadow:
                    '0 0 60px rgba(59,130,246,0.5), 0 0 120px rgba(99,102,241,0.2)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 6,
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
                  fontFamily: "'Inter', sans-serif",
                  letterSpacing: '0.08em',
                }}
              >
                spline-viewer · Drop your Spline scene URL here
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

addPropertyControls(HeroSection, {
  headline: {
    type: ControlType.String,
    title: 'Headline',
    defaultValue: 'Interactive\nSpatial Canvas',
    displayTextArea: true,
  },
  subline: {
    type: ControlType.String,
    title: 'Subtitle',
    defaultValue:
      'A premium canvas for Spline 3D scenes, CodePen demos, and React components.',
    displayTextArea: true,
  },
  badgeText: {
    type: ControlType.String,
    title: 'Badge Text',
    defaultValue: 'INTERACTIVE SPATIAL CANVAS',
  },
  primaryCTA: {
    type: ControlType.String,
    title: 'Primary CTA',
    defaultValue: 'Explore Lab →',
  },
  secondaryCTA: {
    type: ControlType.String,
    title: 'Secondary CTA',
    defaultValue: 'View Source ↗',
  },
  showScene: {
    type: ControlType.Boolean,
    title: 'Show Scene',
    defaultValue: true,
  },
  showParticles: {
    type: ControlType.Boolean,
    title: 'Show Particles',
    defaultValue: true,
  },
});
