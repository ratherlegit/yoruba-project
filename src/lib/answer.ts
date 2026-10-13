import { cleanAnswer, stripMarks, stripTones } from "./normalize";

export type AnswerKind = "correct" | "tone" | "mark" | "wrong";

export function checkAnswer(given: string, expected: string): AnswerKind {
  const g = cleanAnswer(given);
  const e = cleanAnswer(expected);
  if (g === e) return "correct";
  if (stripTones(g) === stripTones(e)) return "tone";
  if (stripMarks(g) === stripMarks(e)) return "mark";
  return "wrong";
}

export function feedbackFor(kind: AnswerKind, expected: string): string {
  switch (kind) {
    case "correct":
      return "Correct.";
    case "tone":
      return `Right letters, wrong tone. Check the accent marks on each syllable. Answer: ${expected}`;
    case "mark":
      return `Close. Check the dots under ẹ, ọ and ṣ. Answer: ${expected}`;
    case "wrong":
      return `Not quite. Answer: ${expected}`;
  }
}
