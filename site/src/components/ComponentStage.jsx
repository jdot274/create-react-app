import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Built-in example components that users can drop in
const EXAMPLE_COMPONENTS = {
  Counter: function Counter() {
    const [count, setCount] = useState(0);
    return (
      <div style={{ textAlign: 'center' }}>
        <motion.div
          key={count}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ fontSize: 56, fontWeight: 900, color: '#a78bfa', lineHeight: 1 }}
        >
          {count}
        </motion.div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20 }}>
          {[{ label: '-', fn: () => setCount(c => c - 1), color: '#db2777' },
            { label: '0', fn: () => setCount(0), color: '#64748b' },
            { label: '+', fn: () => setCount(c => c + 1), color: '#059669' }]
            .map(({ label, fn, color }) => (
              <motion.button
                key={label} onClick={fn}
                whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }}
                style={{ width: 44, height: 44, borderRadius: '50%', border: `2px solid ${color}60`,
                  background: `${color}20`, color: '#fff', fontSize: 20, cursor: 'pointer', fontWeight: 700 }}
              >{label}</motion.button>
            ))}
        </div>
      </div>
    );
  },

  Accordion: function Accordion() {
    const [open, setOpen] = useState(null);
    const items = [
      { id: 0, q: 'What is Framer Motion?', a: 'A production-ready motion library for React, offering spring physics, gestures, and layout animations.' },
      { id: 1, q: 'What is React Three Fiber?', a: 'A React renderer for Three.js — lets you build 3D scenes declaratively with React components.' },
      { id: 2, q: 'Can I drop any React component?', a: 'Yes! This stage renders arbitrary React components. Paste your JSX in the editor and hit render.' },
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
        {items.map(({ id, q, a }) => (
          <div key={id} style={{ borderRadius: 12, border: '1px solid #ffffff14', overflow: 'hidden' }}>
            <motion.button
              onClick={() => setOpen(open === id ? null : id)}
              style={{ width: '100%', padding: '14px 18px', background: '#ffffff08',
                border: 'none', color: '#e2e8f0', fontSize: 14, fontWeight: 600,
                textAlign: 'left', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              whileHover={{ background: '#ffffff12' }}
            >
              {q}
              <motion.span animate={{ rotate: open === id ? 180 : 0 }} style={{ display: 'inline-block', color: '#a78bfa' }}>▾</motion.span>
            </motion.button>
            <AnimatePresence>
              {open === id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ padding: '12px 18px 16px', fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>
                    {a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    );
  },

  ColorPicker: function ColorPicker() {
    const [selected, setSelected] = useState('#7c3aed');
    const colors = ['#7c3aed', '#2563eb', '#db2777', '#059669', '#d97706', '#06b6d4', '#f97316', '#8b5cf6'];
    return (
      <div style={{ textAlign: 'center' }}>
        <motion.div
          animate={{ background: selected, boxShadow: `0 0 60px ${selected}80` }}
          transition={{ duration: 0.4 }}
          style={{ width: 100, height: 100, borderRadius: '50%', margin: '0 auto 24px' }}
        />
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {colors.map(c => (
            <motion.button
              key={c} onClick={() => setSelected(c)}
              whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
              animate={{ outline: selected === c ? `3px solid white` : '3px solid transparent', outlineOffset: 2 }}
              style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: c, cursor: 'pointer' }}
            />
          ))}
        </div>
        <div style={{ marginTop: 16, fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#94a3b8' }}>
          {selected}
        </div>
      </div>
    );
  },

  TodoList: function TodoList() {
    const [items, setItems] = useState(['Build a 3D scene', 'Add Framer Motion', 'Ship it 🚀']);
    const [draft, setDraft] = useState('');
    const add = () => { if (draft.trim()) { setItems(i => [...i, draft.trim()]); setDraft(''); } };
    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            value={draft} onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && add()}
            placeholder="Add item…"
            style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #ffffff20',
              background: '#ffffff08', color: '#fff', fontSize: 13, outline: 'none' }}
          />
          <motion.button onClick={add} whileTap={{ scale: 0.9 }}
            style={{ padding: '10px 18px', borderRadius: 8, background: '#7c3aed',
              border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Add
          </motion.button>
        </div>
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div key={item + i}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                borderRadius: 8, background: '#ffffff08', marginBottom: 8, fontSize: 13, color: '#e2e8f0' }}
            >
              <motion.span whileHover={{ scale: 1.2 }}
                style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid #7c3aed',
                  cursor: 'pointer', flexShrink: 0 }}
                onClick={() => setItems(its => its.filter((_, j) => j !== i))}
              />
              {item}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  },
};

const COMPONENT_NAMES = Object.keys(EXAMPLE_COMPONENTS);

export default function ComponentStage() {
  const [active, setActive] = useState('Counter');
  const ActiveComponent = EXAMPLE_COMPONENTS[active];

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
        {COMPONENT_NAMES.map(name => (
          <motion.button
            key={name}
            onClick={() => setActive(name)}
            whileTap={{ scale: 0.96 }}
            style={{
              padding: '8px 18px', borderRadius: 10,
              border: active === name ? '1.5px solid #7c3aed' : '1.5px solid #ffffff18',
              background: active === name ? '#7c3aed22' : '#ffffff08',
              color: active === name ? '#a78bfa' : '#94a3b8',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {name}
          </motion.button>
        ))}
      </div>

      {/* Stage */}
      <div style={{
        minHeight: 280,
        borderRadius: 20,
        border: '1.5px solid #ffffff12',
        background: 'linear-gradient(135deg, #0f0f1e, #0a0a14)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 36,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(#ffffff06 1px, transparent 1px), linear-gradient(90deg, #ffffff06 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }} />

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'relative' }}
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      <p style={{ marginTop: 14, color: '#475569', fontSize: 12, textAlign: 'center' }}>
        Each tab renders a live React component inside the stage — swap, interact, and extend.
      </p>
    </div>
  );
}
