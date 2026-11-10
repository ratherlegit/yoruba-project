import { describe, it, expect, vi, afterEach } from "vitest";
import { playSfx, setSoundsEnabled } from "./sfx";

function fakeAudioContext() {
  const created = { oscillators: 0 };
  class FakeCtx {
    state = "running";
    currentTime = 0;
    destination = {};
    resume() { return Promise.resolve(); }
    createOscillator() {
      created.oscillators++;
      return { type: "sine", frequency: { value: 0 }, connect: (n: unknown) => n, start() {}, stop() {} };
    }
    createGain() {
      return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect: (n: unknown) => n };
    }
  }
  vi.stubGlobal("AudioContext", FakeCtx);
  return created;
}

describe("sfx", () => {
  afterEach(() => { setSoundsEnabled(true); vi.unstubAllGlobals(); });

  it("plays notes when enabled", () => {
    const created = fakeAudioContext();
    playSfx("correct");
    expect(created.oscillators).toBeGreaterThan(0);
  });

  it("is silent when sounds are turned off", () => {
    const created = fakeAudioContext();
    setSoundsEnabled(false);
    playSfx("wrong");
    expect(created.oscillators).toBe(0);
  });

  it("does not throw when Web Audio is unavailable", () => {
    vi.stubGlobal("AudioContext", undefined);
    expect(() => playSfx("complete")).not.toThrow();
  });
});
