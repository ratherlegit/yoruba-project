import { accuracy, practiceAnswers, practiceDays, type Stats } from "./stats";

export type StripFigure = { label: string; value: string };

// The short figures on the landing page. A figure with no data is left out, so a
// new visitor gets an empty list rather than zeros.
export function buildStrip(input: {
  lessonsDone: number;
  lessonsTotal: number;
  topicsDone: number;
  topicsTotal: number;
  stats: Stats;
  now?: Date;
}): StripFigure[] {
  const out: StripFigure[] = [];
  if (input.lessonsDone > 0) out.push({ label: "Lessons done", value: `${input.lessonsDone} of ${input.lessonsTotal}` });
  if (input.topicsDone > 0) out.push({ label: "Vocab topics done", value: `${input.topicsDone} of ${input.topicsTotal}` });
  const p = practiceAnswers(input.stats);
  const pct = accuracy(p.correct, p.answered);
  if (pct !== null) out.push({ label: "Practice answers right", value: `${pct}%` });
  const days = practiceDays(input.stats);
  if (days > 0) out.push({ label: "Days practised", value: String(days) });
  return out;
}
