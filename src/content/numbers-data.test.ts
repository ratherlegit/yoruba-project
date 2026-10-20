import { describe, expect, it } from "vitest";
import { gradeTransform } from "@/lib/transform-grade";
import { NUMBERS, NUMBER_STEPS, PHRASES } from "./numbers";
import { validateNumbers } from "./validate-numbers";
import { getVocabLevel, getVocabTopic } from "./vocab";

const entry = (value: number) => NUMBERS.find((n) => n.value === value)!;
const KNOWN_SOURCES = ["Wikipedia", "Wiktionary", "Chan", "Preply", "Omniglot", "Buffalo", "WALS", "COERLL"];

describe("numbers content", () => {
  it("is valid", () => {
    expect(validateNumbers(NUMBERS, PHRASES, NUMBER_STEPS)).toEqual([]);
  });
  it("has the cross-checked values only", () => {
    const expected = [
      ...Array.from({ length: 20 }, (_, i) => i + 1),
      25, 30, 35, 40, 50, 60, 70, 80, 90, 100, 200, 400, 500, 600, 700, 800, 900, 1000,
    ];
    expect(NUMBERS.map((n) => n.value).sort((a, b) => a - b)).toEqual(expected);
  });
  it("leaves out the numbers nothing second confirmed", () => {
    expect(NUMBERS.some((n) => n.value === 300)).toBe(false);
    expect(NUMBERS.flatMap((n) => n.answers).some((a) => a === "ení")).toBe(false);
  });
  it("has the six steps in order, with entries for steps 1 to 4 and phrases for 5 and 6", () => {
    expect(NUMBER_STEPS.map((s) => s.id)).toEqual(["one-to-ten", "eleven-to-twenty", "tens-and-twenties", "hundreds", "counting-things", "money"]);
    expect(NUMBER_STEPS.map((s) => s.title)).toEqual(["One to ten", "Eleven to twenty", "Tens and twenties", "Hundreds and thousands", "Counting things", "Money"]);
    NUMBER_STEPS.slice(0, 4).forEach((s, i) => {
      expect(s.phraseIds, s.id).toEqual([]);
      expect(s.entryIds.length, s.id).toBeGreaterThan(0);
      for (const id of s.entryIds) expect(NUMBERS.find((n) => n.id === id)!.step, `${s.id} ${id}`).toBe(i + 1);
    });
    NUMBER_STEPS.slice(4).forEach((s, i) => {
      expect(s.entryIds, s.id).toEqual([]);
      for (const id of s.phraseIds) expect(PHRASES.find((p) => p.id === id)!.step, `${s.id} ${id}`).toBe(i + 5);
    });
  });
  it("gives step 1 the ten words, each with an after-noun form and an example sentence", () => {
    const one = NUMBERS.filter((n) => n.step === 1);
    expect(one.map((n) => n.value)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    for (const n of one) {
      expect(n.after.length, n.id).toBeGreaterThan(0);
      expect(n.example, n.id).toBeDefined();
    }
  });
  it("accepts valid variants", () => {
    expect(gradeTransform("oókànlá", entry(11).answers, "advanced")).toBe("right");
    expect(gradeTransform("okòó", entry(20).answers, "advanced")).toBe("right");
    expect(gradeTransform("àrúnlélógún", entry(25).answers, "advanced")).toBe("right");
    expect(gradeTransform("ọrún", entry(100).answers, "advanced")).toBe("right");
    expect(gradeTransform("ọgọ́rùn-ún", entry(100).answers, "advanced")).toBe("right");
  });
  it("only leaves the build empty for base words", () => {
    for (const n of NUMBERS.filter((x) => !x.build)) {
      expect([...Array.from({ length: 10 }, (_, i) => i + 1), 20, 30, 400], n.id).toContain(n.value);
    }
  });
  it("names at least two sources for every entry, and one for every phrase", () => {
    for (const n of NUMBERS) {
      expect(KNOWN_SOURCES.filter((s) => n.source.includes(s)).length, n.id).toBeGreaterThanOrEqual(2);
    }
    for (const p of PHRASES) {
      expect(KNOWN_SOURCES.filter((s) => p.source.includes(s)).length, p.id).toBeGreaterThanOrEqual(1);
    }
  });
  it("has eight counting phrases and six prices", () => {
    expect(PHRASES.filter((p) => p.step === 5)).toHaveLength(8);
    expect(PHRASES.filter((p) => p.step === 6)).toHaveLength(6);
    for (const p of PHRASES.filter((x) => x.step === 6)) expect(p.numeral, p.id).toMatch(/^\d+$/);
  });
});

describe("vocab after the move", () => {
  it("no longer has the numbers topic, and Getting Started has 4 topics", () => {
    expect(getVocabTopic("getting-started", "gs-numbers")).toBeUndefined();
    expect(getVocabLevel("getting-started")!.topics).toHaveLength(4);
  });
});
