class GhostID {
  constructor(config) {
    this.userId = config.userId;
    this.apiUrl = config.apiUrl || 'http://localhost:8000';
    this.onSoftNudge = config.onSoftNudge || (() => {});
    this.onTypingChallenge = config.onTypingChallenge || (() => {});
    this.onHardStop = config.onHardStop || (() => {});
    this.onScore = config.onScore || (() => {});
    
    this.keyEvents = [];
    this.isActive = false;
    this.scoringInterval = null;
  }

  start() {
    this.isActive = true;
    this._attachListeners();
    // Score every 60 seconds
    this.scoringInterval = setInterval(() => this._score(), 60000);
    console.log('[GhostID] Session monitoring started');
  }

  stop() {
    this.isActive = false;
    this._detachListeners();
    clearInterval(this.scoringInterval);
    console.log('[GhostID] Session monitoring stopped');
  }

  _attachListeners() {
    this._onKeyDown = (e) => {
      this.keyEvents.push({ key: e.key, type: 'down', time: performance.now() });
    };
    this._onKeyUp = (e) => {
      this.keyEvents.push({ key: e.key, type: 'up', time: performance.now() });
    };
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
  }

  _detachListeners() {
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
  }

  _extractFeatures() {
    const downs = {};
    const ups = {};
    const features = [];

    for (const event of this.keyEvents) {
      if (event.type === 'down') downs[event.key] = event.time;
      if (event.type === 'up' && downs[event.key]) {
        const dwell = event.time - downs[event.key];
        features.push(dwell / 1000); // normalize to seconds
        ups[event.key] = event.time;
      }
    }

    // Pad or trim to 41 features
    while (features.length < 41) features.push(0);
    return features.slice(0, 41);
  }

  async _score() {
    if (this.keyEvents.length < 20) return; // not enough data

    const features = this._extractFeatures();
    
    try {
      const res = await fetch(`${this.apiUrl}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: this.userId, features })
      });

      const data = await res.json();
      this.onScore(data);

      if (data.tier === 'SOFT_NUDGE') this.onSoftNudge(data);
      else if (data.tier === 'TYPING_CHALLENGE') this.onTypingChallenge(data);
      else if (data.tier === 'HARD_STOP') this.onHardStop(data);

      // Clear events after scoring
      this.keyEvents = [];
    } catch (err) {
      console.error('[GhostID] Scoring failed:', err);
    }
  }

  // Force score immediately (for testing)
  forceScore() {
    this._score();
  }
}

export default GhostID;