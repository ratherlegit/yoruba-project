import { stripTones, syllabify } from "@/lib/tone";
import { strings } from "./validate";
import type { ToneTwinEntry } from "./tone-twins";
import type { VocabLevel, VocabWord } from "./vocab/types";

const EM_DASH = String.fromCharCode(0x2014);

export function validateToneTwins(entries: ToneTwinEntry[], vocab: VocabLevel[]): string[] {
  const errors: string[] = [];
  const words = new Map<string, VocabWord>();
  for (const l of vocab) for (const t of l.topics) for (const w of t.words) words.set(w.id, w);
  const seen = new Set<string>();
  const nfc = (s: string) => s.normalize("NFC");

  for (const e of entries) {
    const err = (m: string) => errors.push(`${e.vocabId}: ${m}`);
    for (const s of strings(e)) {
      if (s !== nfc(s)) err(`string is not NFC: "${s}"`);
      if (s.includes(EM_DASH)) err(`string contains an em dash: "${s}"`);
    }
    if (seen.has(e.vocabId)) err("duplicate entry for this vocab id");
    seen.add(e.vocabId);
    const word = words.get(e.vocabId);
    if (!word) err("unknown vocab id");
    else if (/\s/.test(word.yoruba.trim())) err(`vocab word "${word.yoruba}" must be a single word`);
    if (e.twins.length < 1 || e.twins.length > 3) err(`needs 1 to 3 twins, found ${e.twins.length}`);
    if (!e.source.trim()) err("needs a source");
    if (e.confidence === "needs-review" && !e.note) err("needs-review needs a note naming the doubt");

    const forms = e.twins.map((t) => nfc(t.yoruba).toLowerCase());
    if (word) forms.push(nfc(word.yoruba).toLowerCase());
    if (new Set(forms).size !== forms.length) err("twins must be distinct from each other and from the word");
    for (const t of e.twins) {
      if (word && stripTones(t.yoruba) !== stripTones(word.yoruba)) err(`"${t.yoruba}" must have the same letters as "${word.yoruba}", differing only in tone marks`);
      try {
        syllabify(t.yoruba);
      } catch {
        err(`cannot compute a tone pattern for "${t.yoruba}"`);
      }
    }
  }
  return errors;
}
