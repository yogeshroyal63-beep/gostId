export const TIERS = {
  MONITORING: {
    color: '#00e5ff',
    dimColor: 'rgba(0, 229, 255, 0.12)',
    glowColor: 'rgba(0, 229, 255, 0.25)',
    label: 'Monitoring',
    sublabel: 'Session active — collecting data',
    icon: '◉',
    threshold: null,
  },
  SILENT_PASS: {
    color: '#00ff88',
    dimColor: 'rgba(0, 255, 136, 0.12)',
    glowColor: 'rgba(0, 255, 136, 0.25)',
    label: 'Silent Pass',
    sublabel: 'Identity confirmed — no action required',
    icon: '✓',
    threshold: 85,
  },
  SOFT_NUDGE: {
    color: '#ffb800',
    dimColor: 'rgba(255, 184, 0, 0.12)',
    glowColor: 'rgba(255, 184, 0, 0.25)',
    label: 'Soft Nudge',
    sublabel: 'Anomaly detected — one-tap verification',
    icon: '⚡',
    threshold: 70,
  },
  TYPING_CHALLENGE: {
    color: '#ff6b2b',
    dimColor: 'rgba(255, 107, 43, 0.12)',
    glowColor: 'rgba(255, 107, 43, 0.25)',
    label: 'Typing Challenge',
    sublabel: 'Mismatch detected — phrase verification',
    icon: '⌨',
    threshold: 40,
  },
  HARD_STOP: {
    color: '#ff2d55',
    dimColor: 'rgba(255, 45, 85, 0.12)',
    glowColor: 'rgba(255, 45, 85, 0.25)',
    label: 'Hard Stop',
    sublabel: 'Identity breach — session terminated',
    icon: '✕',
    threshold: 0,
  },
};

export function getTierFromScore(score) {
  if (score >= 85) return 'SILENT_PASS';
  if (score >= 70) return 'SOFT_NUDGE';
  if (score >= 40) return 'TYPING_CHALLENGE';
  return 'HARD_STOP';
}
