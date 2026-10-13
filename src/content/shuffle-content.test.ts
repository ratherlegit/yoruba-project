import { describe, expect, it } from "vitest";
import { shuffledChoices } from "@/components/ChoiceQuestion";
import { seededShuffleAvoiding } from "@/lib/shuffle";
import { LEVELS } from "./levels";

const lessons = LEVELS.flatMap((l) => l.lessons);

describe("shuffled content", () => {
  it("never shows an order bank in the answer order", () => {
    for (const lesson of lessons) {
      lesson.questions.forEach((q, i) => {
        if (q.type !== "order") return;
        const bank = seededShuffleAvoiding(
          q.words.map((w, k) => ({ w, k })),
          `${i}:${q.answer.join("")}`,
          q.answer.map((a) => a.toLowerCase()),
          (b) => b.w.toLowerCase(),
        ).map((b) => b.w.toLowerCase());
        const answer = q.answer.map((a) => a.toLowerCase());
        if (new Set(answer).size > 1) expect(bank, `${lesson.id} q${i}`).not.toEqual(answer);
      });
    }
  });

  function positions(lesson: (typeof lessons)[number]): number[] {
    const out: number[] = [];
    for (const q of lesson.questions) {
      if (q.type === "order") continue;
      const answer = q.type === "blank" ? q.answer : q.choices[q.answer]!;
      out.push(shuffledChoices(q.prompt, q.choices, answer).indexOf(answer));
    }
    return out;
  }

  it("puts the correct answer first in well under half of the choice questions", () => {
    const all = lessons.flatMap(positions);
    const first = all.filter((p) => p === 0).length;
    expect(all.length).toBeGreaterThan(50);
    expect(first / all.length).toBeLessThan(0.5);
  });

  it("varies the answer position within every lesson that has 3 or more choice questions", () => {
    for (const lesson of lessons) {
      const p = positions(lesson);
      if (p.length >= 3) expect(new Set(p).size, lesson.id).toBeGreaterThanOrEqual(2);
    }
  });
});
