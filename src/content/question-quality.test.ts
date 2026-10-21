import { describe, expect, it } from "vitest";
import { LEVELS } from "./levels";

// The two rules every lesson question must meet (see content/QUESTION-RULES.md):
//  1. It cannot be solved without reading the guide (no lookup by eye, no elimination by shape).
//  2. It asks only about what this lesson or an earlier one has taught.
// Patterns for questions that test vocabulary or letter lookup instead of a lesson's rule.
const BANNED: { name: string; re: RegExp }[] = [
  { name: "word-meaning lookup", re: /^which (short )?(word|pronoun|noun|verb)\b.* means\b/i },
  { name: "sound-to-letter lookup", re: /sound in .* is written/i },
  { name: "word-contains-sound lookup", re: /^which word contains the sound\b/i },
  { name: "spelling shows the sound", re: /^which spelling shows\b/i },
  { name: "the word for X", re: /\bthe word for\b/i },
  { name: "what does a word mean", re: /\bwhat does \S+ mean\b/i },
  { name: "how do you say", re: /\bhow do you say\b/i },
  // "means" followed by a single gloss ("means teacher", 'means "going"').
  // Whole-sentence translations ('Which means "We are friends"?') still pass.
  { name: "means a single word", re: /\bmeans?\s+"?(?:a |an |the )?[\p{L}'’-]+"?\s*[?.]?$/iu },
  { name: "which words ask", re: /^which words? asks?\b/i },
  // Answerable by matching what the choices look like, without the guide.
  { name: "visual match on dots", re: /\bdotted\b/i },
  { name: "visual match on letters", re: /^which word (starts|begins) with the "[a-z]+" sound|has a sound written with\b/i },
];

describe("the banned patterns", () => {
  const banned = (p: string) => BANNED.some((b) => b.re.test(p));
  it.each([
    "Which word means teacher?",
    "Which of these means \"going\"?",
    "What does ọmọ mean?",
    "How do you say fish?",
    "The word for child is ọ___ọ.",
    "Which words ask \"what\"?",
    "Which word starts with the \"sh\" sound?",
    "Which word has exactly one dotted vowel (ẹ or ọ) and no dotted consonant?",
  ])("catches the lookup %s", (p) => expect(banned(p)).toBe(true));
  it.each([
    "Which means \"We are friends\"?",
    "Which means \"the chicken that I bought\"?",
    "In A ò lọ, what does ò stand for?",
  ])("allows the sentence-level question %s", (p) => expect(banned(p)).toBe(false));
});

describe("grammar questions test rules, not vocabulary", () => {
  for (const level of LEVELS) {
    for (const lesson of level.lessons) {
      lesson.questions.forEach((q, n) => {
        if (q.type === "order") return;
        it(`${lesson.id} question ${n + 1} is not a vocab or lookup question`, () => {
          for (const b of BANNED) expect(q.prompt, b.name).not.toMatch(b.re);
        });
      });
    }
  }
});

const flat = LEVELS.flatMap((lv) => lv.lessons);
const wordsOf = (s: string): string[] =>
  s.normalize("NFC").toLowerCase().split(/[^\p{L}\p{M}]+/u).filter(Boolean);

// Every word a lesson's primer puts in front of the learner.
function primerWords(lesson: (typeof flat)[number]): Set<string> {
  const p = lesson.primer;
  const text = [
    p.rule,
    p.formula,
    p.commonMistake.wrong,
    p.commonMistake.right,
    ...p.rules.flatMap((r) => r.explanation),
    ...(p.tables ?? []).flatMap((t) => [...t.rows.flat(), t.note ?? ""]),
    ...p.examples.flatMap((e) => [e.surface, ...e.parts.map((x) => x.text)]),
  ].join(" ");
  return new Set(wordsOf(text));
}

describe("order questions use only words taught so far", () => {
  flat.forEach((lesson, i) => {
    const taught = new Set<string>();
    for (const l of flat.slice(0, i + 1)) for (const w of primerWords(l)) taught.add(w);
    lesson.questions.forEach((q, n) => {
      if (q.type !== "order") return;
      it(`${lesson.id} question ${n + 1} order words appear in this or an earlier primer`, () => {
        const untaught = q.answer.flatMap(wordsOf).filter((w) => !taught.has(w));
        expect(untaught, "words not yet taught").toEqual([]);
      });
    });
  });
});

describe("lessons that teach no word order have no order questions", () => {
  // Sounds and tones have no ordering rule to test.
  for (const id of ["gs-1"]) {
    it(`${id} has no order questions`, () => {
      const lesson = flat.find((l) => l.id === id)!;
      expect(lesson.questions.filter((q) => q.type === "order")).toEqual([]);
    });
  }
});

describe("answers are not handed over by the prompt", () => {
  const letters = (s: string) => s.normalize("NFC").toLowerCase();
  for (const lesson of flat) {
    lesson.questions.forEach((q, n) => {
      if (q.type === "order") return;
      const answer = q.type === "blank" ? q.answer : q.choices[q.answer]!;
      it(`${lesson.id} question ${n + 1} answer is not already inside the prompt`, () => {
        // "Which verb does kíkà come from? kà" is solved by reading the prompt.
        if (answer.length < 2 || /^\d+$/.test(answer)) return;
        const inWord = wordsOf(q.prompt).some((w) => w !== letters(answer) && w.includes(letters(answer)));
        expect(inWord).toBe(false);
      });
    });
  }
});

describe("choices are not just spellings of one word", () => {
  // When every choice has the same letters and differs only by tone marks or dots, the most
  // fully marked one wins without any grammar. Sounds and tones (gs-1) are about exactly this,
  // so it is exempt.
  const base = (s: string) => s.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
  const audited = flat.filter((l) => l.id !== "gs-1");
  for (const lesson of audited) {
    lesson.questions.forEach((q, n) => {
      if (q.type === "order") return;
      it(`${lesson.id} question ${n + 1} offers real alternatives, not tone variants`, () => {
        expect(new Set(q.choices.map(base)).size).toBeGreaterThan(1);
      });
    });
  }
});
