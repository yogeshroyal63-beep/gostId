import React, { useEffect, useState } from 'react';

const messages = {
  SOFT_NUDGE: {
    title: 'Anomaly Detected',
    body: 'Behavioral fingerprint diverging. Please confirm your identity.',
    action: 'Tap to confirm presence',
    color: '#ffb800',
  },
  TYPING_CHALLENGE: {
    title: 'Identity Challenge Required',
    body: 'Significant behavioral mismatch. Type the following phrase to continue.',
    action: 'The quick brown fox jumps over the lazy dog',
    color: '#ff6b2b',
  },
  HARD_STOP: {
    title: 'Session Terminated',
    body: 'Identity breach detected. This session has been flagged and terminated.',
    action: 'Re-authenticate to continue',
    color: '#ff2d55',
  },
};

export default function AlertBanner({ tier, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const msg = messages[tier];

  useEffect(() => {
    if (msg) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 6000);
      return () => clearTimeout(t);
    }
  }, [tier, msg]);

  if (!msg || !visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '72px',
      right: '1.5rem',
      zIndex: 200,
      maxWidth: '360px',
      background: 'var(--bg-elevated)',
      border: `1px solid ${msg.color}55`,
      borderLeft: `3px solid ${msg.color}`,
      borderRadius: 'var(--radius-md)',
      padding: '1rem 1.25rem',
      boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${msg.color}22`,
      animation: 'fade-in-up 0.3s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.88rem',
          color: msg.color,
          marginBottom: '0.4rem',
        }}>{msg.title}</div>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1,
            padding: '0 0 0 1rem',
          }}
        >×</button>
      </div>
      <div style={{
        fontSize: '0.78rem',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-display)',
        marginBottom: '0.75rem',
        lineHeight: 1.5,
      }}>{msg.body}</div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        color: msg.color,
        background: `${msg.color}11`,
        padding: '0.5rem 0.75rem',
        borderRadius: '6px',
        border: `1px solid ${msg.color}22`,
      }}>{msg.action}</div>
    </div>
  );
}
