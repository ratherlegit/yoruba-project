import { afterEach, describe, expect, it, vi } from "vitest";
import { playClip } from "./clip";
import { playSequence } from "./play-sequence";

afterEach(() => vi.unstubAllGlobals());

class RejectingAudio extends EventTarget {
  play = () => Promise.reject(new Error("NotAllowedError"));
  pause = () => {};
  constructor(public url: string) {
    super();
  }
}

describe("rejected play()", () => {
  it("playClip calls onRejected when play() rejects", async () => {
    vi.stubGlobal("Audio", RejectingAudio);
    const onRejected = vi.fn();
    playClip("/audio/a.mp3", onRejected);
    await Promise.resolve();
    await Promise.resolve();
    expect(onRejected).toHaveBeenCalledOnce();
  });

  it("playSequence continues past clips whose play() is refused", async () => {
    const created: string[] = [];
    vi.stubGlobal(
      "Audio",
      class extends RejectingAudio {
        constructor(url: string) {
          super(url);
          created.push(url);
        }
      },
    );
    await playSequence(["a", "b"], { lookup: (t) => `/audio/${t}.mp3` });
    expect(created).toEqual(["/audio/a.mp3", "/audio/b.mp3"]);
  });
});
