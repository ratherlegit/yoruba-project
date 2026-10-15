import { mkdirSync, writeFileSync } from "node:fs";
import { LEVELS } from "../src/content/levels";
import { VOCAB_LEVELS } from "../src/content/vocab";
import { collectAudioStrings, collectVocabAudioStrings } from "../src/lib/audio-strings";

type Item = { key: string; text: string; group: "grammar" | "vocab-word" | "vocab-sentence"; level?: string };

const grammar: Item[] = collectAudioStrings(LEVELS).map((s) => ({ ...s, group: "grammar" as const }));
const seen = new Set(grammar.map((s) => s.key));
// Grammar wins over a vocab duplicate.
const vocab: Item[] = collectVocabAudioStrings(VOCAB_LEVELS).filter((s) => !seen.has(s.key));
const strings = [...grammar, ...vocab];

mkdirSync("tools/audio", { recursive: true });
writeFileSync("tools/audio/strings.json", JSON.stringify(strings, null, 2) + "\n");
const count = (g: Item["group"]) => strings.filter((s) => s.group === g).length;
console.log(
  `Wrote tools/audio/strings.json (${strings.length} strings: ${count("grammar")} grammar, ${count("vocab-word")} vocab-word, ${count("vocab-sentence")} vocab-sentence)`,
);
