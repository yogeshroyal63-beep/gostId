import React, { useEffect, useState } from 'react';

export default function ScoreRing({ score, tier, isScoring }) {
  const [displayScore, setDisplayScore] = useState(score);

  useEffect(() => {
    if (score === null) return;
    const start = displayScore || 0;
    const end = score;
    const duration = 800;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const pct = displayScore !== null ? displayScore / 100 : 0;
  const strokeDashoffset = circumference * (1 - pct);
  const size = 180;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Outer glow ring */}
        <div style={{
          position: 'absolute', inset: -8,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${tier.glowColor} 0%, transparent 70%)`,
          opacity: score !== null ? 1 : 0,
          transition: 'opacity 0.5s',
        }} />

        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="6"
          />
          {/* Tick marks */}
          {Array.from({ length: 20 }).map((_, i) => {
            const angle = (i / 20) * 2 * Math.PI - Math.PI / 2;
            const inner = radius - 10;
            const outer = radius - 4;
            return (
              <line
                key={i}
                x1={size/2 + inner * Math.cos(angle + Math.PI/2)}
                y1={size/2 + inner * Math.sin(angle + Math.PI/2)}
                x2={size/2 + outer * Math.cos(angle + Math.PI/2)}
                y2={size/2 + outer * Math.sin(angle + Math.PI/2)}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            );
          })}
          {/* Progress arc */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={tier.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.4s' }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          {isScoring ? (
            <div style={{
              width: '24px', height: '24px',
              border: `2px solid ${tier.color}`,
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }} />
          ) : (
            <>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: displayScore !== null ? '2.4rem' : '1.5rem',
                fontWeight: 700,
                color: tier.color,
                lineHeight: 1,
                letterSpacing: '-2px',
                transition: 'color 0.4s',
              }}>
                {displayScore !== null ? displayScore : '—'}
              </div>
              {displayScore !== null && (
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  marginTop: '2px',
                  letterSpacing: '0.1em',
                }}>SCORE</div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Tier badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: tier.dimColor,
        padding: '5px 14px',
        borderRadius: '999px',
        border: `1px solid ${tier.color}33`,
      }}>
        <span style={{ fontSize: '0.75rem' }}>{tier.icon}</span>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: tier.color,
          letterSpacing: '0.05em',
        }}>{tier.label.toUpperCase()}</span>
      </div>

      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
        maxWidth: '160px',
        lineHeight: 1.4,
      }}>{tier.sublabel}</div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
