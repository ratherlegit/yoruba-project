import { strings } from "./validate";
import { MAX_LINES, MIN_LINES, type Dialogue, type Situation } from "./dialogues";

const EM_DASH = String.fromCharCode(0x2014);
const STRAY_G = String.fromCharCode(0x0261);

export function validateDialogues(situations: Situation[], dialogues: Dialogue[]): string[] {
  const errors: string[] = [];
  const bySituation = new Map(situations.map((s) => [s.id, s]));
  const ids = new Set<string>();
  for (const d of dialogues) {
    const err = (m: string) => errors.push(`${d.id}: ${m}`);
    for (const t of strings(d)) {
      if (t !== t.normalize("NFC")) err(`string is not NFC: "${t}"`);
      if (t.includes(EM_DASH)) err(`string contains an em dash: "${t}"`);
      if (t.includes(STRAY_G)) err(`string contains the stray U+0261 g: "${t}"`);
    }
    if (ids.has(d.id)) err("duplicate id");
    ids.add(d.id);
    const sit = bySituation.get(d.situationId);
    if (!sit) err(`unknown situation: "${d.situationId}"`);
    else if (sit.level !== d.level) err(`level "${d.level}" does not match its situation's level "${sit.level}"`);
    for (const f of ["title", "setting"] as const) if (!d[f].trim()) err(`empty field: ${f}`);

    if (d.lines.length < MIN_LINES || d.lines.length > MAX_LINES) err(`lines must be ${MIN_LINES} to ${MAX_LINES}, got ${d.lines.length}`);
    d.lines.forEach((l, i) => {
      if (!l.yoruba.trim() || !l.english.trim() || !l.speaker.trim()) err(`line ${i + 1} is empty`);
    });
    const voices = new Map<string, Set<string>>();
    for (const l of d.lines) voices.set(l.speaker, (voices.get(l.speaker) ?? new Set()).add(l.voice));
    const mixed = [...voices.values()].some((v) => v.size > 1);
    const kinds = [...voices.values()].flatMap((v) => [...v]);
    const ok = voices.size === 2 && !mixed && kinds.includes("female") && kinds.includes("male");
    if (!ok) err("needs exactly one female and one male speaker, each with their own voice");

    if (d.questions.length < 2 || d.questions.length > 5) err(`questions must be 2 to 5, got ${d.questions.length}`);
    d.questions.forEach((q, i) => {
      const n = `question ${i + 1}`;
      if (!q.prompt.trim()) err(`${n} has an empty prompt`);
      if (q.choices.length < 2 || q.choices.length > 4) err(`${n} needs 2 to 4 choices`);
      if (new Set(q.choices.map((c) => c.trim())).size !== q.choices.length || q.choices.some((c) => !c.trim())) err(`${n} needs distinct, non-empty choices`);
      if (!q.choices.includes(q.answer)) err(`${n} answer is not one of its choices`);
    });
    if (!d.source.trim()) err("needs a source");
    if (d.confidence === "needs-review" && !d.note.trim()) err("needs-review needs a note naming the doubt");
  }
  return errors;
}
