import { NUMBERS } from "@/content/numbers";

// Shows a build expression the way a learner reads it: 20*3-10 becomes 20 × 3 − 10.
export function showBuild(build: string): string {
  return build
    .replace(/\s+/g, "")
    .replace(/[*x]/g, " × ")
    .replace(/\+/g, " + ")
    .replace(/([0-9)])-/g, "$1 − ")
    .replace(/\s+/g, " ")
    .trim();
}

// The same expression in Yoruba: 20*3-10 becomes ogún × ẹ̀ta − ẹ̀wá. A number with no entry stays as digits.
export function showBuildWords(build: string): string {
  const word = (digits: string) => NUMBERS.find((n) => n.value === Number(digits))?.yoruba ?? digits;
  return showBuild(build).replace(/[0-9]+/g, word);
}
