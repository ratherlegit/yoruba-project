import { mkdirSync, writeFileSync } from "node:fs";
import { LEVELS } from "../src/content/levels";
import { VOCAB_LEVELS } from "../src/content/vocab";
import { SOUNDS, MINIMAL_PAIRS } from "../src/content/sounds";
import { CONSONANT_SETS, TONE_COMPARE } from "../src/content/sound-focus";
import { NUMBERS } from "../src/content/numbers";
import { collectAudioStrings, collectNumbersAudioStrings, collectSoundAudioStrings, collectVocabAudioStrings } from "../src/lib/audio-strings";

type Item = { key: string; text: string; group: "grammar" | "vocab-word" | "vocab-sentence" | "number-word" | "number-sentence" | "sound-word"; level?: string };

const grammar: Item[] = collectAudioStrings(LEVELS).map((s) => ({ ...s, group: "grammar" as const }));
const seen = new Set(grammar.map((s) => s.key));
// Grammar wins over a vocab duplicate.
const vocab: Item[] = collectVocabAudioStrings(VOCAB_LEVELS).filter((s) => !seen.has(s.key));
const seenAfterVocab = new Set([...grammar, ...vocab].map((s) => s.key));
const numbers: Item[] = collectNumbersAudioStrings(NUMBERS).filter((s) => !seenAfterVocab.has(s.key));
const seenAfterNumbers = new Set([...seenAfterVocab, ...numbers.map((s) => s.key)]);
const sound: Item[] = collectSoundAudioStrings(SOUNDS, MINIMAL_PAIRS, TONE_COMPARE, CONSONANT_SETS).filter((s) => !seenAfterNumbers.has(s.key));
const strings = [...grammar, ...vocab, ...numbers, ...sound];

mkdirSync("tools/audio", { recursive: true });
writeFileSync("tools/audio/strings.json", JSON.stringify(strings, null, 2) + "\n");
const count = (g: Item["group"]) => strings.filter((s) => s.group === g).length;
console.log(
  `Wrote tools/audio/strings.json (${strings.length} strings: ${count("grammar")} grammar, ${count("vocab-word")} vocab-word, ${count("vocab-sentence")} vocab-sentence, ${count("number-word")} number-word, ${count("number-sentence")} number-sentence, ${count("sound-word")} sound-word)`,
);
