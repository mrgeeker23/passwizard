// Cross-platform sound utility using Web Audio API
// iOS/Android require AudioContext to be resumed after a user gesture.
// We create one shared context and resume it on first interaction.

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!_ctx) {
      _ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // iOS requires resume after user gesture
    if (_ctx.state === 'suspended') {
      _ctx.resume();
    }
    return _ctx;
  } catch {
    return null;
  }
}

// Unlock audio on first user interaction (critical for iOS Safari)
function unlockAudio() {
  const ctx = getCtx();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume();
  }
}

// Attach unlock listeners once
if (typeof window !== 'undefined') {
  const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
  const handler = () => {
    unlockAudio();
    events.forEach(e => document.removeEventListener(e, handler, true));
  };
  events.forEach(e => document.addEventListener(e, handler, { capture: true, passive: true }));
}

function playTone(freq: number, duration: number, volume: number, type: OscillatorType = 'sine', delay = 0) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.frequency.value = freq;
  osc.type = type;
  const t = ctx.currentTime + delay;
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.start(t);
  osc.stop(t + duration);
}

/** Short click for tabs/buttons */
export function playClick() {
  playTone(600, 0.06, 0.12);
}

/** Selection ding (two-note chime) */
export function playSelect() {
  playTone(880, 0.1, 0.1);
  playTone(1100, 0.1, 0.08, 'sine', 0.05);
}

/** Reveal fanfare — ascending three-note */
export function playReveal() {
  playTone(523, 0.15, 0.12); // C5
  playTone(659, 0.15, 0.12, 'sine', 0.15); // E5
  playTone(784, 0.25, 0.14, 'sine', 0.3); // G5
}

/** Correct answer chime */
export function playCorrect() {
  playTone(660, 0.1, 0.1);
  playTone(880, 0.15, 0.12, 'sine', 0.1);
}

/** Wrong answer buzz */
export function playWrong() {
  playTone(200, 0.2, 0.1, 'square');
}

/** Victory fanfare for quiz completion */
export function playVictory() {
  playTone(523, 0.12, 0.1);
  playTone(659, 0.12, 0.1, 'sine', 0.12);
  playTone(784, 0.12, 0.1, 'sine', 0.24);
  playTone(1047, 0.3, 0.14, 'sine', 0.36);
}
