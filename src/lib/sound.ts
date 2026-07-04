// Board sounds synthesized with WebAudio — no asset files. Kept deliberately
// soft: a wooden tap for a move, a lower thock for a capture, a two-note
// alert for check, a small cadence for game end.

export type SoundKind = 'move' | 'capture' | 'check' | 'gameover';

let ctx: AudioContext | null = null;

function tone(when: number, freq: number, durMs: number, gain: number, type: OscillatorType = 'sine') {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, when);
  g.gain.exponentialRampToValueAtTime(0.0001, when + durMs / 1000);
  osc.connect(g).connect(ctx.destination);
  osc.start(when);
  osc.stop(when + durMs / 1000 + 0.02);
}

export function playSound(kind: SoundKind, muted: boolean) {
  if (muted) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const t = ctx.currentTime + 0.01;
    switch (kind) {
      case 'move':
        tone(t, 440, 70, 0.12, 'triangle');
        break;
      case 'capture':
        tone(t, 220, 110, 0.18, 'triangle');
        tone(t, 160, 90, 0.1, 'sine');
        break;
      case 'check':
        tone(t, 660, 90, 0.12, 'triangle');
        tone(t + 0.1, 880, 120, 0.12, 'triangle');
        break;
      case 'gameover':
        tone(t, 523, 140, 0.12, 'triangle');
        tone(t + 0.15, 392, 140, 0.12, 'triangle');
        tone(t + 0.3, 262, 260, 0.14, 'triangle');
        break;
    }
  } catch {
    // Audio unavailable (autoplay policy, no device) — sounds are optional.
  }
}
