import { cleanAnswer, stripMarks } from "./normalize";

export type TransformMode = "easy" | "advanced";
export type TransformResult = "right" | "close" | "wrong";

export function comparable(s: string): string {
  return cleanAnswer(s).replace(/[.?!]+$/, "").trim();
}

export function foldMarks(s: string): string {
  return stripMarks(comparable(s));
}

export function gradeTransform(input: string, answers: string[], mode: TransformMode): TransformResult {
  const folded = foldMarks(input);
  if (!folded) return "wrong";
  const given = comparable(input);
  if (mode === "advanced") {
    if (answers.some((a) => comparable(a) === given)) return "right";
    return answers.some((a) => foldMarks(a) === folded) ? "close" : "wrong";
  }
  return answers.some((a) => foldMarks(a) === folded) ? "right" : "wrong";
}
