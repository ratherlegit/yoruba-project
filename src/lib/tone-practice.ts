import type { ConsonantSet } from "@/content/sound-focus";
import type { MinimalPair } from "@/content/sounds";
import type { ToneTwinEntry } from "@/content/tone-twins";
import type { VocabLevel, VocabWord } from "@/content/vocab/types";
import { blankOf, locateBlank } from "@/content/vocab/validate";
import { audioUrlFor } from "./audio";
import { seededShuffle } from "./shuffle";

export const TONE_ROUND_SIZE = 10;

export type ToneMode = "words" | "sentences" | "sounds";
export type ToneSources = { twins: ToneTwinEntry[]; vocab: VocabLevel[]; pairs: MinimalPair[]; sets: ConsonantSet[] };
export type ToneQuestion = {
  id: string;
  mode: ToneMode;
  audioText: string; // the word (words mode) or the whole sentence (sentences mode)
  prompt: string | null; // sentences mode: the sentence with exactly one ___ where the word goes
  english: string | null; // sentences mode: the sentence translation
  sentence: string | null; // sentences mode: the full sentence as written, capitals included
  choices: string[];
  answer: string;
};

const defaultHasAudio = (text: string) => audioUrlFor(text) !== null;
const key = (s: string) => s.normalize("NFC").toLowerCase();
const nfc = (s: string) => s.normalize("NFC");

// Words mode: vocab words with twins, then words of Sound Bank tone pairs (each needs a clip).
// Sentences mode: only vocab words whose own sentence has a clip and whose blank is the word itself,
// because a twin has to be able to replace the blanked text.
// Sounds mode: the words of the Sound Bank consonant contrast sets, each needing a clip, in a set with at
// least two clips.
export function buildToneRound(
  mode: ToneMode,
  sources: ToneSources,
  seed: string,
  hasAudio: (text: string) => boolean = defaultHasAudio,
  max: number = TONE_ROUND_SIZE,
): ToneQuestion[] {
  if (mode === "sounds") return seededShuffle(soundsQuestions(sources.sets, hasAudio), seed).slice(0, max);

  const vocab = new Map<string, VocabWord>();
  for (const l of sources.vocab) for (const t of l.topics) for (const w of t.words) vocab.set(w.id, w);

  const out: ToneQuestion[] = [];
  const taken = new Set<string>();

  for (const e of sources.twins) {
    const w = vocab.get(e.vocabId);
    if (!w) continue;
    const answer = nfc(w.yoruba);
    const choices = [answer, ...e.twins.map((t) => nfc(t.yoruba))];
    if (mode === "words") {
      if (!hasAudio(answer)) continue;
      taken.add(key(answer));
      out.push({ id: `words:${key(answer)}`, mode, audioText: answer, prompt: null, english: null, sentence: null, choices, answer });
      continue;
    }
    const sentence = nfc(w.sentence.yoruba);
    if (key(blankOf(w)) !== key(w.yoruba) || !hasAudio(sentence)) continue;
    const loc = locateBlank(sentence, blankOf(w));
    if (loc.start === -1 || loc.count !== 1) continue;
    const prompt = `${sentence.slice(0, loc.start)}___${sentence.slice(loc.end)}`;
    out.push({ id: `sentences:${key(answer)}`, mode, audioText: sentence, prompt, english: w.sentence.english, sentence, choices, answer });
  }

  if (mode === "words") {
    for (const p of sources.pairs) {
      if (p.contrast !== "tone") continue;
      const playable = p.words.filter((x) => hasAudio(x.yoruba));
      if (playable.length < 2) continue;
      const choices = p.words.map((x) => nfc(x.yoruba));
      for (const x of playable) {
        const answer = nfc(x.yoruba);
        if (taken.has(key(answer))) continue;
        taken.add(key(answer));
        out.push({ id: `words:${key(answer)}`, mode, audioText: answer, prompt: null, english: null, sentence: null, choices, answer });
      }
    }
  }

  return seededShuffle(out, seed).slice(0, max);
}

function soundsQuestions(sets: ConsonantSet[], hasAudio: (text: string) => boolean): ToneQuestion[] {
  const out: ToneQuestion[] = [];
  const taken = new Set<string>();
  for (const s of sets) {
    if (s.words.filter((w) => hasAudio(w.yoruba)).length < 2) continue;
    const choices = s.words.map((w) => nfc(w.yoruba));
    for (const answer of choices) {
      if (!hasAudio(answer) || taken.has(key(answer))) continue;
      taken.add(key(answer));
      out.push({ id: `sounds:${key(answer)}`, mode: "sounds", audioText: answer, prompt: null, english: null, sentence: null, choices, answer });
    }
  }
  return out;
}
