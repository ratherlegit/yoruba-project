import { strings } from "./validate";
import type { MinimalPair, Sound } from "./sounds";

const EM_DASH = "\u2014";

export function validateSounds(sounds: Sound[], pairs: MinimalPair[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const checkText = (id: string, v: unknown) => {
    for (const s of strings(v)) {
      if (s !== s.normalize("NFC")) errors.push(`${id}: string is not NFC: "${s}"`);
      if (s.includes(EM_DASH)) errors.push(`${id}: string contains an em dash: "${s}"`);
    }
  };
  const checkId = (id: string) => {
    if (ids.has(id)) errors.push(`${id}: duplicate id`);
    ids.add(id);
  };

  for (const s of sounds) {
    checkId(s.id);
    checkText(s.id, s);
    const maxExamples = 3;
    if (s.examples.length < 2 || s.examples.length > maxExamples) errors.push(`${s.id}: needs 2 to ${maxExamples} examples, found ${s.examples.length}`);
    if (s.confidence === "needs-review" && !s.note) errors.push(`${s.id}: needs-review needs a note`);
  }
  for (const p of pairs) {
    checkId(p.id);
    checkText(p.id, p);
    if (p.words.length < 2 || p.words.length > 3) errors.push(`${p.id}: needs 2 to 3 words, found ${p.words.length}`);
    const forms = p.words.map((w) => w.yoruba.normalize("NFC"));
    if (new Set(forms).size !== forms.length) errors.push(`${p.id}: words must be distinct`);
    if (p.confidence === "needs-review" && !p.note) errors.push(`${p.id}: needs-review needs a note`);
  }
  return errors;
}
