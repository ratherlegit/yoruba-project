import { describe, it, expect, vi, afterEach } from "vitest";
import { playSfx, setSoundsEnabled } from "./sfx";

// The module keeps its audio context between calls, so the counter is shared and reset per test.
const created = { oscillators: 0 };
function fakeAudioContext() {
  created.oscillators = 0;
  const node = () => ({ connect: (n: unknown) => n, gain: { value: 1, setValueAtTime() {}, exponentialRampToValueAtTime() {} } });
  class FakeCtx {
    state = "running";
    currentTime = 0;
    sampleRate = 8000;
    destination = {};
    resume() { return Promise.resolve(); }
    createBuffer(_c: number, len: number) { return { getChannelData: () => new Float32Array(len) }; }
    createOscillator() {
      created.oscillators++;
      return {
        type: "sine", detune: { value: 0 },
        frequency: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} },
        connect: (n: unknown) => n, start() {}, stop() {},
      };
    }
    createGain() { return node(); }
    createDynamicsCompressor() { return { ...node(), threshold: {}, knee: {}, ratio: {}, attack: {}, release: {} }; }
    createConvolver() { return { ...node(), buffer: null }; }
    createBiquadFilter() { return { ...node(), type: "", frequency: { value: 0 }, Q: { value: 0 } }; }
    createBufferSource() { return { ...node(), buffer: null, start() {} }; }
  }
  vi.stubGlobal("AudioContext", FakeCtx);
}

describe("sfx", () => {
  afterEach(() => { setSoundsEnabled(true); vi.unstubAllGlobals(); });

  it("plays notes when enabled", () => {
    fakeAudioContext();
    playSfx("correct");
    expect(created.oscillators).toBeGreaterThan(0);
  });

  it("has a sound for every purpose", () => {
    fakeAudioContext();
    for (const kind of ["correct", "wrong", "complete", "perfect"] as const) {
      created.oscillators = 0;
      playSfx(kind);
      expect(created.oscillators).toBeGreaterThan(0);
    }
  });

  it("is silent when sounds are turned off", () => {
    fakeAudioContext();
    setSoundsEnabled(false);
    playSfx("wrong");
    expect(created.oscillators).toBe(0);
  });

  it("does not throw when Web Audio is unavailable", () => {
    vi.stubGlobal("AudioContext", undefined);
    expect(() => playSfx("complete")).not.toThrow();
  });
});
