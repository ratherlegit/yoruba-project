import { describe, expect, it } from "vitest";
import { playSequence } from "./play-sequence";

const lookup = (t: string) => (t === "missing" ? null : `/audio/${t}.mp3`);

describe("playSequence", () => {
  it("plays clips in order and skips words without audio", async () => {
    const played: string[] = [];
    await playSequence(["a", "missing", "b"], { lookup, play: async (u) => (played.push(u), true) });
    expect(played).toEqual(["/audio/a.mp3", "/audio/b.mp3"]);
  });
  it("stops when a clip is interrupted", async () => {
    const played: string[] = [];
    await playSequence(["a", "b", "c"], { lookup, play: async (u) => (played.push(u), u !== "/audio/a.mp3") });
    expect(played).toEqual(["/audio/a.mp3"]);
  });
  it("a newer sequence cancels the older one", async () => {
    const played: string[] = [];
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    const first = playSequence(["a", "b"], {
      lookup,
      play: async (u) => {
        played.push(`1:${u}`);
        await gate;
        return true;
      },
    });
    const second = playSequence(["c"], { lookup, play: async (u) => (played.push(`2:${u}`), true) });
    release();
    await Promise.all([first, second]);
    expect(played).toEqual(["1:/audio/a.mp3", "2:/audio/c.mp3"]);
  });
  it("does nothing for an empty list", async () => {
    await expect(playSequence([], { lookup, play: async () => true })).resolves.toBeUndefined();
  });
});
