import { cleanAnswer, stripMarks } from "../lib/normalize";
import { strings } from "./validate";
import { evalBuild, type NumberEntry, type NumberPhrase, type NumberStep } from "./numbers";

const EM_DASH = String.fromCharCode(0x2014);
const STRAY_G = "ɡ";
const fold = (s: string) => stripMarks(cleanAnswer(s));

export function validateNumbers(entries: NumberEntry[], phrases: NumberPhrase[], steps: NumberStep[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const values = new Set<number>();
  const owner = new Map<string, string>();

  for (const e of entries) {
    const err = (m: string) => errors.push(`${e.id}: ${m}`);
    if (ids.has(e.id)) err("duplicate id");
    ids.add(e.id);
    if (values.has(e.value)) err(`duplicate value ${e.value}`);
    values.add(e.value);
    if (!e.yoruba.trim()) err("empty field: yoruba");
    if (e.answers.length === 0) err("needs at least one answer");
    if (!e.source.trim()) err("needs a source");
    if (e.confidence === "needs-review" && !e.note) err("needs-review needs a note naming the doubt");
    for (const s of strings(e)) {
      if (s !== s.normalize("NFC")) err(`string is not NFC: "${s}"`);
      if (s.includes(EM_DASH)) err(`string contains an em dash: "${s}"`);
      if (s.includes(STRAY_G)) err(`stray ɡ glyph (U+0261) in "${s}"`);
    }
    if (e.build.trim()) {
      const v = evalBuild(e.build);
      if (v === null) err(`build is not an expression: "${e.build}"`);
      else if (v !== e.value) err(`build does not equal value: "${e.build}" is ${v}, value is ${e.value}`);
    }
    for (const a of [...e.answers, ...e.after]) {
      const key = fold(a);
      const other = owner.get(key);
      if (other && other !== e.id) err(`answer belongs to two numbers: "${a}" is also used by ${other}`);
      owner.set(key, e.id);
    }
  }

  const phraseIds = new Set<string>();
  for (const p of phrases) {
    const err = (m: string) => errors.push(`${p.id}: ${m}`);
    if (phraseIds.has(p.id)) err("duplicate id");
    phraseIds.add(p.id);
    if (!p.prompt.trim()) err("empty field: prompt");
    if (p.answers.length === 0) err("needs at least one answer");
    if (!p.source.trim()) err("needs a source");
    if (p.confidence === "needs-review" && !p.note) err("needs-review needs a note naming the doubt");
    for (const s of strings(p)) {
      if (s !== s.normalize("NFC")) err(`string is not NFC: "${s}"`);
      if (s.includes(EM_DASH)) err(`string contains an em dash: "${s}"`);
      if (s.includes(STRAY_G)) err(`stray ɡ glyph (U+0261) in "${s}"`);
    }
  }

  for (const s of steps) {
    const err = (m: string) => errors.push(`step ${s.id}: ${m}`);
    for (const id of s.entryIds) if (!ids.has(id)) err(`unknown entry id "${id}"`);
    for (const id of s.phraseIds) if (!phraseIds.has(id)) err(`unknown phrase id "${id}"`);
  }

  const stepOne = entries.filter((e) => e.step === 1).map((e) => e.value).sort((a, b) => a - b);
  if (stepOne.length > 0 && stepOne.join(",") !== "1,2,3,4,5,6,7,8,9,10") {
    errors.push("step 1 must be exactly 1 to 10");
  }
  return errors;
}
