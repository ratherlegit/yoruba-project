import type { NumberEntry, NumberPhrase, NumberStep } from "@/content/numbers";
import { seededShuffle } from "./shuffle";
import { gradeTransform, type TransformMode, type TransformResult } from "./transform-grade";

export const ROUND_SIZE = 8;

export type NumbersKind = "to-yoruba" | "to-numeral" | "counting" | "hear";

export type NumbersQuestion = {
  id: string;
  kind: NumbersKind;
  prompt: string;
  answers: string[];
  model: string; // the answer shown after checking
  build?: string;
  audioText?: string;
};

export type NumbersData = { entries: NumberEntry[]; phrases: NumberPhrase[]; steps: NumberStep[] };

const unique = (xs: string[]) => [...new Set(xs)];

export function buildNumbersRound(
  stepId: string,
  data: NumbersData,
  seed: string,
  hasClip?: (text: string) => boolean,
  size: number = ROUND_SIZE,
): NumbersQuestion[] {
  const step = data.steps.find((s) => s.id === stepId);
  if (!step) return [];
  const all: NumbersQuestion[] = [];

  for (const id of step.entryIds) {
    const n = data.entries.find((x) => x.id === id);
    if (!n) continue;
    all.push({
      id: `${n.id}:to-yoruba`, kind: "to-yoruba", prompt: `Type ${n.value} in Yoruba`,
      answers: unique([...n.answers, ...n.after]), model: n.yoruba, ...(n.build ? { build: n.build } : {}),
    });
    all.push({
      id: `${n.id}:to-numeral`, kind: "to-numeral", prompt: `What number is ${n.yoruba}?`,
      answers: [String(n.value)], model: String(n.value), ...(n.build ? { build: n.build } : {}),
    });
    if (hasClip?.(n.yoruba)) {
      all.push({
        id: `${n.id}:hear`, kind: "hear", prompt: "Listen and type the number",
        answers: [String(n.value)], model: String(n.value), audioText: n.yoruba,
        ...(n.build ? { build: n.build } : {}),
      });
    }
  }

  for (const id of step.phraseIds) {
    const p = data.phrases.find((x) => x.id === id);
    if (!p) continue;
    all.push({
      id: `${p.id}:counting`, kind: "counting", prompt: `Say '${p.prompt}' in Yoruba`,
      answers: p.answers, model: p.answers[0]!,
    });
    if (p.numeral) {
      all.push({
        id: `${p.id}:to-numeral`, kind: "to-numeral", prompt: `What price is ${p.answers[0]}?`,
        answers: [p.numeral], model: p.numeral,
      });
    }
  }

  return seededShuffle(all, `${stepId}|${seed}`).slice(0, size);
}

const digits = (s: string) => s.replace(/[\s,₦]/g, "");
// Hyphens in the -ún and -án forms are written inconsistently (márùn-ún, marunun), so they are ignored.
const noHyphen = (s: string) => s.replace(/-/g, "");

export function gradeNumbers(input: string, q: NumbersQuestion, mode: TransformMode): TransformResult {
  if (q.kind === "to-numeral" || q.kind === "hear") {
    const d = digits(input);
    return d !== "" && d === q.answers[0] ? "right" : "wrong";
  }
  return gradeTransform(noHyphen(input), q.answers.map(noHyphen), mode);
}
