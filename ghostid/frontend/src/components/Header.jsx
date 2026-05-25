import React, { useState, useEffect } from 'react';

export default function Header({ sessionActive }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      height: '60px',
      background: 'rgba(6, 13, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
        <div style={{
          width: '30px', height: '30px',
          background: 'linear-gradient(135deg, #00e5ff22, #00e5ff44)',
          border: '1px solid rgba(0,229,255,0.3)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px',
        }}>👻</div>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: '1.05rem',
          letterSpacing: '-0.5px',
          color: 'var(--text-primary)',
        }}>GhostID</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--text-muted)',
          background: 'var(--bg-elevated)',
          padding: '2px 6px',
          borderRadius: '4px',
          border: '1px solid var(--border-subtle)',
          letterSpacing: '0.05em',
        }}>v1.0</span>
      </div>

      {/* Center nav */}
      <div style={{
        display: 'flex', gap: '0.25rem',
        background: 'var(--bg-surface)',
        padding: '4px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
      }}>
        {['Dashboard', 'Sessions', 'Research'].map((item, i) => (
          <button key={item} style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.78rem',
            fontWeight: 600,
            padding: '0.3rem 0.875rem',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            background: i === 0 ? 'var(--bg-elevated)' : 'transparent',
            color: i === 0 ? 'var(--text-primary)' : 'var(--text-muted)',
            transition: 'all 0.2s',
          }}>{item}</button>
        ))}
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: 'var(--text-muted)',
        }}>{time.toLocaleTimeString()}</span>

        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: sessionActive ? 'rgba(0,255,136,0.08)' : 'rgba(255,255,255,0.04)',
          padding: '5px 12px',
          borderRadius: '999px',
          border: `1px solid ${sessionActive ? 'rgba(0,255,136,0.25)' : 'var(--border-subtle)'}`,
        }}>
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: sessionActive ? '#00ff88' : 'var(--text-muted)',
            animation: sessionActive ? 'pulse-dot 2s infinite' : 'none',
          }} />
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: sessionActive ? '#00ff88' : 'var(--text-muted)',
            letterSpacing: '0.05em',
          }}>{sessionActive ? 'LIVE' : 'IDLE'}</span>
        </div>
      </div>
    </header>
  );
}
