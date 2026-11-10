import type { Level, Lesson } from "@/content/types";
import type { VocabWord } from "@/content/vocab/types";
import { audioUrlFor } from "./audio";

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

// One word per local calendar day, the same all day. Only words with a very simple example
// sentence (at most MAX_SENTENCE_WORDS words) and recordings of both are used, so the day's word
// and sentence can be heard; numbers and anything with a digit are skipped.
export const MAX_SENTENCE_WORDS = 5;
const wordCount = (t: string) => t.trim().split(/\s+/).length;
export function wordOfTheDay(words: VocabWord[], now: Date = new Date()): VocabWord | null {
  const ok = words.filter((w) => w.pos !== "number" && !/\d/.test(w.yoruba + w.english));
  const simple = ok.filter((w) => wordCount(w.sentence.yoruba) <= MAX_SENTENCE_WORDS);
  const heard = simple.filter((w) => audioUrlFor(w.yoruba) && audioUrlFor(w.sentence.yoruba));
  const pool = heard.length > 0 ? heard : simple.length > 0 ? simple : ok;
  if (pool.length === 0) return null;
  const day = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86_400_000);
  return pool[day % pool.length]!;
}
