import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/content/audio-manifest.json";
import { audioKey } from "@/lib/audio";
import { CONSONANT_SETS, TONE_COMPARE } from "./sound-focus";
import { validateConsonantSets, validateToneCompare } from "./validate-sound-focus";

const files = manifest as Record<string, string>;

describe("shipped tone rows and consonant sets", () => {
  it("pass their validators", () => {
    expect(validateToneCompare(TONE_COMPARE)).toEqual([]);
    expect(validateConsonantSets(CONSONANT_SETS)).toEqual([]);
  });
  it("has the 11 rows in order", () => {
    expect(TONE_COMPARE.map((r) => r.vowel)).toEqual(["a", "e", "ẹ", "i", "o", "ọ", "u", "an", "in", "un", "ọn"].map((v) => v.normalize("NFC")));
  });
  it("gives every row and set word a clip in the manifest and a file on disk", () => {
    const words = [...TONE_COMPARE.flatMap((r) => r.words), ...CONSONANT_SETS.flatMap((s) => s.words)];
    expect(words.length).toBeGreaterThan(0);
    const noEntry = words.filter((w) => !files[audioKey(w.yoruba)]).map((w) => w.yoruba);
    const noFile = words.filter((w) => files[audioKey(w.yoruba)] && !existsSync(join("public", "audio", files[audioKey(w.yoruba)]!))).map((w) => w.yoruba);
    expect(noEntry).toEqual([]);
    expect(noFile).toEqual([]);
  });
  it("covers gb, p and s-sh, with the gbọ́ set only on the p card", () => {
    const foci = new Set(CONSONANT_SETS.flatMap((s) => s.focus));
    expect([...foci].sort()).toEqual(["gb", "p", "s-sh"]);
    const gbo = CONSONANT_SETS.find((s) => s.words.some((w) => w.yoruba === "gbọ́".normalize("NFC")));
    expect(gbo?.focus).toEqual(["p"]);
    expect(CONSONANT_SETS.filter((s) => s.focus.includes("gb")).flatMap((s) => s.words.map((w) => w.yoruba))).not.toContain("gbọ́".normalize("NFC"));
  });
  it("pairs one s word with one ṣ word in every s-sh set", () => {
    for (const s of CONSONANT_SETS.filter((x) => x.focus.includes("s-sh"))) {
      const starts = s.words.map((w) => w.yoruba.normalize("NFC")[0]);
      expect(starts.sort(), s.id).toEqual(["s", "ṣ"].map((c) => c.normalize("NFC")));
    }
  });
});
