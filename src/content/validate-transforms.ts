import { strings } from "./validate";
import { foldMarks } from "../lib/transform-grade";
import type { Transform } from "./transforms";

const EM_DASH = String.fromCharCode(0x2014);

export function validateTransforms(entries: Transform[]): string[] {
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
    for (const f of ["base", "baseEnglish", "rule"] as const) {
      if (!e[f].trim()) err(`empty field: ${f}`);
    }
    if (!e.source.trim()) err("needs a source");
    if (e.confidence === "needs-review" && !e.note) err("needs-review needs a note naming the doubt");
    if (e.answers.length === 0) err("needs at least one answer");
    if (new Set(e.answers.map((a) => a.trim())).size !== e.answers.length) err("duplicate answer");
    if (e.answers.some((a) => foldMarks(a) === foldMarks(e.base))) err("unchanged sentence would pass as an answer");
  }
  return errors;
}
