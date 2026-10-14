import { describe, expect, it } from "vitest";
import { LEVELS } from "./levels";

// Patterns for questions that test vocabulary or letter lookup instead of a lesson's rule.
const BANNED: { name: string; re: RegExp }[] = [
  { name: "word-meaning lookup", re: /^which (short )?(word|pronoun|noun|verb)\b.* means\b/i },
  { name: "sound-to-letter lookup", re: /sound in .* is written/i },
  { name: "word-contains-sound lookup", re: /^which word contains the sound\b/i },
  { name: "spelling shows the sound", re: /^which spelling shows\b/i },
];

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
