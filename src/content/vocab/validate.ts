import { strings } from "../validate";
import { VOCAB_POS, type VocabLevel, type VocabTopic, type VocabWord } from "./types";

export const WORDS_PER_TOPIC = 10;
export const TOPICS_PER_LEVEL = 5;
const EM_DASH = "\u2014";

export const blankOf = (w: VocabWord): string => w.sentence.blank ?? w.yoruba;

export function locateBlank(sentence: string, blank: string): { start: number; end: number; count: number } {
  const hay = sentence.toLowerCase();
  const needle = blank.toLowerCase();
  const start = needle ? hay.indexOf(needle) : -1;
  let count = 0;
  if (needle) for (let at = hay.indexOf(needle); at !== -1; at = hay.indexOf(needle, at + needle.length)) count++;
  return { start, end: start === -1 ? -1 : start + needle.length, count };
}

export function validateTopic(t: VocabTopic): string[] {
  const errors: string[] = [];
  const err = (m: string) => errors.push(`${t.id}: ${m}`);

  for (const s of strings(t)) {
    if (s !== s.normalize("NFC")) err(`string is not NFC: "${s}"`);
    if (s.includes(EM_DASH)) err(`string contains an em dash: "${s}"`);
  }
  if (t.sources.length === 0) err("sources is empty");
  if (t.words.length !== WORDS_PER_TOPIC) err(`expected ${WORDS_PER_TOPIC} words, found ${t.words.length}`);

  const glosses = new Set<string>();
  const yoruba = new Set<string>();
  for (const w of t.words) {
    const e = (m: string) => err(`word "${w.id}": ${m}`);
    if (!VOCAB_POS.includes(w.pos)) e(`invalid pos "${w.pos}"`);
    if (!w.sentence.english.trim()) e("needs a sentence translation");
    if (w.confidence === "needs-review" && !w.note) e("needs-review words need a note naming the doubt");
    const loc = locateBlank(w.sentence.yoruba, blankOf(w));
    if (loc.start === -1) e(`"${blankOf(w)}" does not appear in its sentence "${w.sentence.yoruba}"`);
    else if (loc.count > 1) e(`"${blankOf(w)}" appears more than once in its sentence`);
    if (glosses.has(w.english.toLowerCase())) e(`duplicate gloss "${w.english}" in this topic`);
    glosses.add(w.english.toLowerCase());
    if (yoruba.has(w.yoruba.toLowerCase())) e(`duplicate Yoruba "${w.yoruba}" in this topic`);
    yoruba.add(w.yoruba.toLowerCase());
  }
  return errors;
}

export function validateVocabCatalog(levels: VocabLevel[], opts: { complete?: boolean } = {}): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const topicIds = new Set<string>();
  for (const level of levels) {
    if (opts.complete && level.topics.length !== TOPICS_PER_LEVEL) {
      errors.push(`${level.id}: expected ${TOPICS_PER_LEVEL} topics, found ${level.topics.length}`);
    }
    for (const t of level.topics) {
      if (t.level !== level.id) errors.push(`${t.id}: filed under ${level.id} but declares level ${t.level}`);
      if (topicIds.has(t.id)) errors.push(`${t.id}: duplicate topic id`);
      topicIds.add(t.id);
      for (const w of t.words) {
        if (ids.has(w.id)) errors.push(`${t.id}: duplicate word id "${w.id}"`);
        ids.add(w.id);
      }
    }
  }
  return errors;
}
