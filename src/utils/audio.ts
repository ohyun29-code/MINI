let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      audioCtx = new AudioCtx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playBeep(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.06) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  } catch {
    // Ignore audio errors in restricted browser contexts
  }
}

export function soundDrop() {
  playBeep(520, 0.09, 'triangle', 0.05);
}

export function soundGood() {
  playBeep(660, 0.1, 'square', 0.05);
  setTimeout(() => playBeep(880, 0.16, 'square', 0.05), 90);
}

export function soundNew() {
  playBeep(660, 0.1, 'square', 0.05);
  setTimeout(() => playBeep(990, 0.1, 'square', 0.05), 90);
  setTimeout(() => playBeep(1320, 0.22, 'square', 0.05), 180);
}

export function soundBad() {
  playBeep(200, 0.22, 'sawtooth', 0.04);
}

export function soundEnd() {
  playBeep(523, 0.14, 'sine', 0.06);
  setTimeout(() => playBeep(392, 0.22, 'sine', 0.06), 150);
}
