import React from 'react';

function StatCard({ label, value, unit, accent }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '1rem 1.25rem',
      flex: 1,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: 'var(--text-muted)',
        letterSpacing: '0.1em',
        marginBottom: '0.4rem',
      }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.6rem',
          fontWeight: 700,
          color: accent || 'var(--text-primary)',
          lineHeight: 1,
          letterSpacing: '-1px',
        }}>{value}</span>
        {unit && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
          }}>{unit}</span>
        )}
      </div>
    </div>
  );
}

export default function StatsBar({ scores, totalKeystrokes }) {
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length)
    : '—';
  const bestScore = scores.length > 0 ? Math.max(...scores.map(s => s.score)) : '—';
  const sessions = scores.length;

  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <StatCard label="AVG CONFIDENCE" value={avgScore} unit={avgScore !== '—' ? '%' : ''} accent="#00e5ff" />
      <StatCard label="PEAK SCORE" value={bestScore} unit={bestScore !== '—' ? '%' : ''} accent="#00ff88" />
      <StatCard label="SCORING EVENTS" value={sessions} accent="var(--text-primary)" />
      <StatCard label="TOTAL KEYSTROKES" value={totalKeystrokes} accent="var(--text-primary)" />
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.25rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>MODEL</div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00ff88' }} />
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>LSTM · 94.29%</span>
        </div>
      </div>
    </div>
  );
}
