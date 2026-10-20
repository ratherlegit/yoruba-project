import type { TransformKind } from "@/content/transforms";
import type { NumbersKind } from "./numbers-practice";
import type { ToneMode } from "./tone-practice";
import type { TransformMode, TransformResult } from "./transform-grade";

export type Tally = { right: number; close: number; wrong: number; total: number };

// Counts and ids only. The transform key is `${mode}:${id}` so each item counts once per mode.
export type Stats = {
  tone: Record<ToneMode, { answered: number; correct: number }>;
  proverbs: Record<string, { correct: boolean }>;
  transform: Record<string, { kind: TransformKind; mode: TransformMode; result: TransformResult }>;
  numbers: { steps: Record<string, { best: number }>; kinds: Record<NumbersKind, { answered: number; correct: number }> };
  days: string[];
};

const TONE_MODES: ToneMode[] = ["words", "sentences", "sounds"];
const NUMBERS_KINDS: NumbersKind[] = ["to-yoruba", "to-numeral", "counting", "hear"];
const KINDS: TransformKind[] = ["negative", "question", "future", "past"];
const MODES: TransformMode[] = ["easy", "advanced"];
const RESULTS: TransformResult[] = ["right", "close", "wrong"];
const MAX_DAYS = 400;
const KEY = "yp:stats:v1";
const DAY = /^\d{4}-\d{2}-\d{2}$/;

const emptyTone = (): Stats["tone"] => ({
  words: { answered: 0, correct: 0 },
  sentences: { answered: 0, correct: 0 },
  sounds: { answered: 0, correct: 0 },
});

const emptyNumbers = (): Stats["numbers"] => ({
  steps: {},
  kinds: {
    "to-yoruba": { answered: 0, correct: 0 },
    "to-numeral": { answered: 0, correct: 0 },
    counting: { answered: 0, correct: 0 },
    hear: { answered: 0, correct: 0 },
  },
});

export const emptyStats: Stats = { tone: emptyTone(), proverbs: {}, transform: {}, numbers: emptyNumbers(), days: [] };

function defaultStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const isCount = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0;

export function loadStats(storage: Storage | null = defaultStorage()): Stats {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return emptyStats;
    const v: unknown = JSON.parse(raw);
    if (!isObject(v)) return emptyStats;
    const tone = emptyTone();
    if (isObject(v.tone)) {
      for (const m of TONE_MODES) {
        const t = v.tone[m];
        if (isObject(t) && isCount(t.answered) && isCount(t.correct)) tone[m] = { answered: t.answered, correct: t.correct };
      }
    }
    const proverbs: Stats["proverbs"] = {};
    if (isObject(v.proverbs)) {
      for (const [id, p] of Object.entries(v.proverbs)) {
        if (isObject(p) && typeof p.correct === "boolean") proverbs[id] = { correct: p.correct };
      }
    }
    const transform: Stats["transform"] = {};
    if (isObject(v.transform)) {
      for (const [key, t] of Object.entries(v.transform)) {
        if (
          isObject(t) &&
          KINDS.includes(t.kind as TransformKind) &&
          MODES.includes(t.mode as TransformMode) &&
          RESULTS.includes(t.result as TransformResult)
        ) {
          transform[key] = { kind: t.kind as TransformKind, mode: t.mode as TransformMode, result: t.result as TransformResult };
        }
      }
    }
    const numbers = emptyNumbers();
    if (isObject(v.numbers)) {
      if (isObject(v.numbers.steps)) {
        for (const [id, st] of Object.entries(v.numbers.steps)) {
          if (isObject(st) && typeof st.best === "number" && Number.isFinite(st.best) && st.best >= 0 && st.best <= 1) {
            numbers.steps[id] = { best: st.best };
          }
        }
      }
      if (isObject(v.numbers.kinds)) {
        for (const k of NUMBERS_KINDS) {
          const t = v.numbers.kinds[k];
          if (isObject(t) && isCount(t.answered) && isCount(t.correct)) numbers.kinds[k] = { answered: t.answered, correct: t.correct };
        }
      }
    }
    const days = Array.isArray(v.days)
      ? [...new Set(v.days.filter((x): x is string => typeof x === "string" && DAY.test(x)))].sort().slice(-MAX_DAYS)
      : [];
    return { tone, proverbs, transform, numbers, days };
  } catch {
    return emptyStats;
  }
}

export function saveStats(s: Stats, storage: Storage | null = defaultStorage()): void {
  try {
    storage?.setItem(KEY, JSON.stringify(s));
  } catch {
    // Storage can be blocked (private windows). Stats simply will not persist.
  }
}

export function dayKey(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function withDay(s: Stats, now: Date): Stats {
  const k = dayKey(now);
  if (s.days.includes(k)) return s;
  return { ...s, days: [...s.days, k].sort().slice(-MAX_DAYS) };
}

export function recordToneAnswer(s: Stats, mode: ToneMode, correct: boolean, now: Date = new Date()): Stats {
  const prev = s.tone[mode];
  const next: Stats = {
    ...s,
    tone: { ...s.tone, [mode]: { answered: prev.answered + 1, correct: prev.correct + (correct ? 1 : 0) } },
  };
  return withDay(next, now);
}

export function recordProverbAnswer(s: Stats, id: string, correct: boolean, now: Date = new Date()): Stats {
  if (s.proverbs[id]) return withDay(s, now);
  return withDay({ ...s, proverbs: { ...s.proverbs, [id]: { correct } } }, now);
}

export function recordTransformResult(
  s: Stats, id: string, kind: TransformKind, mode: TransformMode, result: TransformResult, now: Date = new Date(),
): Stats {
  const key = `${mode}:${id}`;
  if (s.transform[key]) return withDay(s, now);
  return withDay({ ...s, transform: { ...s.transform, [key]: { kind, mode, result } } }, now);
}

export function recordNumbersAnswer(s: Stats, kind: NumbersKind, correct: boolean, now: Date = new Date()): Stats {
  const prev = s.numbers.kinds[kind];
  const next: Stats = {
    ...s,
    numbers: { ...s.numbers, kinds: { ...s.numbers.kinds, [kind]: { answered: prev.answered + 1, correct: prev.correct + (correct ? 1 : 0) } } },
  };
  return withDay(next, now);
}

export function recordNumbersRound(s: Stats, stepId: string, score: number, now: Date = new Date()): Stats {
  if (!Number.isFinite(score) || score < 0 || score > 1) return s;
  const best = Math.max(score, s.numbers.steps[stepId]?.best ?? 0);
  return withDay({ ...s, numbers: { ...s.numbers, steps: { ...s.numbers.steps, [stepId]: { best } } } }, now);
}

export function numbersSummary(s: Stats): { stepsDone: number; steps: Record<string, number>; kinds: Stats["numbers"]["kinds"] } {
  const steps = Object.fromEntries(Object.entries(s.numbers.steps).map(([id, v]) => [id, v.best]));
  return { stepsDone: Object.keys(steps).length, steps, kinds: s.numbers.kinds };
}

export function accuracy(correct: number, answered: number): number | null {
  return answered > 0 ? Math.round((correct / answered) * 100) : null;
}

export const toneSummary = (s: Stats): Stats["tone"] => s.tone;

export function proverbSummary(s: Stats): { guessed: number; right: number } {
  const all = Object.values(s.proverbs);
  return { guessed: all.length, right: all.filter((p) => p.correct).length };
}

const tally = (): Tally => ({ right: 0, close: 0, wrong: 0, total: 0 });

export function transformSummary(s: Stats): { byKind: Record<TransformKind, Tally>; byMode: Record<TransformMode, Tally> } {
  const byKind = { negative: tally(), question: tally(), future: tally(), past: tally() };
  const byMode = { easy: tally(), advanced: tally() };
  for (const t of Object.values(s.transform)) {
    for (const bucket of [byKind[t.kind], byMode[t.mode]]) {
      bucket[t.result] += 1;
      bucket.total += 1;
    }
  }
  return { byKind, byMode };
}

export function practiceAnswers(s: Stats): { answered: number; correct: number } {
  let answered = 0;
  let correct = 0;
  for (const t of Object.values(s.tone)) {
    answered += t.answered;
    correct += t.correct;
  }
  for (const t of Object.values(s.numbers.kinds)) {
    answered += t.answered;
    correct += t.correct;
  }
  const p = proverbSummary(s);
  answered += p.guessed;
  correct += p.right;
  for (const t of Object.values(s.transform)) {
    answered += 1;
    if (t.result === "right") correct += 1;
  }
  return { answered, correct };
}

// Lessons and vocab topics are recorded in their own stores with an ISO completion time.
// This folds those days in so any activity counts as a practice day, without writing them.
export function withExtraDays(s: Stats, isoDates: string[]): Stats {
  const extra = isoDates
    .map((iso) => new Date(iso))
    .filter((d) => !Number.isNaN(d.getTime()))
    .map(dayKey);
  if (extra.length === 0) return s;
  return { ...s, days: [...new Set([...s.days, ...extra])].sort().slice(-MAX_DAYS) };
}

export const practiceDays = (s: Stats): number => s.days.length;

export function currentRun(s: Stats, now: Date = new Date()): number {
  const have = new Set(s.days);
  const step = (d: Date, by: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + by, 12);
  let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  if (!have.has(dayKey(cursor))) cursor = step(cursor, -1);
  let run = 0;
  while (have.has(dayKey(cursor))) {
    run += 1;
    cursor = step(cursor, -1);
  }
  return run;
}
