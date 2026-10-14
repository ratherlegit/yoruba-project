import type { Level } from "@/content/types";
import { audioKey } from "./audio";

// Pick answers that are English sentences or glossed fragments, not Yoruba speech.
const ENGLISH_WORDS = new Set([
  "the", "is", "who", "that", "will", "and", "before", "of", "it", "not", "thing", "food",
  "which", "one", "was", "are", "for", "with", "he", "you", "we", "at", "end", "between",
]);

export function isSpokenYoruba(text: string): boolean {
  if (/[()+]/.test(text)) return false;
  return !audioKey(text).split(" ").some((w) => ENGLISH_WORDS.has(w));
}

// Every string that should have a pre-generated clip: primer example surfaces,
// the correct choice of each pick question, and the answer sentence of each order question.
export function collectAudioStrings(levels: Level[]): { key: string; text: string }[] {
  const seen = new Map<string, string>();
  const add = (text: string) => {
    const key = audioKey(text);
    // One-letter strings (a, ẹ, o, ó) are not worth a clip: they are syllables, not words.
    if ([...key].length > 1 && isSpokenYoruba(text) && !seen.has(key)) seen.set(key, text);
  };
  for (const level of levels) {
    for (const lesson of level.lessons) {
      for (const w of lesson.primer.examples) add(w.surface);
      for (const q of lesson.questions) {
        if (q.type === "pick") add(q.choices[q.answer]!);
        else if (q.type === "order") add(q.answer.join(" "));
      }
    }
  }
  return [...seen].map(([key, text]) => ({ key, text }));
}
