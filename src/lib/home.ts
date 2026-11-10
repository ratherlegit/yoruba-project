import type { Level, Lesson } from "@/content/types";
import type { VocabWord } from "@/content/vocab/types";
import { audioUrlFor } from "./audio";
import { dayKey } from "./stats";

export type NextLesson = { levelId: string; lesson: Lesson; started: boolean } | null;

// The first lesson, in course order, that has not been completed. Null once every lesson is done.
export function nextLesson(levels: Level[], completed: Record<string, unknown>): NextLesson {
  let started = false;
  for (const lv of levels) {
    for (const lesson of lv.lessons) {
      if (!completed[lesson.id]) return { levelId: lv.id, lesson, started };
      started = true;
    }
  }
  return null;
}

// One word per local calendar day, the same all day. Words with a recording come first, so the
// word can be heard; numbers and anything with a digit are skipped.
export function wordOfTheDay(words: VocabWord[], now: Date = new Date()): VocabWord | null {
  const ok = words.filter((w) => w.pos !== "number" && !/\d/.test(w.yoruba + w.english));
  const heard = ok.filter((w) => audioUrlFor(w.yoruba));
  const pool = heard.length > 0 ? heard : ok;
  if (pool.length === 0) return null;
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000);
  return pool[day % pool.length]!;
}

// The last seven days, oldest first, each true if the learner practised that day.
export function lastSevenDays(days: string[], now: Date = new Date()): boolean[] {
  const have = new Set(days);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i), 12);
    return have.has(dayKey(d));
  });
}
