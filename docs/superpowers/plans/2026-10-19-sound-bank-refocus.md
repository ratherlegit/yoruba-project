# Sound Bank Refocus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Sound Bank's Tones section a same-spelling comparison grid (11 vowels), add focused gb, p and s versus ṣ cards with contrast sets, fold the rest into a collapsed reference, and add a Sounds mode to Practice.

**Architecture:** New content (`src/content/sound-focus.ts`) holds tone rows and consonant sets, checked by new validators. Two new components (`ToneCompare`, `KeyConsonants`) render them. The existing `TonePractice` builder and component gain a third mode. `SoundBank.tsx` is restructured and the old three tone cards are removed. All clips for the new words already exist in `public/audio/`.

**Tech Stack:** TypeScript, React, Vite, Vitest + Testing Library (jsdom), Playwright e2e, existing `tsx` validate/review scripts.

**Spec:** `docs/superpowers/specs/2026-10-19-sound-bank-refocus-design.md`

## Global Constraints

- No em dashes anywhere (code, copy, docs). `src/no-em-dash.test.ts` and the validators enforce this. In source, build the character from `String.fromCharCode(0x2014)`, never type it.
- Yoruba strings are NFC. Compare with `.normalize("NFC")`.
- Every new row and set has `confidence: "needs-review"`, a non-empty `source` and a `note`. Nothing is marked verified.
- Source string for every row and set: `Wiktionary, Yoruba section of the page "<page>" (en.wiktionary.org/wiki/<page>), read 2026-10-19`.
- English meanings show in the tone grid and the consonant cards, never in Sounds practice mode.
- Practice stays last on the page. Keep `data-testid="practice"` on its section and `data-testid="choice"` on choices; when a mode has no playable question the message must contain the word "audio".
- All clips already exist. Do not generate or delete any audio. Task 2 commits the already-generated files in `public/audio/` and the manifest.
- Run tests with `npm test`, content checks with `npm run validate`, types with `npx tsc --noEmit`.
- Work on a branch `sound-bank-refocus` created from `master`.

## Review Focus

- A nasal row word such as kan or wọn must pass the one-syllable and ends-with-vowel checks (the nasal coda stays in the syllable). Test in Task 1.
- A set word with a dotted onset such as ṣé: `splitOnset` must keep ṣ as the onset so the rest (vowel plus tone) is compared correctly. Test in Task 1.
- A Sounds-mode set where only one word has a clip must produce no question, and a mode with no playable question shows the audio message and keeps the switch working. Test in Task 5.
- The collapsed reference list must still hold working audio buttons (existing `SoundBank.test.tsx` speaker-button test) and the page order must be Tones, Key consonants, Minimal pairs, Letters reference, Practice. Test in Task 6.
- Phone-width layout of the 3-column grid and 4-word sets cannot be unit tested. Checked in the browser in Task 7.

## File Structure

- Modify `src/lib/tone.ts`: add `splitOnset`.
- Create `src/content/sound-focus.ts`: types `ToneCompareWord`, `ToneCompareRow`, `ConsonantSet` and data `TONE_COMPARE`, `CONSONANT_SETS`. (The spec puts these in `sounds.ts`; a separate file keeps `sounds.ts` focused. Plan's call.)
- Create `src/content/validate-sound-focus.ts`: `validateToneCompare`, `validateConsonantSets`.
- Modify `src/lib/audio-strings.ts`, `scripts/list-audio-strings.ts`, `src/lib/review.ts`, `scripts/generate-review.ts`, `scripts/validate-content.ts`.
- Create `src/components/ToneCompare.tsx`, `src/components/KeyConsonants.tsx`.
- Modify `src/lib/tone-practice.ts`, `src/components/TonePractice.tsx`: Sounds mode.
- Modify `src/pages/SoundBank.tsx`, `src/components/SoundCard.tsx`, `src/content/sounds.ts`, `src/content/validate-sounds.ts`, tests and `e2e/sounds.spec.ts`.

---

### Task 1: `splitOnset` and the two validators

**Files:**
- Modify: `src/lib/tone.ts`, `src/lib/tone.test.ts`
- Create: `src/content/sound-focus.ts` (types only in this task, `TONE_COMPARE = []`, `CONSONANT_SETS = []`), `src/content/validate-sound-focus.ts`
- Test: `src/content/validate-sound-focus.test.ts`

**Interfaces:**
- Produces:
  - `splitOnset(word: string): { onset: string; rest: string }` in `src/lib/tone.ts`. Works on one syllable. `onset` is the leading consonant letters with their combining marks (gb counts as the two letters g, b); `rest` is everything from the first vowel letter (a, e, i, o, u, with ẹ and ọ counted as e and o), including tone marks and a nasal coda. Both NFC, original case and marks kept.
  - `type ToneCompareWord = { yoruba: string; english: string; tone: Tone }`
  - `type ToneCompareRow = { id: string; vowel: string; words: [ToneCompareWord, ToneCompareWord, ToneCompareWord]; source: string; confidence: Confidence; note: string }`
  - `type ConsonantFocus = "gb" | "p" | "s-sh"`
  - `type ConsonantSet = { id: string; focus: ConsonantFocus[]; explain: string; words: { yoruba: string; english: string }[]; source: string; confidence: Confidence; note: string }`. (`focus` is an array so one set can appear on two cards, as the spec requires; the spec's single value is a slip.)
  - `validateToneCompare(rows: ToneCompareRow[]): string[]`, `validateConsonantSets(sets: ConsonantSet[]): string[]`.

- [ ] **Step 1: Write failing tests**

`tone.test.ts`: `splitOnset("gbà")` is `{ onset: "gb", rest: "à" }`; `splitOnset("pọ́")` is `{ onset: "p", rest: "ọ́" }`; `splitOnset("ṣé")` is `{ onset: "ṣ", rest: "é" }`; `splitOnset("kàn")` is `{ onset: "k", rest: "àn" }`; `splitOnset("ọn")` is `{ onset: "", rest: "ọn" }`.

`validate-sound-focus.test.ts`, fixtures built with a small helper. Tests, each asserting on the joined error string:
  - `accepts a valid row`: a, wa (mid), wá (high), wà (low) gives `[]`; also a nasal row `an` with kan, kán, kàn and an `ọn` row with wọn, wọ́n, wọ̀n give `[]`.
  - `rejects tones out of order or repeated`: error contains `mid, high, low`.
  - `rejects words with different letters`: wa, wá, wi gives `same letters`.
  - `rejects a word of more than one syllable`: `wàwá` gives `one syllable`.
  - `rejects a declared tone that does not match the word`: error contains `tone`.
  - `rejects a vowel that does not match the row`: row vowel `e` with a-words gives `vowel`.
  - `rejects duplicate row ids, empty source, needs-review without a note, non-NFC text, em dashes`.
  - Consonant sets: `accepts bà, gà, gbà`; `accepts sé, ṣé`; `rejects 1 word and 5 words` (`2 to 4 words`); `rejects words with a different vowel or tone` (bà with gé gives `vowel and tone`); `rejects the same onset twice` (`different consonants`); plus the same source/note/NFC/em dash checks.

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/lib/tone.test.ts src/content/validate-sound-focus.test.ts`
Expected: FAIL (`splitOnset` and the validators not defined).

- [ ] **Step 3: Implement**

`splitOnset` in `src/lib/tone.ts`: NFD, consume leading characters until the first of a, e, i, o, u, keeping combining marks that follow a consonant, then NFC both halves. The validators follow `validateToneTwins` in `src/content/validate-tone-twins.ts` for the NFC, em dash (via `String.fromCharCode(0x2014)`), source and note checks. A tone row is valid when: tones are exactly mid, high, low in order; `stripTones` equal across the three; each word has one syllable from `syllabify` with `toneOf(syllable)` equal to its declared tone; and `stripTones(word)` ends with `stripTones(row.vowel)`. A set is valid when: 2 to 4 distinct words, each one syllable, equal `splitOnset(word).rest` across words, and distinct `splitOnset(word).onset` across words.

- [ ] **Step 4: Verify**

Run: `npx vitest run src/lib/tone.test.ts src/content/validate-sound-focus.test.ts && npx tsc --noEmit`
Expected: PASS, no type errors.

- [ ] **Step 5: Commit**

```bash
git switch -c sound-bank-refocus
git add src/lib/tone.ts src/lib/tone.test.ts src/content/sound-focus.ts src/content/validate-sound-focus.ts src/content/validate-sound-focus.test.ts
git commit -m "feat: tone row and consonant set types with validators"
```

---

### Task 2: The content, audio wiring and clip guard

**Files:**
- Modify: `src/content/sound-focus.ts`, `src/lib/audio-strings.ts`, `scripts/list-audio-strings.ts`, `scripts/validate-content.ts`, `src/lib/audio.test.ts`, `src/lib/audio-strings.test.ts`
- Test: `src/content/sound-focus.test.ts`
- Also commit: `public/audio/*` new files and `src/content/audio-manifest.json` (already generated, currently uncommitted)

**Interfaces:**
- Consumes: Task 1 types and validators.
- Produces: `TONE_COMPARE: ToneCompareRow[]` (11 rows) and `CONSONANT_SETS: ConsonantSet[]` (7 sets); `collectSoundAudioStrings(sounds, pairs, compare: ToneCompareRow[] = [], sets: ConsonantSet[] = [])` returning the same `{ key, text, group: "sound-word" }[]`, deduped by key, with compare and set words added after the existing sounds and pairs.

- [ ] **Step 1: Write failing tests**

`sound-focus.test.ts`:
  - `shipped tone rows and consonant sets pass their validators` (both `[]`).
  - `has the 11 rows in order` : vowels `["a","e","ẹ","i","o","ọ","u","an","in","un","ọn"]`.
  - `every row word and set word has a clip in the manifest and a file on disk` (use `audioKey`, the manifest JSON and `existsSync(join("public","audio",file))`).
  - `the sets cover gb, p and s-sh, and the ọ-high set appears on both gb and p`.
  - `s versus ṣ sets pair s and ṣ words` : each s-sh set has exactly one word starting with `s` and one starting with `ṣ`.
`audio-strings.test.ts` (add): `collectSoundAudioStrings includes tone row words and consonant set words`, asserting a fixture row word and set word appear with group `sound-word`, deduped.
`audio.test.ts`: pass `TONE_COMPARE, CONSONANT_SETS` to both existing `collectSoundAudioStrings` calls.

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/content/sound-focus.test.ts src/lib/audio-strings.test.ts`
Expected: FAIL (empty data, new parameters ignored).

- [ ] **Step 3: Write the data**

In `src/content/sound-focus.ts`, with a small local `row(...)` and `set(...)` helper that fills `source`, `confidence`, `note`. Words with English (the English is a teaching choice of one meaning from several):

Rows (mid / high / low, page): a: wa (our), wá (come), wà (be, be located), page `wa`. e: le (hard), lé (chase), lè (can), `le`. ẹ: bẹ (peel), bẹ́ (hop down), bẹ̀ (beg), `bẹ`. i: ṣi (make a mistake), ṣí (open), ṣì (become dull), `ṣi`. o: ro (hoe, till), ró (wrap a wrapper), rò (think), `ro`. ọ: kọ (write), kọ́ (build, teach), kọ̀ (refuse), `kọ`. u: mu (drink), mú (take), mù (be hidden), `mu`. an: kan (one), kán (break), kàn (touch, concern), `kan`. in: rin (grate), rín (smile, laugh), rìn (walk), `rin`. un: sun (roast, cry), sún (move, shift), sùn (sleep), `sun`. ọn: wọn (their), wọ́n (expensive), wọ̀n (measure, weigh), `wọn`. Notes: Wiktionary writes mid words without a tone mark, so a native speaker must confirm each mid word and meaning; sun and wọn have several unrelated meanings on their page.

Sets (focus, words): gb: bà (perch), gà (tickle), gbà (rescue, take) [page `ba`, `ga`, `gba`]; gb: gé (cut), gbé (carry) [`ge`, `gbe`]; gb and p: pọ́ (inflate, pump), kọ́ (build), bọ́ (fall), gbọ́ (hear) [`pọ`, `kọ`, `bọ`, `gbọ`]; p: pọ̀ (be plenty), kọ̀ (refuse), bọ̀ (come back), gọ̀ (be foolish) [`pọ`, `kọ`, `bọ`, `gọ`]; s-sh: sé (shut, block), ṣé (question word, as in "Ṣé o fẹ́ jẹun?") [`se`, `ṣe`]; sẹ́ (sieve), ṣẹ́ (break) [`sẹ`, `ṣẹ`]; sẹ̀ (condense), ṣẹ̀ (sin) [`sẹ`, `ṣẹ`]. Each set's `explain` is one line saying what to listen for (my drafts, for example "Listen for the g and b said together, with the lips closed" for gb sets). The p sets note that they contrast p with k, b, gb and g because strict p minimal pairs are scarce. The ṣé note says the gloss comes from the app's own lesson, not the Wiktionary page.

- [ ] **Step 4: Implement the audio wiring**

Extend `collectSoundAudioStrings` with the two optional parameters; pass `TONE_COMPARE, CONSONANT_SETS` in `scripts/list-audio-strings.ts`; add `validateToneCompare` and `validateConsonantSets` to `scripts/validate-content.ts` using the existing error-counting pattern.

- [ ] **Step 5: Verify**

Run: `npm test && npm run validate && npx tsc --noEmit`
Expected: all pass, including the manifest-orphan audio test that currently fails (the 42 new clips now have content).

- [ ] **Step 6: Commit** (the generated audio goes in this commit)

```bash
git add src/content/sound-focus.ts src/content/sound-focus.test.ts src/lib scripts public/audio src/content/audio-manifest.json
git commit -m "content: tone comparison rows and consonant contrast sets, with their audio"
```

---

### Task 3: Review file support

**Files:**
- Modify: `src/lib/review.ts`, `scripts/generate-review.ts`, `src/lib/review.test.ts`

**Interfaces:** `buildReviewMarkdown(levels, vocabLevels, soundData?, toneTwins)` where `soundData` becomes `{ sounds: Sound[]; pairs: MinimalPair[]; compare?: ToneCompareRow[]; sets?: ConsonantSet[] }`. Rows and sets that are needs-review appear in the `## Sound Bank` section and count toward the total.

- [ ] **Step 1: Write the failing test** in `review.test.ts`: `lists tone comparison rows and consonant sets with their words, source and doubt, and counts them`: with one row and one set the output contains the row id, `wá`, the set id, the source string and `Doubt:` text, and the "N items need review" count rises by 2. Also update the existing `matches the committed content/REVIEW.md` test to pass `compare: TONE_COMPARE, sets: CONSONANT_SETS`.

- [ ] **Step 2: Run to verify failure**, implement following the Sound Bank block in `buildReviewMarkdown`, pass both from `scripts/generate-review.ts`, then regenerate with `npm run review`.

Run: `npx vitest run src/lib/review.test.ts` then `npm run review && npm test`
Expected: FAIL, then PASS; `content/REVIEW.md` changes.

- [ ] **Step 3: Commit**

```bash
git add src/lib/review.ts src/lib/review.test.ts scripts/generate-review.ts content/REVIEW.md
git commit -m "feat: list tone rows and consonant sets in the review file"
```

---

### Task 4: `ToneCompare` and `KeyConsonants` components

**Files:**
- Create: `src/components/ToneCompare.tsx`, `src/components/KeyConsonants.tsx`
- Test: `src/components/ToneCompare.test.tsx`, `src/components/KeyConsonants.test.tsx`

**Interfaces:**
- Consumes: Task 2 types; `Sound` from `src/content/sounds.ts`; `AudioButton`, `PitchLine`, `ToneChip`; `playSequence(texts: string[])` from `src/lib/play-sequence.ts`.
- Produces:
  - `ToneCompare({ rows, sounds }: { rows: ToneCompareRow[]; sounds: Sound[] })`: renders an explanation card (`data-testid="tone-explain"`) with the draft copy from spec section 3 and a legend of three `ToneChip`s, then one `<article data-testid={\`tc-${row.id}\`}>` per row. Each row has a header with the vowel letter and the matching vowel card's `compare` text (found as the `Sound` in `sounds` with `section === "vowels"` and `letter === row.vowel`; no hint when none), three cells in order mid, high, low (word in `<strong>`, English muted, `AudioButton`, `PitchLine`), and a "Play all" button calling `playSequence` with the three words.
  - `KeyConsonants({ sounds, sets }: { sounds: Sound[]; sets: ConsonantSet[] })`: three `<article>`s with `h3` headings "gb", "p" and "s versus ṣ" (test ids `key-gb`, `key-p`, `key-s-sh`). Each shows the matching sound card text (`compare` from the `Sound` with id `c-gb`, `c-p`, and both `c-s` and `c-sh` for the third), then the sets whose `focus` includes that value: the set's `explain`, its words with English and `AudioButton`, and a "Play all" button.

- [ ] **Step 1: Write failing tests** (audio mocked as in `SoundBank.test.tsx`, `playSequence` mocked):
  - `ToneCompare renders one row per row in mid, high, low order with English and a Play all that plays the three words in order`.
  - `ToneCompare shows the explanation card text mentioning the dot and the mark` (contains "dot" and "pitch").
  - `ToneCompare shows the vowel's English comparison from the vowel card`.
  - `KeyConsonants shows the three headings, and the ọ-high set under both gb and p`.
  - `KeyConsonants Play all plays a set's words in order`.

- [ ] **Step 2: Run to verify failure** (`npx vitest run src/components/ToneCompare.test.tsx src/components/KeyConsonants.test.tsx`; FAIL, modules not found), implement both components (layout: three columns on wide screens, stacked on narrow, within the existing `card`, `sound-row` and `muted` styles in `src/styles.css`), then re-run (PASS).

- [ ] **Step 3: Commit**

```bash
git add src/components/ToneCompare.tsx src/components/ToneCompare.test.tsx src/components/KeyConsonants.tsx src/components/KeyConsonants.test.tsx src/styles.css
git commit -m "feat: ToneCompare and KeyConsonants components"
```

---

### Task 5: Sounds mode in Practice

**Files:**
- Modify: `src/lib/tone-practice.ts`, `src/components/TonePractice.tsx`, `src/lib/tone-practice.test.ts`, `src/components/TonePractice.test.tsx`

**Interfaces:**
- Consumes: `ConsonantSet`.
- Produces: `type ToneMode = "words" | "sentences" | "sounds"`; `ToneSources` gains `sets: ConsonantSet[]` (required; add `sets: []` to the existing test fixtures). `buildToneRound("sounds", sources, seed, hasAudio?, max?)` returns, for each word with a clip in a set that has at least two words with clips, `{ id: "sounds:<key>", mode: "sounds", audioText: word, prompt: null, english: null, sentence: null, choices: every word of the set, answer: word }`, deduped by key across sets, with no vocab or pair questions.

- [ ] **Step 1: Write failing tests**
  - `tone-practice.test.ts`: `sounds mode: one question per word with a clip in a set, choices are the set's words, no English` (set bà, gà, gbà); `sounds mode skips a set with fewer than two clips`; `sounds mode never includes vocab twin or pair questions`; `a word in two sets is asked once`; and the existing `Words` mode tests still pass with `sets: []`.
  - `TonePractice.test.tsx`: `Sounds mode plays the word, shows the set as choices with no English, and keeps score` (click "Sounds", expect `Question 1 of 3`, choice texts equal the set); `a mode with no playable question shows the audio message for Sounds` (set clips off); the existing tests still pass.

- [ ] **Step 2: Run to verify failure**, implement (a third `MODES` entry labeled "Sounds"; treat `sounds` like `words` for question text, `ChoiceQuestion` prompt and feedback), then re-run.

Run: `npx vitest run src/lib/tone-practice.test.ts src/components/TonePractice.test.tsx && npx tsc --noEmit`
Expected: FAIL then PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/tone-practice.ts src/lib/tone-practice.test.ts src/components/TonePractice.tsx src/components/TonePractice.test.tsx
git commit -m "feat: Sounds mode in Practice for the consonant contrasts"
```

---

### Task 6: Restructure the Sound Bank page, remove the old tone cards

**Files:**
- Modify: `src/pages/SoundBank.tsx`, `src/pages/SoundBank.test.tsx`, `src/components/SoundCard.tsx`, `src/content/sounds.ts`, `src/content/validate-sounds.ts`, `src/content/sounds.test.ts`, `e2e/sounds.spec.ts`

**Interfaces:** Consumes everything above. Produces the page sections in this DOM order, each an `<h2>` inside `<section id=...>`: `Tones` (`#tones`), `Key consonants` (`#key-consonants`), `Minimal pairs` (`#minimal-pairs`), `Letters reference` (`#letters-reference`), `Practice` (`#practice`). The jump bar lists the same five names in the same order. `Letters reference` holds a `<details>` (collapsed) with `Vowels` and `Consonants` `<h3>` groups of `SoundCard`s, excluding the sounds with ids `c-gb`, `c-p`, `c-s` and `c-sh`. `Practice` passes `sets: CONSONANT_SETS` in its `sources`.

- [ ] **Step 1: Update tests first (they should fail)**
  - `SoundBank.test.tsx`: the heading test iterates the five new names with hrefs `#tones`, `#key-consonants`, `#minimal-pairs`, `#letters-reference`, `#practice`; add `renders the sections in the right order` (headings by level 2 in DOM order equal the five names); add `the tone grid has 11 rows` (`screen.getAllByTestId(/^tc-/)` length 11); keep the speaker-button test (it now reaches `ahọ́n` inside the collapsed details, which stays in the DOM) and the practice tests.
  - `sounds.test.ts`: remove the tones-section expectations (exactly one card per tone, tone cards' examples, `requires tone only on the tones section`, `allows up to 4 examples on a tones card`); keep `covers vowels plus nasals and consonants`.
  - `e2e/sounds.spec.ts`: the section names loop uses the five new names; replace the `ṣ` heading assertion with `heading "s versus ṣ"` visible; the dark-mode test still clicks the `Tones` jump link; add an assertion that `page.getByTestId(/^tc-/)` has count 11; the practice test is unchanged.

- [ ] **Step 2: Run to verify failure**: `npx vitest run src/pages/SoundBank.test.tsx src/content/sounds.test.ts`. Expected: FAIL.

- [ ] **Step 3: Implement**

Restructure `SoundBank.tsx` as above, rendering `ToneCompare` (with `SOUNDS`) and `KeyConsonants` (with `SOUNDS` and `CONSONANT_SETS`). Remove the three tone `Sound` entries (`t-high`, `t-mid`, `t-low`), `"tones"` from `SoundSection`, the `tone` field and its constructor argument on `Sound`, the tone-specific rules in `validateSounds`, and the tones branch in `SoundCard.tsx`. Delete anything that becomes unused (`ToneChip` stays: `ToneCompare` uses it).

- [ ] **Step 4: Verify**

Run: `npm test && npm run validate && npx tsc --noEmit && npx playwright test e2e/sounds.spec.ts`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add -A src e2e
git commit -m "feat: Sound Bank refocus with tone grid, key consonants and a collapsed reference"
```

---

### Task 7: Final check in the browser

**Files:** none new.

- [ ] **Step 1: Full checks**

Run: `npm test && npm run validate && npm run build && npx playwright test e2e/sounds.spec.ts`
Expected: all pass.

- [ ] **Step 2: Look at it**

Run `npm run dev` and open `/sounds`. Check at desktop width and at 390px phone width, in light and dark: the explanation card and legend; all 11 grid rows (three cells per row, play buttons, pitch lines, Play all); the three consonant cards with their sets (including the 4-word sets); the collapsed reference opens and its audio buttons work; the Practice section is last with Words, Sentences and Sounds modes and Sounds quizzes a set; no console errors. Listen to every new clip once in the app, especially kọ, kọ̀, pọ́ and pọ̀, which are about 0.3 seconds. Report what you see, including anything odd about how tones render or wrap.

- [ ] **Step 3: Report**

Summarize what shipped, anything found in the listening check, and that nothing was pushed unless the user asks.
