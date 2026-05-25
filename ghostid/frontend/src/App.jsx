import React, { useState, useRef } from 'react';
import axios from 'axios';

import Header from './components/Header';
import ScoreRing from './components/ScoreRing';
import ConfidenceChart from './components/ConfidenceChart';
import KeystrokeInput from './components/KeystrokeInput';
import EventLog from './components/EventLog';
import StatsBar from './components/StatsBar';
import AlertBanner from './components/AlertBanner';
import { useKeystroke } from './hooks/useKeystroke';
import { TIERS } from './utils/tiers';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function App() {
  const [scores, setScores] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentTier, setCurrentTier] = useState('MONITORING');
  const [currentScore, setCurrentScore] = useState(null);
  const [isScoring, setIsScoring] = useState(false);
  const [alertTier, setAlertTier] = useState(null);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const eventIdRef = useRef(0);

  const { keystrokeCount, recentKeys, extractFeatures, clearEvents, hasEnoughData } = useKeystroke();

  const tier = TIERS[currentTier];

  const handleScore = async () => {
    if (!hasEnoughData || isScoring) return;
    setIsScoring(true);

    const features = extractFeatures();
    try {
      const res = await axios.post(`${API_URL}/score`, {
        user_id: 'demo_user',
        features,
      });
      const data = res.data;

      setCurrentScore(data.confidence_score);
      setCurrentTier(data.tier);
      setTotalKeystrokes(prev => prev + keystrokeCount);

      setScores(prev => [...prev, {
        time: prev.length + 1,
        score: data.confidence_score,
      }]);

      setEvents(prev => [...prev, {
        id: ++eventIdRef.current,
        tier: data.tier,
        score: data.confidence_score,
        action: data.action,
        time: new Date().toLocaleTimeString(),
      }]);

      if (data.tier !== 'SILENT_PASS') {
        setAlertTier(data.tier + '_' + Date.now());
      }

      clearEvents();
    } catch {
      setEvents(prev => [...prev, {
        id: ++eventIdRef.current,
        tier: 'ERROR',
        score: 0,
        action: 'backend_unreachable',
        time: new Date().toLocaleTimeString(),
      }]);
    }

    setIsScoring(false);
  };

  const alertKey = alertTier?.split('_')[0];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)' }}>
      {/* Ambient background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 20% 20%, rgba(0,229,255,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 40% 60% at 80% 80%, rgba(0,100,255,0.03) 0%, transparent 60%)
        `,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <Header sessionActive={currentTier !== 'MONITORING' || keystrokeCount > 0} />

        <AlertBanner tier={alertKey} key={alertTier} />

        <main style={{ padding: '1.5rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>

          {/* Stats row */}
          <div style={{ marginBottom: '1rem', animation: 'fade-in-up 0.4s ease' }}>
            <StatsBar scores={scores} totalKeystrokes={totalKeystrokes} />
          </div>

          {/* Main grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr 280px',
            gridTemplateRows: 'auto 1fr',
            gap: '1rem',
            animation: 'fade-in-up 0.5s ease 0.1s both',
          }}>
            {/* Left — Score ring */}
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              gridRow: '1 / 3',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.15em',
                textAlign: 'center',
              }}>BEHAVIORAL CONFIDENCE</div>

              <ScoreRing score={currentScore} tier={tier} isScoring={isScoring} />

              {/* Threshold reference */}
              <div style={{
                width: '100%',
                background: 'var(--bg-deep)',
                borderRadius: 'var(--radius-md)',
                padding: '0.875rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                {[
                  { label: 'Silent Pass', range: '85–100', color: '#00ff88' },
                  { label: 'Soft Nudge', range: '70–84', color: '#ffb800' },
                  { label: 'Challenge', range: '40–69', color: '#ff6b2b' },
                  { label: 'Hard Stop', range: '0–39', color: '#ff2d55' },
                ].map(({ label, range, color }) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: color }} />
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-display)', color: 'var(--text-secondary)' }}>{label}</span>
                    </div>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Center top — Chart */}
            <div style={{ gridColumn: '2 / 3' }}>
              <ConfidenceChart scores={scores} />
            </div>

            {/* Right — Event log */}
            <div style={{ gridRow: '1 / 3' }}>
              <EventLog events={events} />
            </div>

            {/* Center bottom — Keystroke input */}
            <div style={{ gridColumn: '2 / 3' }}>
              <KeystrokeInput
                keystrokeCount={keystrokeCount}
                hasEnoughData={hasEnoughData}
                onScore={handleScore}
                isScoring={isScoring}
                recentKeys={recentKeys}
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{
            marginTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 0.25rem',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-dim)',
            }}>
              GhostID v1.0 · LSTM 94.29% · CMU Keystroke Dataset · 51 users
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-dim)',
            }}>
              Built on Azure ML · GitHub Actions CI/CD
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
