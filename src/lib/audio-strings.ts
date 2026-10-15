import type { Level, LevelId } from "@/content/types";
import type { VocabLevel } from "@/content/vocab/types";
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

export type VocabAudioGroup = "vocab-word" | "vocab-sentence";

// Vocab words and their example sentences. Unlike grammar strings these are all
// real Yoruba entries, so the English-word filter is not applied. Words come
// before sentences; one-letter keys are still skipped.
export function collectVocabAudioStrings(
  levels: VocabLevel[],
): { key: string; text: string; group: VocabAudioGroup; level: LevelId }[] {
  const seen = new Map<string, { text: string; group: VocabAudioGroup; level: LevelId }>();
  const add = (text: string, group: VocabAudioGroup, level: LevelId) => {
    const key = audioKey(text);
    if ([...key].length > 1 && !seen.has(key)) seen.set(key, { text, group, level });
  };
  // Each item records the first level that uses it, so a batch can be limited to chosen levels.
  const words = levels.flatMap((l) => l.topics.flatMap((t) => t.words.map((w) => ({ w, level: l.id }))));
  for (const { w, level } of words) add(w.yoruba, "vocab-word", level);
  for (const { w, level } of words) add(w.sentence.yoruba, "vocab-sentence", level);
  return [...seen].map(([key, v]) => ({ key, text: v.text, group: v.group, level: v.level }));
}
