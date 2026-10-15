import type { MinimalPair } from "@/content/sounds";
import { audioUrlFor } from "./audio";
import { seededShuffle } from "./shuffle";

export type PracticeQuestion = { id: string; audioText: string; choices: string[]; answer: string };

const defaultHasAudio = (text: string) => audioUrlFor(text) !== null;

// One question per word that has a clip, in a pair that has at least two such words.
// Choices are every spelling in the pair, so only the ear can tell them apart.
export function buildPractice(
  pairs: MinimalPair[],
  seed: string,
  hasAudio: (text: string) => boolean = defaultHasAudio,
  max = 10,
): PracticeQuestion[] {
  const out: PracticeQuestion[] = [];
  for (const p of pairs) {
    const playable = p.words.filter((x) => hasAudio(x.yoruba));
    if (playable.length < 2) continue;
    const choices = p.words.map((x) => x.yoruba);
    for (const word of playable) out.push({ id: `${p.id}:${word.yoruba}`, audioText: word.yoruba, choices, answer: word.yoruba });
  }
  return seededShuffle(out, seed).slice(0, max);
}
