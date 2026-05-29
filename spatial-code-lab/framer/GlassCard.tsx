import { addPropertyControls, ControlType } from 'framer';

interface Props {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  badge?: string;
  badgeColor?: 'blue' | 'indigo' | 'cyan' | 'purple';
  glow?: boolean;
  glowColor?: string;
  cornerRadius?: number;
  padding?: number;
  height?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
}

const BADGE_COLORS = {
  blue: {
    bg: 'rgba(59,130,246,0.15)',
    border: 'rgba(59,130,246,0.25)',
    text: '#60a5fa',
  },
  indigo: {
    bg: 'rgba(99,102,241,0.15)',
    border: 'rgba(99,102,241,0.25)',
    text: '#818cf8',
  },
  cyan: {
    bg: 'rgba(6,182,212,0.15)',
    border: 'rgba(6,182,212,0.25)',
    text: '#22d3ee',
  },
  purple: {
    bg: 'rgba(192,132,252,0.15)',
    border: 'rgba(192,132,252,0.25)',
    text: '#c084fc',
  },
};

export default function GlassCard({
  children,
  title,
  description,
  badge,
  badgeColor = 'blue',
  glow = false,
  glowColor = 'rgba(59,130,246,0.12)',
  cornerRadius = 20,
  padding = 24,
  height,
  style,
  onClick,
}: Props) {
  const bc = BADGE_COLORS[badgeColor];

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        borderRadius: cornerRadius,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        boxShadow: glow
          ? `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${glowColor}`
          : '0 8px 32px rgba(0,0,0,0.2)',
        padding,
        height: height ?? 'auto',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        fontFamily: "'Inter', -apple-system, sans-serif",
        ...style,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(255,255,255,0.14)';
        el.style.transform = 'translateY(-2px)';
        if (!glow)
          el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.3), 0 0 30px ${glowColor}`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(255,255,255,0.08)';
        el.style.transform = 'translateY(0)';
        if (!glow) el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.2)';
      }}
    >
      {/* Top highlight line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
          borderRadius: `${cornerRadius}px ${cornerRadius}px 0 0`,
          pointerEvents: 'none',
        }}
      />
      {/* Inner gradient sheen */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
          borderRadius: cornerRadius,
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {badge && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 10px',
              marginBottom: 14,
              borderRadius: 9999,
              background: bc.bg,
              border: `1px solid ${bc.border}`,
              fontSize: 11,
              fontWeight: 600,
              color: bc.text,
              letterSpacing: '0.04em',
            }}
          >
            {badge}
          </span>
        )}
        {title && (
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: '#f8fafc',
              margin: '0 0 8px',
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h3>
        )}
        {description && (
          <p
            style={{
              fontSize: 14,
              color: 'rgba(248,250,252,0.55)',
              margin: '0 0 16px',
              lineHeight: 1.65,
            }}
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

addPropertyControls(GlassCard, {
  title: {
    type: ControlType.String,
    title: 'Title',
    defaultValue: 'Glass Card',
  },
  description: {
    type: ControlType.String,
    title: 'Description',
    defaultValue: 'Glassmorphism card with backdrop blur.',
    displayTextArea: true,
  },
  badge: {
    type: ControlType.String,
    title: 'Badge',
    defaultValue: 'Component',
  },
  badgeColor: {
    type: ControlType.Enum,
    title: 'Badge Color',
    defaultValue: 'blue',
    options: ['blue', 'indigo', 'cyan', 'purple'],
    optionTitles: ['Blue', 'Indigo', 'Cyan', 'Purple'],
  },
  glow: { type: ControlType.Boolean, title: 'Glow', defaultValue: false },
  cornerRadius: {
    type: ControlType.Number,
    title: 'Radius',
    defaultValue: 20,
    min: 0,
    max: 48,
    step: 2,
  },
  padding: {
    type: ControlType.Number,
    title: 'Padding',
    defaultValue: 24,
    min: 8,
    max: 64,
    step: 4,
  },
});
