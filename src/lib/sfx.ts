// Short answer sounds, synthesized with Web Audio so there are no files to load or license.
// Everything here is best-effort: if audio is blocked or missing, the app stays quiet.
export type Sfx = "correct" | "wrong" | "complete" | "perfect";

type Note = { f: number; at: number; dur: number; type?: OscillatorType; gain?: number };

// Notes are in seconds from the start of the sound. Frequencies are Hz.
const SOUNDS: Record<Sfx, Note[]> = {
  // A bright rising pair (G5 then C6).
  correct: [{ f: 784, at: 0, dur: 0.14 }, { f: 1047, at: 0.09, dur: 0.28 }],
  // A soft, low falling pair. Gentle on purpose: a wrong answer should nudge, not scold.
  wrong: [{ f: 294, at: 0, dur: 0.16, type: "triangle", gain: 0.9 }, { f: 233, at: 0.12, dur: 0.3, type: "triangle", gain: 0.9 }],
  // A short rising arpeggio (C5 E5 G5).
  complete: [{ f: 523, at: 0, dur: 0.16 }, { f: 659, at: 0.13, dur: 0.16 }, { f: 784, at: 0.26, dur: 0.4 }],
  // The same, climbing to a held high C with a sparkle on top, for a perfect score.
  perfect: [
    { f: 523, at: 0, dur: 0.14 }, { f: 659, at: 0.11, dur: 0.14 }, { f: 784, at: 0.22, dur: 0.14 },
    { f: 1047, at: 0.33, dur: 0.55 }, { f: 1568, at: 0.45, dur: 0.4, gain: 0.5 },
  ],
};

let enabled = true;
let ctx: AudioContext | null = null;

export function setSoundsEnabled(on: boolean): void {
  enabled = on;
}

export function soundsEnabled(): boolean {
  return enabled;
}

function context(): AudioContext | null {
  try {
    if (!ctx) {
      const Ctor = globalThis.AudioContext ?? (globalThis as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    }
    // Browsers start the context suspended until a click or key press. Answers are always one.
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

export function playSfx(kind: Sfx): void {
  if (!enabled) return;
  const ac = context();
  if (!ac) return;
  try {
    const start = ac.currentTime + 0.01;
    for (const n of SOUNDS[kind]) {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = n.type ?? "sine";
      osc.frequency.value = n.f;
      const peak = 0.16 * (n.gain ?? 1);
      const t0 = start + n.at;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.dur);
      osc.connect(g).connect(ac.destination);
      osc.start(t0);
      osc.stop(t0 + n.dur + 0.02);
    }
  } catch {
    // Stay quiet.
  }
}
