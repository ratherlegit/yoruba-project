import { describe, expect, it } from "vitest";
import type { Lesson, WordBreakdown } from "./types";
import { QUESTIONS_PER_LESSON, validateBreakdown, validateLesson } from "./validate";

const RULES = new Set(["u-to-a"]);

const greeting: WordBreakdown = {
  id: "kaaaro",
  surface: "ẹ káàárọ̀",
  english: "good morning (respectful)",
  parts: [
    { text: "ẹ", gloss: "you (respect)", role: "pronoun" },
    { text: "kú", gloss: "greet", role: "verb" },
    { text: "àárọ̀", gloss: "morning", role: "noun" },
  ],
  steps: [
    { kind: "join", result: "ẹ kú àárọ̀" },
    { kind: "assimilate", result: "ẹ káàárọ̀", ruleId: "u-to-a" },
  ],
  confidence: "needs-review",
  note: "Check the vowel change kú to ká before àárọ̀.",
};

describe("validateBreakdown", () => {
  it("accepts a correct contraction", () => {
    expect(validateBreakdown(greeting, RULES)).toEqual([]);
  });
  it("rejects steps that do not end at the surface form", () => {
    const bad = { ...greeting, steps: [greeting.steps[0]!, { ...greeting.steps[1]!, result: "ẹ kúàárọ̀" }] };
    expect(validateBreakdown(bad, RULES).join("\n")).toMatch(/surface/);
  });
  it("rejects a first step that is not a join of the parts", () => {
    const bad = { ...greeting, steps: [{ kind: "join" as const, result: "ẹ kú ọ̀sán" }, greeting.steps[1]!] };
    expect(validateBreakdown(bad, RULES).join("\n")).toMatch(/join/);
  });
  it("rejects an unknown ruleId", () => {
    const bad = { ...greeting, steps: [greeting.steps[0]!, { ...greeting.steps[1]!, ruleId: "nope" }] };
    expect(validateBreakdown(bad, RULES).join("\n")).toMatch(/nope/);
  });
  it("requires a ruleId on non-join steps", () => {
    const bad = { ...greeting, steps: [greeting.steps[0]!, { kind: "elide" as const, result: "ẹ káàárọ̀" }] };
    expect(validateBreakdown(bad, RULES).join("\n")).toMatch(/ruleId/);
  });
  it("accepts a word with no steps when the parts equal the surface", () => {
    const plain: WordBreakdown = {
      id: "omo", surface: "ọmọ", english: "child",
      parts: [{ text: "ọ", gloss: "o", role: "syllable" }, { text: "mọ", gloss: "mo", role: "syllable" }],
      steps: [], confidence: "verified",
    };
    expect(validateBreakdown(plain, RULES)).toEqual([]);
  });
  it("rejects a no-step word whose parts differ from the surface", () => {
    const bad: WordBreakdown = {
      id: "x", surface: "ọmọ", english: "child",
      parts: [{ text: "ọ", gloss: "o", role: "syllable" }, { text: "mo", gloss: "mo", role: "syllable" }],
      steps: [], confidence: "verified",
    };
    expect(validateBreakdown(bad, RULES).join("\n")).toMatch(/steps/);
  });
  it("requires a note on needs-review words", () => {
    const { note: _note, ...rest } = greeting;
    expect(validateBreakdown(rest as WordBreakdown, RULES).join("\n")).toMatch(/note/);
  });
});

function lessonWith(overrides: Partial<Lesson>): Lesson {
  const q = (n: number) => ({
    type: "pick" as const, prompt: `q${n}`, choices: ["a", "b"], answer: 0,
  });
  return {
    id: "t-1", level: "getting-started", title: "Test", sources: ["test"],
    primer: {
      rule: "r", formula: "f",
      rules: [{ id: "u-to-a", title: "u to a", explanation: "e" }],
      examples: [greeting, { ...greeting, id: "b" }, { ...greeting, id: "c" }],
      commonMistake: { wrong: "w", right: "r", why: "y" },
    },
    questions: Array.from({ length: QUESTIONS_PER_LESSON }, (_, n) => q(n)),
    ...overrides,
  };
}

describe("validateLesson", () => {
  it("accepts a well-formed lesson", () => {
    expect(validateLesson(lessonWith({}))).toEqual([]);
  });
  it("rejects non-NFC strings", () => {
    const l = lessonWith({ title: "o\u0323" });
    expect(validateLesson(l).join("\n")).toMatch(/NFC/);
  });
  it("rejects em dashes", () => {
    expect(validateLesson(lessonWith({ title: "a \u2014 b" })).join("\n")).toMatch(/em dash/);
  });
  it("rejects the wrong question count", () => {
    expect(validateLesson(lessonWith({ questions: [] })).join("\n")).toMatch(/8 questions/);
  });
  it("rejects a blank whose answer is not in choices or lacks a gap", () => {
    const l = lessonWith({});
    l.questions[0] = { type: "blank", prompt: "no gap", answer: "z", choices: ["a", "b"] };
    const out = validateLesson(l).join("\n");
    expect(out).toMatch(/choices/);
    expect(out).toMatch(/___/);
  });
  it("rejects a pick with an out-of-range answer", () => {
    const l = lessonWith({});
    l.questions[0] = { type: "pick", prompt: "p", choices: ["a", "b"], answer: 5 };
    expect(validateLesson(l).join("\n")).toMatch(/answer index/);
  });
  it("rejects an order question that is not a permutation", () => {
    const l = lessonWith({});
    l.questions[0] = { type: "order", english: "e", words: ["a", "b"], answer: ["a", "c"] };
    expect(validateLesson(l).join("\n")).toMatch(/permutation/);
  });
  it("rejects a wordId that does not resolve", () => {
    const l = lessonWith({});
    l.questions[0] = { type: "pick", prompt: "p", choices: ["a", "b"], answer: 0, wordId: "ghost" };
    expect(validateLesson(l).join("\n")).toMatch(/ghost/);
  });
  it("requires at least three examples and a source", () => {
    const l = lessonWith({ sources: [] });
    l.primer.examples = [greeting];
    const out = validateLesson(l).join("\n");
    expect(out).toMatch(/examples/);
    expect(out).toMatch(/sources/);
  });
});
