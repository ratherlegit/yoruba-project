import { describe, expect, it } from "vitest";
import { LEVELS } from "./levels";

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
