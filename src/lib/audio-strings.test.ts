import { describe, expect, it } from "vitest";
import { LEVELS } from "@/content/levels";
import { collectAudioStrings } from "./audio-strings";

describe("collectAudioStrings", () => {
  const strings = collectAudioStrings(LEVELS);
  it("excludes one-letter strings", () => {
    for (const k of ["a", "ẹ", "o", "ó"]) expect(strings.map((s) => s.key)).not.toContain(k);
    expect(strings.every((s) => [...s.key].length > 1)).toBe(true);
  });
  it("has unique NFC keys", () => {
    expect(new Set(strings.map((s) => s.key)).size).toBe(strings.length);
    expect(strings.every((s) => s.key === s.key.normalize("NFC"))).toBe(true);
  });
});
