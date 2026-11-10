// Answer sounds, synthesized with Web Audio so there are no files to load or license.
// A small signal chain (layered voices, a warm reverb room, a soft compressor) keeps them full
// rather than thin. Everything is best-effort: if audio is blocked or missing, the app stays quiet.
export type Sfx = "correct" | "wrong" | "complete" | "perfect";

const MASTER_GAIN = 0.78; // the 70% volume chosen on the sound mockup page
const ROOM_GAIN = 0.49; // and its 35% room

let enabled = true;
let ac: AudioContext | null = null;
let dry: GainNode;
let wetIn: GainNode;

export function setSoundsEnabled(on: boolean): void {
  enabled = on;
}

export function soundsEnabled(): boolean {
  return enabled;
}

// A short burst of smoothed noise that fades out, used as the room.
function roomImpulse(a: AudioContext): AudioBuffer {
  const len = Math.floor(a.sampleRate * 1.9);
  const buf = a.createBuffer(2, len, a.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      lp += (Math.random() * 2 - 1 - lp) * 0.35;
      d[i] = lp * Math.pow(1 - i / len, 2.6);
    }
  }
  return buf;
}

function context(): AudioContext | null {
  try {
    if (!ac) {
      const Ctor = globalThis.AudioContext ?? (globalThis as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return null;
      const a = new Ctor();
      const comp = a.createDynamicsCompressor();
      comp.threshold.value = -16; comp.knee.value = 24; comp.ratio.value = 3.5; comp.attack.value = 0.004; comp.release.value = 0.22;
      const master = a.createGain();
      master.gain.value = MASTER_GAIN;
      dry = a.createGain();
      wetIn = a.createGain();
      const wetOut = a.createGain();
      wetOut.gain.value = ROOM_GAIN;
      const room = a.createConvolver();
      room.buffer = roomImpulse(a);
      dry.connect(comp);
      wetIn.connect(room); room.connect(wetOut); wetOut.connect(comp);
      comp.connect(master); master.connect(a.destination);
      ac = a;
    }
    // Browsers start the context suspended until a click or key press. Answers are always one.
    if (ac.state === "suspended") void ac.resume();
    return ac;
  } catch {
    return null;
  }
}

type VoiceOpts = {
  type?: OscillatorType;
  partials?: [ratio: number, gain: number, decay?: number][];
  detune?: number;
  attack?: number;
  gain?: number;
  bend?: number;
  bendTime?: number;
  wet?: number;
};

function send(a: AudioContext, node: AudioNode, wet: number) {
  node.connect(dry);
  const w = a.createGain();
  w.gain.value = wet;
  node.connect(w);
  w.connect(wetIn);
}

// One layered note: each overtone gets its own fade, with two slightly detuned copies for body.
function voice(a: AudioContext, t: number, f: number, dur: number, o: VoiceOpts = {}) {
  const parts = o.partials ?? [[1, 1, 1]];
  const det = o.detune ?? 6;
  const copies = det ? [-det, det] : [0];
  const bus = a.createGain();
  const peak = (0.17 * (o.gain ?? 1)) / Math.sqrt(copies.length);
  for (const [ratio, share, decay] of parts) {
    const pg = a.createGain();
    const d = dur * (decay ?? 1);
    pg.gain.setValueAtTime(0.0001, t);
    pg.gain.exponentialRampToValueAtTime(Math.max(peak * share, 0.0002), t + (o.attack ?? 0.008));
    pg.gain.exponentialRampToValueAtTime(0.0001, t + d);
    for (const c of copies) {
      const osc = a.createOscillator();
      osc.type = o.type ?? "sine";
      osc.detune.value = c;
      osc.frequency.setValueAtTime(f * ratio, t);
      if (o.bend) osc.frequency.exponentialRampToValueAtTime(o.bend * ratio, t + dur * (o.bendTime ?? 0.85));
      osc.connect(pg);
      osc.start(t);
      osc.stop(t + d + 0.05);
    }
    pg.connect(bus);
  }
  send(a, bus, o.wet ?? 0.5);
}

function noise(a: AudioContext, t: number, dur: number, o: { type?: BiquadFilterType; freq?: number; q?: number; gain?: number; wet?: number } = {}) {
  const len = Math.max(1, Math.floor(a.sampleRate * dur));
  const buf = a.createBuffer(1, len, a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = o.type ?? "bandpass";
  f.frequency.value = o.freq ?? 2000;
  f.Q.value = o.q ?? 1;
  const g = a.createGain();
  g.gain.setValueAtTime(o.gain ?? 0.3, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f);
  f.connect(g);
  send(a, g, o.wet ?? 0.25);
  src.start(t);
}

const MARIMBA: VoiceOpts = { partials: [[1, 1, 1], [4, 0.35, 0.15], [10, 0.1, 0.05]], detune: 3, attack: 0.003, wet: 0.5 };
const BELL: VoiceOpts = { partials: [[1, 1, 1], [2.76, 0.5, 0.6], [5.4, 0.25, 0.35], [8.93, 0.12, 0.2]], detune: 0, attack: 0.003, wet: 0.85 };

// Talking drum (dundun): a squeezed pitch glide, a skin click, a low body thump and a faint buzz.
function talk(a: AudioContext, t: number, f0: number, f1: number, dur = 0.22, gain = 1) {
  voice(a, t, f0, dur, {
    bend: f1, bendTime: 0.8, detune: 0, attack: 0.004, gain: 1.5 * gain, wet: 0.45,
    partials: [[1, 1, 1], [2, 0.5, 0.6], [3, 0.22, 0.35], [1.5, 0.16, 0.5]],
  });
  voice(a, t, f0 * 0.5, dur * 0.6, { bend: f1 * 0.5, detune: 0, attack: 0.003, gain: 0.9 * gain, wet: 0.3 });
  noise(a, t, 0.035, { freq: 3000, q: 1.1, gain: 0.32 * gain });
  noise(a, t + 0.01, dur * 0.7, { type: "highpass", freq: 5000, gain: 0.04 * gain });
}

// A hollow wooden knock that falls slightly in pitch.
function logDrum(a: AudioContext, t: number, f: number, gain = 1) {
  voice(a, t, f, 0.4, {
    bend: f * 0.9, detune: 0, attack: 0.003, gain: 1.2 * gain, wet: 0.5,
    partials: [[1, 1, 1], [2.4, 0.3, 0.3], [4.1, 0.12, 0.15]],
  });
}

const G5 = 784, C6 = 1047, E6 = 1319;
const E5 = 659, A5 = 880;

// Picked on the sound mockup page: R2 Marimba pair, W7 Log drum pair,
// E3 Drum call and chime, P2 Talking drum speaks.
const SOUNDS: Record<Sfx, (a: AudioContext, t: number) => void> = {
  correct: (a, t) => {
    voice(a, t, E5, 0.4, MARIMBA);
    voice(a, t + 0.1, A5, 0.55, MARIMBA);
  },
  wrong: (a, t) => {
    logDrum(a, t, 230, 0.9);
    logDrum(a, t + 0.14, 175, 1);
  },
  complete: (a, t) => {
    talk(a, t, 250, 420, 0.15);
    talk(a, t + 0.18, 420, 330, 0.15);
    voice(a, t + 0.45, G5, 0.9, BELL);
    voice(a, t + 0.6, C6, 1.1, BELL);
  },
  perfect: (a, t) => {
    talk(a, t, 230, 380, 0.14);
    talk(a, t + 0.16, 380, 290, 0.14);
    talk(a, t + 0.32, 270, 440, 0.16);
    talk(a, t + 0.5, 440, 700, 0.3, 1.1);
    voice(a, t + 0.78, C6, 1.2, BELL);
    voice(a, t + 0.9, E6, 1, { ...BELL, gain: 0.7 });
  },
};

export function playSfx(kind: Sfx): void {
  if (!enabled) return;
  const a = context();
  if (!a) return;
  try {
    SOUNDS[kind](a, a.currentTime + 0.03);
  } catch {
    // Stay quiet.
  }
}

