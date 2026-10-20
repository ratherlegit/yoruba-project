# Numbers Section: Design Spec

Date: 2026-10-20
Status: Draft, awaiting review
Builds on the `landing-stats` branch (the landing page cards, icons and stats store). That branch is not merged yet, so this work starts from it.

## 1. Intent

Yoruba counting is not a word list. Above ten it is a base-20 system: units one to four are added to a tens word, five to nine are subtracted from the next one, and odd tens are subtracted from the next even ten (fifteen is "twenty minus five", forty is "two twenties"). The learner should be able to say and read numbers aloud, count objects, handle prices in naira, and understand how the system is built. This section is a dedicated place for that, with a short path of steps, each starting with a small explanation and followed by typed practice.

## 2. Goals, non-goals, anti-goals

### Goals
- A new page, `/numbers`, a "Numbers" link in the top nav, and a sixth card on the landing page with its own icon.
- A path of six steps (section 3), each with a short explanation and a set of examples, then practice.
- Typed practice, graded with the same easy and advanced modes as Transform.
- The vocab topic "Numbers one to ten" (id `gs-numbers`) moves into this section, so no number content lives in two places.
- Every number shows how it is built where the system has a rule (for example 15 as 20 minus 5), and that decomposition is checked by the validator.
- Results are recorded for the stats page, and Numbers gets a stats section and a landing card progress line.
- All new Yoruba is `confidence: "needs-review"` with a source and a note, listed in `content/REVIEW.md`.

### Non-goals
- New audio. A "hear it" practice mode only appears for numbers that already have clips; recording more is a later step, as with proverbs.
- A rule-based generator that produces Yoruba number words (see anti-goals and section 9.1).
- Numbers above one million, fractions, ordinals (kìn-ín-ní, kejì), dates, telling time, phone numbers.
- Changing the vocab "Market and money" topic. It stays in vocab.

### Anti-goals (a failure even if it technically works)
- A wrong Yoruba number word that looks authoritative. Number words have contractions, tone shifts and dialect variants, so a program that builds them from rules can be confidently wrong.
- A correct number marked wrong because the learner used a valid variant (kò/ò style variation exists: "ọ̀kanlá" and "oókànlá", "ọgọ́rùn-ún" and "ọrún").
- A number set where the decomposition shown does not equal the value.
- Duplicate content: the same number words appearing in vocab and Numbers, or two different forms for the same number across the two places.
- Hiding that the source is thin. The only fully structured source found is a Wikipedia article flagged "more citations needed"; the review file must say so.
- Losing the learner's existing vocab progress without noticing (see section 4).

## 3. How it works

### The path
Six steps, shown as a list on `/numbers`, each opening to its own page (`/numbers/$stepId`). Steps are not locked.

1. **One to ten.** The ten counting words (ọ̀kan, èjì, ẹ̀ta and so on), and the forms used after a noun (méjì, mẹ́ta).
2. **Eleven to twenty.** "Ten and one" (the lá ending) for eleven to fourteen, then the subtraction forms for fifteen to nineteen (ẹ̀ẹ́dógún, "twenty minus five"), and ogún.
3. **Tens and twenties.** Twenty as the base: 30 to 100 (ọgbọ̀n, ogójì, àádọ́ta, ọgọ́ta, àádọ́rin, ọgọ́rin, àádọ́rùn-ún, ọgọ́rùn-ún) and how each is built ("two twenties", "three twenties minus ten").
4. **Hundreds and thousands.** 200 (igba), 400 (irinwó), 600, 800, 1,000 (ẹgbẹ̀rún) and how 200 is the next base.
5. **Counting things.** A number goes after the noun: ọmọ méjì, ajá mẹ́ta. Includes "one" as kan and the first-person forms.
6. **Money.** Prices in naira: àádọ́ta náírà, ọgọ́rùn-ún náírà, igba náírà, and the same amounts with kọ́bọ̀ where sourced.

Each step page has: a one-paragraph rule, a table of examples (numeral, Yoruba, how it is built), then a "Practice" button.

### Practice
Rounds of eight questions drawn from the step's own numbers, in a fixed seeded order that differs per round. Question types, each graded with `gradeTransform` (easy mode ignores dots and tones, advanced needs them exact; digits are compared as plain text):
- **Numeral to Yoruba:** "Type 15 in Yoruba."
- **Yoruba to numeral:** "What number is ẹ̀ẹ́dógún?" (typed digits).
- **Counting:** "Say 'three children' in Yoruba." (steps 5 and 6 only)
- **Hear it:** plays a clip and asks for the numeral. Only offered for numbers with an audio clip.

The same tap-to-insert row as Transform is available. After each answer the page shows the correct answer, every accepted variant, and the build ("20 minus 5"). A round ends with a score and a Try again button. A finished round with eight questions answered records the step's best score.

### Stats and landing
- The landing card shows "N of 6 steps done" once any step has a score.
- The stats page gets a "Numbers" section: steps done, best score per step, and accuracy by question type.
- Results use the stats store from `landing-stats`, extended with a `numbers` key, with the same rules: only counts and ids, recorded in event handlers, and nothing breaks when storage is blocked.

## 4. Content model and moving the vocab topic

New file `src/content/numbers.ts`.

```ts
export type NumberEntry = {
  id: string;             // kebab-case, unique
  value: number;          // 1 .. 1000000
  yoruba: string;         // the counting form, NFC, tone marks included
  after: string[];        // forms used after a noun (méjì, mẹ́ta); empty when none
  answers: string[];      // every accepted way to say it, yoruba first
  build: string;          // arithmetic, e.g. "20-5"; "" for 1 to 10
  step: 1 | 2 | 3 | 4;    // which path step introduces it
  source: string;
  confidence: Confidence; // "needs-review"
  note?: string;
};
export type NumberStep = { id: string; title: string; rule: string; entryIds: string[] };
export const NUMBER_STEPS: NumberStep[];
export const NUMBERS: NumberEntry[];
```

Steps 5 and 6 reuse the same entries plus a small list of counting nouns and prices (`NumberPhrase`: `{ id, prompt (English), numeral, answers, source, confidence, note }`).

Validation (`validate-numbers.ts`, run by `npm run validate` and a unit test):
- Ids unique; required fields non-empty; every entry has a source and a needs-review note.
- All strings NFC, no em dash, and no stray `ɡ` (U+0261); Wikipedia's table mixes that glyph with the normal `g`, and it must not leak into content.
- `build` is a tiny expression (digits, `+ - ×` or `x`, and parentheses). The validator evaluates it and requires the result to equal `value`.
- Step 1 entries are exactly the numbers 1 to 10. Every entry id referenced by a step exists.
- No two entries share a value.
- No number word in `answers` is also an accepted answer for a different value.

### Moving "Numbers one to ten"
The ten words and their example sentences become step 1 of Numbers; the vocab topic `gs-numbers` is removed from `getting-started.ts`. Things to handle, not discover:
- Vocab progress and stats: a saved `gs-numbers` entry in `yp:vocab-progress:v1` is ignored (the topic no longer exists). The vocab "topics done" total drops by one. Tests that count topics are updated.
- Audio: clips are keyed by text in `audio-manifest.json`, so the existing clips for the ten words and the sentences keep working. The audio-budget test and its expectations must still pass.
- Tone practice and tone twins: they draw words from vocab content. They must not reference removed word ids, and tone twins that mention number words are checked.
- `ogún` (twenty) is also a Mastery vocab word meaning inheritance. It stays there; Numbers lists it as twenty. The note on both entries says so.

## 5. Where it lives

- Pages: `src/pages/Numbers.tsx` (the path), `src/pages/NumbersStep.tsx` (one step with its practice).
- Components: a numbers practice component built on the Transform input and keys (`YorubaKeys`, `insertChar`, `gradeTransform`).
- Lib: `src/lib/numbers-practice.ts` (round building, grading wrapper), `src/lib/stats.ts` extended with `numbers` results and summaries; the stats store key stays `yp:stats:v1` and loading tolerates old data without the new key.
- Landing: a sixth `ActivityCard`, a `numbers` entry in `ActivityIcon`, a nav link "Numbers", routes `/numbers` and `/numbers/$stepId`.
- Review: `src/lib/review.ts` and `scripts/generate-review.ts` get a Numbers section; `scripts/validate-content.ts` runs the validator.
- Tests: unit tests for the validator, practice builder and stats additions; component tests for both pages; the vocab and tone-practice tests updated for the moved topic; an e2e flow from the landing card through one practice round to the stats page.

## 6. Content authoring process

1. Take the numerals from the Wikipedia "Yoruba numerals" article as the structured source and cross-check every entry against at least one more source: the COERLL "Yorùbá Yé Mi" numbers material the lessons already cite, and Wiktionary entries for the individual numbers. Record both in `source`.
2. Write `build` for every number above ten from the article's decomposition column (for example 35 = `40-5`, 110 = `20*6-10`) and let the validator check the arithmetic.
3. Where sources disagree on a form (the article's "objects" column versus the after-a-noun forms already in vocab), keep both, put the better-attested form first, and say so in the `note`.
4. Normalise the article's glyph oddities (`ɡ`, composed and decomposed marks) to plain NFC.
5. Leave out any number that cannot be cross-checked. The set may be smaller than the table.
6. Nothing is marked verified by the builder. The review file names the Wikipedia flag and the contraction and tone doubts.

## 7. Left to the builder

- Card and page layout, and wording of explanations, within the existing visual style and the no-eyebrow, no-em-dash rule.
- The icon for the Numbers card. Suggestion: a heap of yam tubers (isu), a countable everyday object not used elsewhere. The author approves it before merge, as with the other five.
- Which counting nouns and which prices to use in steps 5 and 6, from words the app already teaches and amounts that are in the sourced table.
- Exact question counts per round and whether "hear it" is a separate round or mixed in.

## 8. Risks

- **Source quality.** One structured source, flagged by its own editors. Mitigation: cross-checks, needs-review, and a native check before the section is described as accurate.
- **Contractions and tones.** Numbers such as ẹ̀ẹ́dógún and aárùn-ún-dínlógójì change shape. They are copied from sources, never computed.
- **Moving the vocab topic.** Counts, audio and tone-practice sources all touch it. Mitigation: listed in section 4 and covered by tests.
- **Dialect variants.** Accepted answers may miss a valid regional form. The review file lists every accepted form.
- **Branch dependency.** Built on `landing-stats`, which includes the stats store and card components this uses.

## 9. Calls made by the author of this spec (not agreed decisions)

1. **Sourced table, not a generator.** The user agreed to "practice generated from the number rules". Because number words have contractions and tone shifts, this spec instead uses a curated, sourced table and uses the rules only for explanations and for validating the arithmetic decomposition. This is the one change from what was agreed.
2. Six steps, in the order in section 3, not locked.
3. Typed practice only, graded with `gradeTransform`; a "hear it" question appears only where a clip already exists.
4. `gs-numbers` leaves vocab and becomes step 1; old saved vocab results for it are ignored.
5. Numbers get their own stats section, a landing card progress line "N of 6 steps done", and a "Numbers" nav link.
6. Range: 1 to 1,000 fully, with a few larger values (2,000; 10,000; 20,000) only if cross-checked.
7. Eight questions per round; a finished round records the step's best score.
8. The Numbers icon is a heap of yams.
