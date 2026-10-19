let audioCtx: AudioContext | null = null;

export function playKeyClick(type: 'normal' | 'operator' | 'function' | 'clear' | 'equals' = 'normal') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    let freq = 1200;
    let duration = 0.015;
    let volume = 0.08;

    switch (type) {
      case 'clear':
        freq = 800;
        duration = 0.025;
        volume = 0.12;
        break;
      case 'equals':
        freq = 1500;
        duration = 0.03;
        volume = 0.14;
        break;
      case 'function':
        freq = 1400;
        duration = 0.018;
        volume = 0.09;
        break;
      case 'operator':
        freq = 1100;
        duration = 0.015;
        volume = 0.09;
        break;
      default:
        freq = 1250;
        duration = 0.012;
        volume = 0.07;
        break;
    }

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, t + duration);

    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(t);
    osc.stop(t + duration);
  } catch {
    // Ignore audio errors if audio context is blocked
  }
}

export function triggerHaptic() {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(12);
    }
  } catch {
    // Ignore haptic errors on unsupported devices
  }
}
