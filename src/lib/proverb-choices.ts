import type { Proverb } from "@/content/proverbs";

// The shuffle in ChoiceQuestion rotates an unchanged order, so a meaning that always
// starts first lands first only about one time in six. Starting it at an index taken
// from the proverb id evens the three positions out.
export function proverbChoices(p: Proverb): string[] {
  const at = [...p.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 3;
  const out = [...p.wrong];
  out.splice(at, 0, p.meaning);
  return out;
}
