import { useState, useEffect, useRef, useCallback } from 'react';

export function useKeystroke() {
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const [recentKeys, setRecentKeys] = useState([]);
  const keyEventsRef = useRef([]);
  const downTimesRef = useRef({});

  useEffect(() => {
    const onKeyDown = (e) => {
      downTimesRef.current[e.key] = performance.now();
      keyEventsRef.current.push({ key: e.key, type: 'down', time: performance.now() });
    };

    const onKeyUp = (e) => {
      keyEventsRef.current.push({ key: e.key, type: 'up', time: performance.now() });
      setKeystrokeCount(prev => prev + 1);
      setRecentKeys(prev => [e.key, ...prev].slice(0, 8));
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const extractFeatures = useCallback(() => {
    const features = [];
    const downs = {};

    for (const event of keyEventsRef.current) {
      if (event.type === 'down') downs[event.key] = event.time;
      if (event.type === 'up' && downs[event.key]) {
        const dwell = (event.time - downs[event.key]) / 1000;
        features.push(dwell);
      }
    }

    // Ratio features
    const ratios = [];
    for (let i = 0; i < features.length - 1; i++) {
      ratios.push(features[i] / (features[i + 1] + 1e-8));
    }

    const combined = [...features, ...ratios];
    while (combined.length < 41) combined.push(0);
    return combined.slice(0, 41);
  }, []);

  const clearEvents = useCallback(() => {
    keyEventsRef.current = [];
    setKeystrokeCount(0);
    setRecentKeys([]);
  }, []);

  const hasEnoughData = keystrokeCount >= 10;

  return { keystrokeCount, recentKeys, extractFeatures, clearEvents, hasEnoughData };
}
