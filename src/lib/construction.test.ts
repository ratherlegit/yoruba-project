import { describe, expect, it } from "vitest";
import type { Morpheme, WordBreakdown } from "@/content/types";
import { hasConstruction, primerHeading } from "./construction";

const syl = (text: string): Morpheme => ({ text, gloss: text, role: "syllable" });
const mk = (parts: Morpheme[], steps: WordBreakdown["steps"] = []): WordBreakdown => ({
  id: "w", surface: "x", english: "x", parts, steps, confidence: "verified",
});

describe("hasConstruction", () => {
  it("is false for a single part with no steps", () => {
    expect(hasConstruction(mk([syl("gbọ́")]))).toBe(false);
  });
  it("is false for syllable-only parts with no steps (ọ + mọ)", () => {
    expect(hasConstruction(mk([syl("ọ"), syl("mọ")]))).toBe(false);
  });
  it("is true for real morphemes with no steps", () => {
    const parts: Morpheme[] = [
      { text: "olù", gloss: "one who", role: "noun" },
      { text: "kọ́", gloss: "teach", role: "verb" },
    ];
    expect(hasConstruction(mk(parts))).toBe(true);
  });
  it("is true when steps exist, even with syllable roles", () => {
    expect(hasConstruction(mk([syl("a"), syl("b")], [{ kind: "join", result: "ab" }]))).toBe(true);
  });
});

describe("primerHeading", () => {
  it("names construction when any example has it", () => {
    const steps: WordBreakdown["steps"] = [{ kind: "join", result: "ab" }];
    expect(primerHeading([mk([syl("a")]), mk([syl("a"), syl("b")], steps)])).toBe("Words and how they are built");
  });
  it("uses a plain heading when no example has construction", () => {
    expect(primerHeading([mk([syl("a"), syl("b")])])).toBe("Words in this lesson");
  });
});
