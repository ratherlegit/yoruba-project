import type { Level, LevelId } from "@/content/types";
import type { NumberEntry, NumberPhrase } from "@/content/numbers";
import type { VocabLevel } from "@/content/vocab/types";
import type { MinimalPair, Sound } from "@/content/sounds";
import type { ConsonantSet, ToneCompareRow } from "@/content/sound-focus";
import type { Dialogue } from "@/content/dialogues";
import { audioKey, voiceKey } from "./audio";

// Pick answers that are English sentences or glossed fragments, not Yoruba speech.
const ENGLISH_WORDS = new Set([
  "the", "is", "who", "that", "will", "and", "before", "of", "it", "not", "thing", "food",
  "which", "one", "was", "are", "for", "with", "he", "you", "we", "at", "end", "between", "top", "older", "verb", "high", "pronoun", "things",
]);

export function isSpokenYoruba(text: string): boolean {
  if (/[()+]/.test(text)) return false;
  return !audioKey(text).split(" ").some((w) => ENGLISH_WORDS.has(w));
}

// Every string that should have a pre-generated clip: primer example surfaces,
// the correct choice of each pick question, and the answer sentence of each order question.
// A Listen cell such as "o / ó" holds two words that each get their own clip and button.
export function listenTexts(cell: string): string[] {
  return cell.split(" / ").map((t) => t.trim()).filter(Boolean);
}

export function collectAudioStrings(levels: Level[]): { key: string; text: string }[] {
  const seen = new Map<string, string>();
  const add = (text: string, allowShort = false) => {
    const key = audioKey(text);
    // One-letter strings (a, ẹ, o, ó) are not worth a clip: they are syllables, not words.
    // A Listen table asks for its entries on purpose (the letters and tone marks in Sounds and tones), so it keeps them.
    if (([...key].length > 1 || allowShort) && isSpokenYoruba(text) && !seen.has(key)) seen.set(key, text);
  };
  for (const level of levels) {
    for (const lesson of level.lessons) {
      for (const w of lesson.primer.examples) add(w.surface);
      for (const t of lesson.primer.tables ?? []) {
        if (t.listen !== undefined) for (const row of t.rows) for (const text of listenTexts(row[t.listen]!)) add(text, true);
      }
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

export type NumbersAudioGroup = "number-word" | "number-sentence";

// The Numbers section's words (counting and after-noun forms) and the example sentences of
// step 1. The ten words used to be a vocab topic, so their existing clips are matched by text.
export function collectNumbersAudioStrings(entries: NumberEntry[], phrases: NumberPhrase[] = []): { key: string; text: string; group: NumbersAudioGroup }[] {
  const seen = new Map<string, { text: string; group: NumbersAudioGroup }>();
  const add = (text: string, group: NumbersAudioGroup) => {
    const key = audioKey(text);
    if ([...key].length > 1 && !seen.has(key)) seen.set(key, { text, group });
  };
  for (const e of entries) {
    add(e.yoruba, "number-word");
    for (const a of e.after) add(a, "number-word");
  }
  for (const e of entries) {
    if (e.example) add(e.example.yoruba, "number-sentence");
    if (e.plainExample) add(e.plainExample.yoruba, "number-sentence");
  }
  // Steps 5 and 6 list a phrase such as "ọmọ méjì" with a speaker button, so each needs a clip too.
  for (const p of phrases) add(p.answers[0]!, "number-sentence");
  return [...seen].map(([key, v]) => ({ key, text: v.text, group: v.group }));
}

// Sound Bank example, minimal-pair, tone comparison and consonant set words. Words already listed by grammar or vocab are filtered by the lister.
export function collectSoundAudioStrings(
  sounds: Sound[],
  pairs: MinimalPair[],
  compare: ToneCompareRow[] = [],
  sets: ConsonantSet[] = [],
): { key: string; text: string; group: "sound-word" }[] {
  const seen = new Map<string, string>();
  const add = (text: string) => {
    const key = audioKey(text);
    if ([...key].length > 1 && !seen.has(key)) seen.set(key, text);
  };
  for (const s of sounds) for (const e of s.examples) add(e.yoruba);
  for (const p of pairs) for (const w of p.words) add(w.yoruba);
  for (const r of compare) for (const w of r.words) add(w.yoruba);
  for (const x of sets) for (const w of x.words) add(w.yoruba);
  return [...seen].map(([key, text]) => ({ key, text, group: "sound-word" as const }));
}

export type DialogueAudioGroup = "dialogue-female" | "dialogue-male";

// Every dialogue line, in its speaker's voice. A female line has the plain key (so it reuses any
// clip that already exists for the same text); a male line has the male| key. One-letter
// strings are skipped, as elsewhere.
export function collectDialogueAudioStrings(dialogues: Dialogue[]): { key: string; text: string; group: DialogueAudioGroup }[] {
  const seen = new Map<string, { text: string; group: DialogueAudioGroup }>();
  for (const d of dialogues) {
    for (const l of d.lines) {
      const key = voiceKey(l.yoruba, l.voice);
      if ([...audioKey(l.yoruba)].length > 1 && !seen.has(key)) {
        seen.set(key, { text: l.yoruba, group: l.voice === "male" ? "dialogue-male" : "dialogue-female" });
      }
    }
  }
  return [...seen].map(([key, v]) => ({ key, text: v.text, group: v.group }));
}
