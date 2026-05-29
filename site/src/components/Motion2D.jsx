import { useState, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';

const COLORS = [
  '#7c3aed',
  '#2563eb',
  '#db2777',
  '#059669',
  '#d97706',
  '#06b6d4',
];

function MagneticCard({ children, style }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-80, 80], [10, -10]);
  const rotateY = useTransform(x, [-80, 80], [-10, 10]);
  const springX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMove = e => {
    const rect = ref.current.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 800,
        ...style,
      }}
      whileHover={{ scale: 1.04 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}

function DraggableBall({ color, label }) {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <motion.div
        drag
        dragElastic={0.15}
        dragMomentum={true}
        whileDrag={{ scale: 1.2, zIndex: 10 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        animate={{
          boxShadow: isDragging
            ? `0 20px 60px ${color}80`
            : `0 4px 20px ${color}40`,
        }}
        style={{
          width: 70,
          height: 70,
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${color}ff, ${color}88)`,
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 11,
          fontWeight: 600,
          userSelect: 'none',
        }}
      />
      <span style={{ color: '#888', fontSize: 11 }}>{label}</span>
    </div>
  );
}

function SpringButton({ color, label }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08, boxShadow: `0 8px 30px ${color}60` }}
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      style={{
        padding: '12px 28px',
        borderRadius: 12,
        border: `1.5px solid ${color}60`,
        background: `${color}18`,
        color: '#fff',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        letterSpacing: '0.02em',
      }}
    >
      {label}
    </motion.button>
  );
}

function StaggerList() {
  const items = [
    'Framer Motion',
    'Spring Physics',
    'Gesture Detection',
    'Layout Animation',
    'Exit Animations',
  ];
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <motion.button
        onClick={() => setVisible(v => !v)}
        whileTap={{ scale: 0.95 }}
        style={{
          marginBottom: 16,
          padding: '8px 20px',
          borderRadius: 8,
          border: '1.5px solid #7c3aed60',
          background: '#7c3aed18',
          color: '#a78bfa',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {visible ? 'Hide' : 'Show'} List
      </motion.button>
      <AnimatePresence>
        {visible && (
          <motion.ul
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
              hidden: {},
            }}
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {items.map(item => (
              <motion.li
                key={item}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: { type: 'spring', stiffness: 300, damping: 24 },
                  },
                }}
                style={{
                  padding: '10px 16px',
                  borderRadius: 8,
                  background: '#ffffff08',
                  border: '1px solid #ffffff10',
                  fontSize: 13,
                  color: '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#7c3aed',
                    display: 'inline-block',
                  }}
                />
                {item}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProgressRing({ value, color, label }) {
  const circumference = 2 * Math.PI * 36;
  return (
    <motion.div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <svg width={90} height={90} viewBox="0 0 90 90">
        <circle
          cx={45}
          cy={45}
          r={36}
          fill="none"
          stroke="#ffffff10"
          strokeWidth={6}
        />
        <motion.circle
          cx={45}
          cy={45}
          r={36}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: circumference * (1 - value / 100) }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
          style={{ rotate: -90, transformOrigin: '45px 45px' }}
        />
        <text
          x={45}
          y={50}
          textAnchor="middle"
          fill="#ffffff"
          fontSize={14}
          fontWeight={700}
        >
          {value}%
        </text>
      </svg>
      <span style={{ color: '#94a3b8', fontSize: 12 }}>{label}</span>
    </motion.div>
  );
}

export default function Motion2D() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      {/* Draggable balls */}
      <div>
        <h3
          style={{
            color: '#94a3b8',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Drag &amp; Physics
        </h3>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          {COLORS.map((c, i) => (
            <DraggableBall key={c} color={c} label={`Drag me`} />
          ))}
        </div>
      </div>

      {/* 3D tilt cards */}
      <div>
        <h3
          style={{
            color: '#94a3b8',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          3D Magnetic Tilt
        </h3>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {[
            { color: '#7c3aed', label: 'Motion', icon: '⚡' },
            { color: '#2563eb', label: 'Physics', icon: '🌀' },
            { color: '#db2777', label: 'Gestures', icon: '✨' },
          ].map(({ color, label, icon }) => (
            <MagneticCard key={label}>
              <div
                style={{
                  width: 160,
                  height: 110,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${color}22, ${color}08)`,
                  border: `1.5px solid ${color}40`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  cursor: 'default',
                }}
              >
                <span style={{ fontSize: 28 }}>{icon}</span>
                <span
                  style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 14 }}
                >
                  {label}
                </span>
              </div>
            </MagneticCard>
          ))}
        </div>
      </div>

      {/* Spring buttons */}
      <div>
        <h3
          style={{
            color: '#94a3b8',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Spring Interactions
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <SpringButton color="#7c3aed" label="Primary Action" />
          <SpringButton color="#2563eb" label="Secondary" />
          <SpringButton color="#db2777" label="Destructive" />
          <SpringButton color="#059669" label="Success" />
        </div>
      </div>

      {/* Stagger list */}
      <div>
        <h3
          style={{
            color: '#94a3b8',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Stagger Animations
        </h3>
        <StaggerList />
      </div>

      {/* Progress rings */}
      <div>
        <h3
          style={{
            color: '#94a3b8',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 24,
          }}
        >
          Animated Metrics
        </h3>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <ProgressRing value={87} color="#7c3aed" label="Performance" />
          <ProgressRing value={64} color="#2563eb" label="Coverage" />
          <ProgressRing value={92} color="#059669" label="Uptime" />
          <ProgressRing value={45} color="#db2777" label="Load" />
        </div>
      </div>
    </div>
  );
}
