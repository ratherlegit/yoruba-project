import { strings } from "./validate";
import type { Proverb } from "./proverbs";

const EM_DASH = String.fromCharCode(0x2014);

export function validateProverbs(entries: Proverb[]): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();
  for (const e of entries) {
    const err = (m: string) => errors.push(`${e.id}: ${m}`);
    for (const s of strings(e)) {
      if (s !== s.normalize("NFC")) err(`string is not NFC: "${s}"`);
      if (s.includes(EM_DASH)) err(`string contains an em dash: "${s}"`);
    }
    if (seen.has(e.id)) err("duplicate id");
    seen.add(e.id);
    for (const f of ["yoruba", "literal", "meaning", "usedWhen"] as const) {
      if (!e[f].trim()) err(`empty field: ${f}`);
    }
    if (!e.source.trim()) err("needs a source");
    if (e.confidence === "needs-review" && !e.note) err("needs-review needs a note naming the doubt");
    if (e.wrong.length !== 2 || new Set(e.wrong.map((w) => w.trim())).size !== 2 || e.wrong.some((w) => !w.trim())) {
      err("wrong must be two distinct options");
    }
    if (e.wrong.some((w) => w.trim() === e.meaning.trim())) err("wrong option equals the meaning");
  }
  return errors;
}
