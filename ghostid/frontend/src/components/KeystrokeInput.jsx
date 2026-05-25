import React, { useRef, useState } from 'react';

export default function KeystrokeInput({ keystrokeCount, hasEnoughData, onScore, isScoring, recentKeys }) {
  const inputRef = useRef(null);
  const [focused, setFocused] = useState(false);

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.3px' }}>Keystroke Capture</div>
          <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            Type freely — GhostID watches the rhythm, not the content
          </div>
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '1.1rem',
          fontWeight: 700,
          color: hasEnoughData ? '#00ff88' : 'var(--text-muted)',
          transition: 'color 0.3s',
        }}>
          {keystrokeCount} <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400 }}>keystrokes</span>
        </div>
      </div>

      {/* Input area */}
      <div
        onClick={() => inputRef.current?.focus()}
        style={{
          position: 'relative',
          background: 'var(--bg-deep)',
          border: `1px solid ${focused ? 'rgba(0,229,255,0.3)' : 'var(--border-subtle)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          cursor: 'text',
          transition: 'border-color 0.2s',
          minHeight: '80px',
        }}
      >
        <textarea
          ref={inputRef}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Start typing anything — a phrase, a sentence, random keys..."
          style={{
            width: '100%',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.88rem',
            lineHeight: 1.6,
            resize: 'none',
            minHeight: '60px',
          }}
          rows={3}
        />
        {focused && (
          <div style={{
            position: 'absolute', bottom: '8px', right: '12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'rgba(0,229,255,0.5)',
            letterSpacing: '0.1em',
          }}>CAPTURING</div>
        )}
      </div>

      {/* Recent keys */}
      {recentKeys.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {recentKeys.map((key, i) => (
            <div key={i} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              padding: '2px 8px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-dim)',
              borderRadius: '4px',
              color: i === 0 ? 'var(--cyan)' : 'var(--text-muted)',
              opacity: 1 - i * 0.1,
              transition: 'all 0.2s',
            }}>
              {key === ' ' ? 'SPC' : key.length > 1 ? key.toUpperCase() : key}
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {hasEnoughData ? 'Ready to score' : `${10 - Math.min(keystrokeCount, 10)} more keystrokes needed`}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {Math.min(keystrokeCount, 10)}/10
          </span>
        </div>
        <div style={{
          height: '3px',
          background: 'var(--bg-elevated)',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min((keystrokeCount / 10) * 100, 100)}%`,
            background: hasEnoughData
              ? 'linear-gradient(90deg, #00ff88, #00e5ff)'
              : 'linear-gradient(90deg, #00e5ff, #818cf8)',
            borderRadius: '2px',
            transition: 'width 0.3s ease, background 0.4s',
          }} />
        </div>
      </div>

      {/* Score button */}
      <button
        onClick={onScore}
        disabled={!hasEnoughData || isScoring}
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: '0.88rem',
          letterSpacing: '0.05em',
          padding: '0.75rem',
          borderRadius: 'var(--radius-md)',
          border: hasEnoughData && !isScoring
            ? '1px solid rgba(0,229,255,0.4)'
            : '1px solid var(--border-subtle)',
          background: hasEnoughData && !isScoring
            ? 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,229,255,0.05))'
            : 'transparent',
          color: hasEnoughData && !isScoring ? 'var(--cyan)' : 'var(--text-muted)',
          cursor: hasEnoughData && !isScoring ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          width: '100%',
        }}
      >
        {isScoring ? 'Analyzing behavioral fingerprint...' : 'Score Session Now'}
      </button>
    </div>
  );
}
