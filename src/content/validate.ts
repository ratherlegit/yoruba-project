import type { Lesson, Question, WordBreakdown } from "./types";

export const QUESTIONS_PER_LESSON = 8;
const EM_DASH = "\u2014";
const ws = (s: string): string => s.replace(/\s+/g, "");

function* strings(v: unknown): Generator<string> {
  if (typeof v === "string") yield v;
  else if (Array.isArray(v)) for (const x of v) yield* strings(x);
  else if (v && typeof v === "object") for (const x of Object.values(v)) yield* strings(x);
}

export function validateBreakdown(w: WordBreakdown, ruleIds: Set<string>): string[] {
  const errors: string[] = [];
  const err = (m: string) => errors.push(`word "${w.id}": ${m}`);
  const joined = ws(w.parts.map((p) => p.text).join(""));

  if (w.parts.length === 0) err("has no parts");

  if (w.steps.length === 0) {
    if (joined !== ws(w.surface)) {
      err(`parts joined ("${joined}") differ from surface ("${w.surface}") and no steps explain the change`);
    }
  } else {
    const first = w.steps[0]!;
    if (first.kind !== "join") err("first step must be a join");
    else if (ws(first.result) !== joined) err(`join step result "${first.result}" does not match the parts "${joined}"`);
    const last = w.steps[w.steps.length - 1]!;
    if (last.result !== w.surface) err(`last step "${last.result}" does not equal the surface "${w.surface}"`);
    for (const s of w.steps) {
      if (s.kind !== "join" && !s.ruleId) err(`step "${s.result}" needs a ruleId`);
      if (s.ruleId && !ruleIds.has(s.ruleId)) err(`ruleId "${s.ruleId}" does not resolve to a rule in this lesson`);
    }
  }

  if (w.confidence === "needs-review" && !w.note) err("needs-review words need a note naming the doubt");
  return errors;
}

function validateQuestion(q: Question, n: number, wordIds: Set<string>): string[] {
  const errors: string[] = [];
  const err = (m: string) => errors.push(`question ${n + 1}: ${m}`);
  if (q.type === "blank") {
    if (!q.prompt.includes("___")) err('blank prompt needs a "___" gap');
    if (!q.choices.includes(q.answer)) err("answer is not among the choices");
    if (new Set(q.choices).size !== q.choices.length) err("choices contain duplicates");
  } else if (q.type === "pick") {
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.choices.length) err("answer index is out of range");
    if (new Set(q.choices).size !== q.choices.length) err("choices contain duplicates");
  } else {
    const a = [...q.answer].sort().join("|");
    const b = [...q.words].sort().join("|");
    if (a !== b) err("order answer is not a permutation of words");
    if (q.answer.length < 2) err("order answer needs at least two words");
  }
  if ((q.type === "blank" || q.type === "pick") && q.wordId && !wordIds.has(q.wordId)) {
    err(`wordId "${q.wordId}" does not match any example`);
  }
  return errors;
}

export function validateLesson(lesson: Lesson): string[] {
  const errors: string[] = [];
  const err = (m: string) => errors.push(`${lesson.id}: ${m}`);

  for (const s of strings(lesson)) {
    if (s !== s.normalize("NFC")) err(`string is not NFC: "${s}"`);
    if (s.includes(EM_DASH)) err(`string contains an em dash: "${s}"`);
  }
  if (lesson.sources.length === 0) err("sources is empty");
  if (lesson.questions.length !== QUESTIONS_PER_LESSON) {
    err(`expected ${QUESTIONS_PER_LESSON} questions, found ${lesson.questions.length}`);
  }
  if (lesson.primer.examples.length < 3) err("needs at least 3 examples");

  const ruleIds = new Set(lesson.primer.rules.map((r) => r.id));
  const wordIds = new Set(lesson.primer.examples.map((e) => e.id));
  for (const w of lesson.primer.examples) for (const e of validateBreakdown(w, ruleIds)) err(e);
  lesson.questions.forEach((q, n) => {
    for (const e of validateQuestion(q, n, wordIds)) err(e);
  });
  return errors;
}
