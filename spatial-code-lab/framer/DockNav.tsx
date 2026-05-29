import { addPropertyControls, ControlType } from 'framer';
import { useState } from 'react';

const KEYFRAMES = `
@keyframes scl-dockIn { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
`;

function injectCSS(id: string, css: string) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id;
  s.textContent = css;
  document.head.appendChild(s);
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const DEFAULT_ITEMS: NavItem[] = [
  { id: 'hero', label: 'Home', icon: '⌂' },
  { id: 'spline', label: 'Spline', icon: '◉' },
  { id: 'codepen', label: 'Code', icon: '⌨' },
  { id: 'penpot', label: 'Design', icon: '◈' },
  { id: 'playground', label: 'Playground', icon: '◇' },
];

interface Props {
  items?: NavItem[];
  activeId?: string;
  position?: 'bottom' | 'top';
  style?: React.CSSProperties;
  onNavigate?: (id: string) => void;
}

export default function DockNav({
  items = DEFAULT_ITEMS,
  activeId,
  position = 'bottom',
  style,
  onNavigate,
}: Props) {
  const [active, setActive] = useState(activeId ?? items[0]?.id);
  const [hovered, setHovered] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const iCSS = () => injectCSS('scl-dock-css', KEYFRAMES);
  iCSS();

  const handleClick = (id: string) => {
    setActive(id);
    onNavigate?.(id);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      style={{
        position: 'fixed',
        [position === 'bottom' ? 'bottom' : 'top']: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        padding: '8px 12px',
        background: 'rgba(7,7,16,0.82)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 9999,
        boxShadow:
          '0 20px 60px rgba(0,0,0,0.55), 0 0 30px rgba(59,130,246,0.08), inset 0 0 0 0.5px rgba(255,255,255,0.04)',
        animation: 'scl-dockIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
        fontFamily: "'Inter', -apple-system, sans-serif",
        ...style,
      }}
    >
      {items.map(item => {
        const isActive = item.id === active;
        const isHovered = item.id === hovered;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              padding: '8px 16px',
              borderRadius: 9999,
              border: 'none',
              background: isActive
                ? 'rgba(59,130,246,0.18)'
                : isHovered
                ? 'rgba(255,255,255,0.07)'
                : 'transparent',
              color: isActive
                ? '#60a5fa'
                : isHovered
                ? '#f8fafc'
                : 'rgba(248,250,252,0.38)',
              fontSize: 11,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
              transform:
                isHovered && !isActive ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: isActive ? '0 0 20px rgba(59,130,246,0.15)' : 'none',
              whiteSpace: 'nowrap',
              fontFamily: 'inherit',
            }}
          >
            <span style={{ fontSize: 14, lineHeight: 1 }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

addPropertyControls(DockNav, {
  position: {
    type: ControlType.Enum,
    title: 'Position',
    defaultValue: 'bottom',
    options: ['bottom', 'top'],
    optionTitles: ['Bottom', 'Top'],
  },
  activeId: {
    type: ControlType.String,
    title: 'Active ID',
    defaultValue: 'hero',
    description: 'ID of the active nav item',
  },
});
