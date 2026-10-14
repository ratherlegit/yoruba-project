import { describe, expect, it } from "vitest";
import type { VocabTopic, VocabWord } from "@/content/vocab/types";
import { buildGap, buildQuiz, distractors } from "./vocab-questions";

const YORUBA = ["ọkọ", "ọkọ̀", "oko", "ilé", "ẹja", "bàbá", "ìyá", "ẹ káàárọ̀", "omi", "ewé"];

function fixture(): VocabTopic {
  const words: VocabWord[] = YORUBA.map((y, i) => ({
    id: `f-${i}`,
    yoruba: y,
    english: `gloss ${i}`,
    pos: "noun",
    sentence: i === 3
      ? { yoruba: "Ilé mi tóbi", english: "My house is big", blank: "ilé" }
      : { yoruba: `Mo rí ${y} níbí`, english: `I see ${i}` },
    confidence: "needs-review",
    note: "t",
  }));
  return { id: "f", level: "getting-started", title: "F", blurb: "b", sources: ["t"], words };
}

describe("distractors", () => {
  it("excludes the answer, is distinct, and has the requested count", () => {
    const d = distractors("ọkọ", YORUBA, "s", 3);
    expect(d).toHaveLength(3);
    expect(new Set(d).size).toBe(3);
    expect(d).not.toContain("ọkọ");
  });
  it("prefers tone-only confusables first", () => {
    const d = distractors("ọkọ", YORUBA, "s", 3);
    expect(d).toContain("ọkọ̀");
  });
  it("is deterministic for a seed", () => {
    expect(distractors("ilé", YORUBA, "x", 3)).toEqual(distractors("ilé", YORUBA, "x", 3));
  });
});

describe("buildQuiz", () => {
  const t = fixture();
  const qs = buildQuiz(t);
  it("asks one question per word with 4 distinct choices and a valid answer index", () => {
    expect(qs).toHaveLength(10);
    for (const q of qs) {
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices).size).toBe(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(4);
    }
  });
  it("mixes both directions and only uses topic content as choices", () => {
    const golds = qs.map((q) => q.choices[q.answer]!);
    const english = new Set(t.words.map((w) => w.english));
    const yoruba = new Set(t.words.map((w) => w.yoruba));
    expect(golds.some((g) => english.has(g))).toBe(true);
    expect(golds.some((g) => yoruba.has(g))).toBe(true);
    for (const q of qs) for (const c of q.choices) expect(english.has(c) || yoruba.has(c)).toBe(true);
  });
  it("covers every word exactly once", () => {
    const covered = new Set(qs.map((q) => q.wordId));
    expect(covered.size).toBe(10);
  });
  it("is deterministic per seed and differs across seeds", () => {
    expect(buildQuiz(t, "a")).toEqual(buildQuiz(t, "a"));
    expect(buildQuiz(t, "a")).not.toEqual(buildQuiz(t, "b"));
  });
});

describe("buildGap", () => {
  const t = fixture();
  const qs = buildGap(t);
  it("blanks the word, adds the translation, and offers 4 distinct choices including the answer", () => {
    expect(qs).toHaveLength(10);
    for (const q of qs) {
      expect(q.prompt).toContain("___");
      expect(q.prompt).toMatch(/\(.+\)$/);
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices).size).toBe(4);
      expect(q.choices).toContain(q.answer);
    }
  });
  it("blanks a sentence-initial capitalized word and handles multi-word entries", () => {
    const house = qs.find((q) => q.answer === "ilé")!;
    expect(house.prompt.startsWith("___ mi tóbi")).toBe(true);
    const greet = qs.find((q) => q.answer === "ẹ káàárọ̀")!;
    expect(greet.prompt).toContain("Mo rí ___ níbí");
  });
  it("never leaves the answer word visible in the prompt", () => {
    for (const q of qs) expect(q.prompt.toLowerCase().split("(")[0]).not.toContain(q.answer.toLowerCase());
  });
});
