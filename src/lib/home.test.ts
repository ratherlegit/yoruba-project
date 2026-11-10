import { describe, expect, it } from "vitest";
import { LEVELS } from "@/content/levels";
import { allVocabWords } from "@/content/vocab";
import { audioUrlFor } from "./audio";
import { MAX_SENTENCE_WORDS, nextLesson, wordOfTheDay } from "./home";

const all = LEVELS.flatMap((l) => l.lessons);

describe("nextLesson", () => {
  it("starts at the first lesson for a new learner", () => {
    const n = nextLesson(LEVELS, {})!;
    expect(n.lesson.id).toBe(all[0]!.id);
    expect(n.started).toBe(false);
  });
  it("skips completed lessons, in course order", () => {
    const n = nextLesson(LEVELS, { [all[0]!.id]: true, [all[1]!.id]: true })!;
    expect(n.lesson.id).toBe(all[2]!.id);
    expect(n.started).toBe(true);
  });
  it("returns null when every lesson is done", () => {
    expect(nextLesson(LEVELS, Object.fromEntries(all.map((l) => [l.id, true])))).toBeNull();
  });
});

describe("wordOfTheDay", () => {
  const words = allVocabWords();
  it("is the same word all day and can change the next day", () => {
    const a = wordOfTheDay(words, new Date(2026, 10, 10, 1));
    expect(wordOfTheDay(words, new Date(2026, 10, 10, 23))).toBe(a);
    expect(wordOfTheDay(words, new Date(2026, 10, 11, 9))).not.toBe(a);
  });
  it("never picks a number or a word with a digit", () => {
    for (let d = 1; d <= 60; d++) {
      const w = wordOfTheDay(words, new Date(2026, 0, d))!;
      expect(w.pos).not.toBe("number");
      expect(w.yoruba + w.english).not.toMatch(/\d/);
    }
  });
  it("always has a very short example sentence that can be heard", () => {
    for (let d = 1; d <= 60; d++) {
      const w = wordOfTheDay(words, new Date(2026, 0, d))!;
      expect(w.sentence.yoruba.trim().split(/\s+/).length).toBeLessThanOrEqual(MAX_SENTENCE_WORDS);
      expect(audioUrlFor(w.sentence.yoruba)).not.toBeNull();
    }
  });
  it("returns null when there are no words", () => {
    expect(wordOfTheDay([], new Date())).toBeNull();
  });
});
