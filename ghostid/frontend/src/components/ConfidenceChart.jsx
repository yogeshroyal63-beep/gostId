import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const score = payload[0]?.value;
  const color = score >= 85 ? '#00ff88' : score >= 70 ? '#ffb800' : score >= 40 ? '#ff6b2b' : '#ff2d55';
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border-mid)',
      borderRadius: '8px',
      padding: '8px 12px',
      fontFamily: 'var(--font-mono)',
    }}>
      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>CONFIDENCE</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, color }}>{score}%</div>
    </div>
  );
};

export default function ConfidenceChart({ scores }) {
  const isEmpty = scores.length === 0;

  const chartData = isEmpty
    ? Array.from({ length: 10 }, (_, i) => ({ time: i + 1, score: null }))
    : scores;

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.5rem',
      height: '100%',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', letterSpacing: '-0.3px' }}>Confidence Timeline</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
            {scores.length} scoring events
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {[
            { label: 'Safe', color: '#00ff88', val: '≥85' },
            { label: 'Nudge', color: '#ffb800', val: '≥70' },
            { label: 'Stop', color: '#ff2d55', val: '<40' },
          ].map(({ label, color, val }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '2px', background: color, borderRadius: '1px' }} />
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{val}</span>
            </div>
          ))}
        </div>
      </div>

      {isEmpty ? (
        <div style={{
          height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: '0.5rem',
        }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No scoring events yet</div>
          <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            Type and score to see your behavioral fingerprint
          </div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" stroke="var(--text-dim)" tick={{ fontSize: 10, fontFamily: 'Space Mono' }} />
            <YAxis domain={[0, 100]} stroke="var(--text-dim)" tick={{ fontSize: 10, fontFamily: 'Space Mono' }} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={85} stroke="#00ff88" strokeDasharray="4 4" strokeOpacity={0.5} />
            <ReferenceLine y={70} stroke="#ffb800" strokeDasharray="4 4" strokeOpacity={0.5} />
            <ReferenceLine y={40} stroke="#ff2d55" strokeDasharray="4 4" strokeOpacity={0.5} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#00e5ff"
              strokeWidth={2}
              fill="url(#scoreGrad)"
              dot={{ fill: '#00e5ff', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#00e5ff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
