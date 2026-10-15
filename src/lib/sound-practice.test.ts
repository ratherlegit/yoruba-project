import { describe, expect, it } from "vitest";
import type { MinimalPair } from "@/content/sounds";
import { buildPractice } from "./sound-practice";

const w = (yoruba: string) => ({ yoruba, english: "x" });
const pairs: MinimalPair[] = [
  { id: "p1", contrast: "tone", explain: "e", words: [w("ọkọ"), w("ọkọ̀"), w("ọkọ́")], confidence: "needs-review", note: "n" },
  { id: "p2", contrast: "sound", explain: "e", words: [w("oko"), w("ọkọ")], confidence: "needs-review", note: "n" },
];
const all = () => true;

describe("buildPractice", () => {
  it("makes one question per playable word, answer included in choices", () => {
    const qs = buildPractice(pairs, "s", all, 99);
    expect(qs).toHaveLength(5);
    for (const q of qs) {
      expect(q.choices).toContain(q.answer);
      expect(q.audioText).toBe(q.answer);
      expect(new Set(q.choices).size).toBe(q.choices.length);
    }
  });
  it("draws choices only from the same pair", () => {
    const qs = buildPractice([pairs[1]!], "s", all, 99);
    for (const q of qs) expect(q.choices.sort()).toEqual(["oko", "ọkọ"].sort());
  });
  it("is deterministic per seed and differs across seeds", () => {
    expect(buildPractice(pairs, "a", all, 99)).toEqual(buildPractice(pairs, "a", all, 99));
    expect(buildPractice(pairs, "a", all, 99).map((q) => q.id)).not.toEqual(buildPractice(pairs, "b", all, 99).map((q) => q.id));
  });
  it("skips pairs with fewer than 2 words that have audio", () => {
    const only = (t: string) => t === "oko";
    expect(buildPractice(pairs, "s", only, 99)).toEqual([]);
  });
  it("only asks about words that have audio", () => {
    const has = (t: string) => t !== "ọkọ́";
    const qs = buildPractice([pairs[0]!], "s", has, 99);
    expect(qs.map((q) => q.answer).sort()).toEqual(["ọkọ", "ọkọ̀"].sort());
  });
  it("caps the number of questions", () => {
    expect(buildPractice(pairs, "s", all, 3)).toHaveLength(3);
  });
});
