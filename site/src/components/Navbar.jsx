import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NAV_ITEMS = ['Hero', '2D Motion', '3D Scene', 'Components'];

export default function Navbar({ activeSection, onNav }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25, delay: 0.2 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,16,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? '1px solid #ffffff0c'
          : '1px solid transparent',
        transition: 'background 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      {/* Logo */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
        }}
        onClick={() => onNav('Hero')}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 900,
            color: '#fff',
          }}
        >
          R
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: '#e2e8f0',
            letterSpacing: '-0.02em',
          }}
        >
          React 2D+3D
        </span>
      </motion.div>

      {/* Nav links */}
      <div style={{ display: 'flex', gap: 4 }}>
        {NAV_ITEMS.map(item => (
          <motion.button
            key={item}
            onClick={() => onNav(item)}
            whileHover={{ color: '#ffffff' }}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: 'none',
              background: activeSection === item ? '#7c3aed22' : 'transparent',
              color: activeSection === item ? '#a78bfa' : '#94a3b8',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              outline: activeSection === item ? '1px solid #7c3aed40' : 'none',
            }}
          >
            {item}
          </motion.button>
        ))}
      </div>

      {/* Badge */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{
          padding: '5px 12px',
          borderRadius: 20,
          border: '1px solid #7c3aed50',
          background: '#7c3aed18',
          color: '#a78bfa',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.05em',
        }}
      >
        LIVE DEMO
      </motion.div>
    </motion.nav>
  );
}
