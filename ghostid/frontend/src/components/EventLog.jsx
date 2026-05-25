import React from 'react';

const tierColors = {
  SILENT_PASS: '#00ff88',
  SOFT_NUDGE: '#ffb800',
  TYPING_CHALLENGE: '#ff6b2b',
  HARD_STOP: '#ff2d55',
};

export default function EventLog({ events }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0',
      height: '100%',
    }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.3px' }}>Session Log</div>
        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
          Real-time event stream
        </div>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
      }}>
        {events.length === 0 ? (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '120px', flexDirection: 'column', gap: '6px',
          }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No events yet</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Waiting for session activity...
            </div>
          </div>
        ) : (
          [...events].reverse().map((event, i) => {
            const color = tierColors[event.tier] || 'var(--text-muted)';
            return (
              <div key={event.id} style={{
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                animation: i === 0 ? 'fade-in-up 0.3s ease' : 'none',
              }}>
                <div style={{
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  background: color,
                  marginTop: '5px',
                  flexShrink: 0,
                  boxShadow: `0 0 6px ${color}`,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color,
                    }}>{event.tier}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: 'var(--text-dim)',
                    }}>{event.time}</span>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                  }}>score: <span style={{ color: 'var(--text-secondary)' }}>{event.score}%</span> → {event.action}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
