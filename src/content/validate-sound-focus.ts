import { splitOnset, stripTones, syllabify, toneOf } from "@/lib/tone";
import { strings } from "./validate";
import type { ConsonantSet, ToneCompareRow } from "./sound-focus";

const EM_DASH = String.fromCharCode(0x2014);
const nfc = (s: string) => s.normalize("NFC");

function checkCommon(item: { id: string; source: string; confidence: string; note: string }, err: (m: string) => void) {
  for (const s of strings(item)) {
    if (s !== nfc(s)) err(`string is not NFC: "${s}"`);
    if (s.includes(EM_DASH)) err(`string contains an em dash: "${s}"`);
  }
  if (!item.source.trim()) err("needs a source");
  if (item.confidence === "needs-review" && !item.note) err("needs-review needs a note naming the doubt");
}

// The one syllable of a single-syllable word, or null (with an error recorded) when it has none or several.
function oneSyllable(word: string, err: (m: string) => void): string | null {
  try {
    const syl = syllabify(word);
    if (syl.length === 1) return syl[0]!;
    err(`"${word}" must be one syllable, found ${syl.length}`);
  } catch {
    err(`cannot compute a tone pattern for "${word}"`);
  }
  return null;
}

export function validateToneCompare(rows: ToneCompareRow[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const r of rows) {
    const err = (m: string) => errors.push(`${r.id}: ${m}`);
    if (ids.has(r.id)) err("duplicate id");
    ids.add(r.id);
    checkCommon(r, err);
    if (r.words.map((w) => w.tone).join(",") !== "mid,high,low") err("tones must be mid, high, low in that order");
    if (new Set(r.words.map((w) => stripTones(w.yoruba))).size !== 1) err("the three words must have the same letters, differing only in tone marks");
    if (new Set(r.words.map((w) => nfc(w.yoruba).toLowerCase())).size !== r.words.length) err("the three words must be distinct");
    for (const w of r.words) {
      const syl = oneSyllable(w.yoruba, err);
      if (!syl) continue;
      if (toneOf(syl) !== w.tone) err(`"${w.yoruba}" is ${toneOf(syl)} tone but is declared ${w.tone}`);
      if (!stripTones(w.yoruba).endsWith(stripTones(r.vowel))) err(`"${w.yoruba}" must end with the row's vowel "${r.vowel}"`);
    }
  }
  return errors;
}

export function validateConsonantSets(sets: ConsonantSet[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const s of sets) {
    const err = (m: string) => errors.push(`${s.id}: ${m}`);
    if (ids.has(s.id)) err("duplicate id");
    ids.add(s.id);
    checkCommon(s, err);
    if (s.words.length < 2 || s.words.length > 4) err(`needs 2 to 4 words, found ${s.words.length}`);
    const parts = s.words.map((w) => (oneSyllable(w.yoruba, err) ? splitOnset(w.yoruba) : null));
    const ok = parts.filter((p): p is { onset: string; rest: string } => p !== null);
    if (ok.length !== s.words.length) continue;
    if (new Set(ok.map((p) => p.rest)).size !== 1) err("words must share the same vowel and tone");
    if (new Set(ok.map((p) => p.onset.toLowerCase())).size !== ok.length) err("words must start with different consonants");
  }
  return errors;
}
