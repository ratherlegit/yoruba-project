# Tone Practice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Sound Bank's Practice section with a tone-listening activity that has an easier Words mode and a harder Sentences mode, built from vocab words, vocab sentences, Sound Bank tone pairs, and a new curated list of real tone-twins.

**Architecture:** A new content file holds text-only twins keyed by vocab word id. A pure builder (`buildToneRound`) turns vocab, twins and Sound Bank pairs into questions per mode, and a new `TonePractice` component runs a round. The component replaces `SoundPractice` on the Sound Bank page. No new audio: answers always come from words and sentences that already have clips.

**Tech Stack:** TypeScript, React, Vite, Vitest + Testing Library (jsdom), Playwright e2e, existing `tsx` validate/review scripts.

**Spec:** `docs/superpowers/specs/2026-10-19-tone-practice-design.md`

## Global Constraints

- No em dashes anywhere (code, copy, docs). `src/no-em-dash.test.ts` and `validateSounds` enforce this for content.
- Yoruba strings are NFC. Compare words with `.normalize("NFC").toLowerCase()`.
- Round length is 10 (`TONE_ROUND_SIZE`).
- Twins are 1 to 3 real words per entry, same letters as the vocab word with only tone marks (acute, grave, macron) different; under-dots stay. No invented words.
- Every twin entry has `confidence: "needs-review"`, a non-empty `source`, and a `note` naming the doubt. Nothing is marked verified.
- English is shown only for the sentence in Sentences mode. Never for choices, never in Words mode.
- A question exists in a mode only if its clip exists: word clip for Words mode, sentence clip for Sentences mode. Use `audioUrlFor` from `src/lib/audio.ts`.
- Keep `data-testid="practice"` on the section and `data-testid="choice"` on choices (e2e and page tests rely on them). When a mode has no playable question, the message must contain the word "audio" (`e2e/sounds.spec.ts` checks it).
- Run tests with `npm test`, content checks with `npm run validate`.

## Review Focus

- Target word at the start of a sentence (capital letter): the gap must still be found and the choices stay lowercase. Test in Task 2.
- A vocab word whose sentence blanks a different substring (for example ọ̀kan blanks "kan"): it must not appear in Sentences mode, since a twin cannot replace the blanked text; it still appears in Words mode. Test in Task 2.
- A pair word that is also a vocab twin-entry word: one question, not two. Test in Task 2.
- A mode with zero playable questions (audio not generated): friendly message, no crash, switch still works. Test in Task 3.
- Switching mode in the middle of a round: resets to question 1 and score 0. Test in Task 3.

## File Structure

- Create `src/content/tone-twins.ts`: `ToneTwin`, `ToneTwinEntry` types and the `TONE_TWINS` data.
- Create `src/content/validate-tone-twins.ts`: `validateToneTwins`.
- Modify `src/lib/tone.ts`: add `stripTones`.
- Create `src/lib/tone-practice.ts`: `buildToneRound` and types.
- Create `src/components/TonePractice.tsx`: the activity.
- Modify `src/pages/SoundBank.tsx`: swap in the new activity.
- Modify `src/lib/review.ts`, `scripts/generate-review.ts`, `scripts/validate-content.ts`.
- Delete `src/components/SoundPractice.tsx`, `src/components/SoundPractice.test.tsx`, `src/lib/sound-practice.ts`, `src/lib/sound-practice.test.ts`.

---

### Task 1: Twin data model, tone stripping, validation

**Files:**
- Create: `src/content/tone-twins.ts`, `src/content/validate-tone-twins.ts`
- Modify: `src/lib/tone.ts`, `scripts/validate-content.ts`
- Test: `src/content/validate-tone-twins.test.ts`, `src/lib/tone.test.ts`

**Interfaces:**
- Produces:
  - `stripTones(s: string): string` in `src/lib/tone.ts`: NFD, remove U+0300, U+0301, U+0304, recompose NFC, lowercase.
  - `type ToneTwin = { yoruba: string; english: string }`
  - `type ToneTwinEntry = { vocabId: string; twins: ToneTwin[]; source: string; confidence: Confidence; note?: string }`
  - `const TONE_TWINS: ToneTwinEntry[]` (empty until Task 6)
  - `validateToneTwins(entries: ToneTwinEntry[], vocab: VocabLevel[]): string[]` (error strings, empty when valid)

- [ ] **Step 1: Write failing tests**

`src/lib/tone.test.ts` (add): `stripTones("ọkọ̀") === "ọkọ"`, `stripTones("ẹ̀yìn") === "ẹyin"` (under-dot kept), `stripTones("ÌGBÀ") === "igba"`.

`src/content/validate-tone-twins.test.ts`, with a fixture `vocab` of one level and one topic containing words `{ id: "word-vehicle", yoruba: "ọkọ̀", ... }` and `{ id: "phrase", yoruba: "ẹ kú àárọ̀", ... }`. Tests (each asserts on the returned array):
  - `accepts a valid entry`: twins ọkọ, ọkọ́ give `[]`.
  - `rejects an unknown vocab id`: an error containing `unknown vocab id`.
  - `rejects a multi-word vocab word`: error containing `single word`.
  - `rejects a twin that differs in more than tone`: twin `oko` (no dots) gives an error containing `same letters`.
  - `rejects a twin equal to the word or to another twin`: error containing `distinct`.
  - `rejects 0 twins and 4 twins`: error containing `1 to 3 twins`.
  - `rejects a duplicate vocabId`: error containing `duplicate`.
  - `rejects empty source and needs-review without a note`: errors containing `source` and `note`.
  - `rejects non-NFC text and em dashes`: errors containing `NFC` and `em dash`.
  - `rejects a twin whose tone pattern cannot be computed`: a twin such as `xq` gives an error containing `tone pattern`.

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/lib/tone.test.ts src/content/validate-tone-twins.test.ts`
Expected: FAIL (`stripTones` and `validateToneTwins` not defined).

- [ ] **Step 3: Implement**

`stripTones` in `src/lib/tone.ts`. Types and `TONE_TWINS = []` in `src/content/tone-twins.ts`. `validateToneTwins` in `src/content/validate-tone-twins.ts` follows `validateSounds` (`src/content/validate-sounds.ts`): same `strings()` helper from `./validate` for the NFC and em dash checks, one error string per problem prefixed with the `vocabId`. Look up the vocab word with `allVocabWords`-style flattening over the `vocab` argument. "Same letters" means `stripTones(twin) === stripTones(word)`. "Tone pattern computable" means `syllabify(twin)` does not throw.

- [ ] **Step 4: Wire into `scripts/validate-content.ts`**

Import `TONE_TWINS` and `validateToneTwins`, run it against `VOCAB_LEVELS` next to the `validateSounds` call using the same error-counting pattern.

- [ ] **Step 5: Verify**

Run: `npx vitest run src/lib/tone.test.ts src/content/validate-tone-twins.test.ts && npm run validate`
Expected: PASS and `OK: ...`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/tone.ts src/lib/tone.test.ts src/content/tone-twins.ts src/content/validate-tone-twins.ts src/content/validate-tone-twins.test.ts scripts/validate-content.ts
git commit -m "feat: tone twin data model, stripTones and validation"
```

---

### Task 2: Round builder

**Files:**
- Create: `src/lib/tone-practice.ts`
- Test: `src/lib/tone-practice.test.ts`

**Interfaces:**
- Consumes: `ToneTwinEntry` (Task 1); `VocabLevel`, `VocabWord` from `src/content/vocab/types.ts`; `MinimalPair` from `src/content/sounds.ts`; `blankOf`, `locateBlank` from `src/content/vocab/validate.ts`; `audioUrlFor` from `src/lib/audio.ts`; `seededShuffle` from `src/lib/shuffle.ts`.
- Produces:
  - `const TONE_ROUND_SIZE = 10`
  - `type ToneMode = "words" | "sentences"`
  - `type ToneSources = { twins: ToneTwinEntry[]; vocab: VocabLevel[]; pairs: MinimalPair[] }`
  - `type ToneQuestion = { id: string; mode: ToneMode; audioText: string; prompt: string | null; english: string | null; choices: string[]; answer: string }`. In Sentences mode `prompt` is the vocab sentence with the blank replaced by exactly one `___`, `english` is the sentence translation, and `audioText` is the sentence. In Words mode `prompt` and `english` are null and `audioText` is the word.
  - `buildToneRound(mode: ToneMode, sources: ToneSources, seed: string, hasAudio?: (text: string) => boolean, max?: number): ToneQuestion[]`. `hasAudio` defaults to `audioUrlFor(text) !== null`; `max` defaults to `TONE_ROUND_SIZE`.

- [ ] **Step 1: Write failing tests**

Fixtures: one vocab level with words ọkọ̀ (sentence "Ọkọ̀ mi pupa.", english "My car is red."), ọ̀kan (sentence "Imú kan ṣoṣo ni mo ní.", blank "kan"), and ẹ̀yìn; twin entries for each; one tone pair (igba, ìgbà, igbá), one sound pair (`contrast: "sound"`); `hasAudio` as a Set-backed function. Tests:
  - `words mode: a vocab entry gives the word as audioText, answer, and choices word plus twins`.
  - `words mode skips a vocab word without a word clip`.
  - `words mode adds one question per word of a tone pair with at least two clips, and skips a pair with fewer than two or a sound pair`.
  - `a pair word that is also a vocab entry word appears once` (the id list has no duplicate answers).
  - `sentences mode: audioText is the sentence, prompt holds one ___, english is the translation`.
  - `sentences mode finds a capitalized target at the sentence start`: prompt `___ mi pupa.`, answer `ọkọ̀` (lowercase).
  - `sentences mode skips a word whose blank differs from the word` (ọ̀kan), while `words mode` still includes it.
  - `sentences mode skips a word without a sentence clip and never uses pair-only words`.
  - `a round has unique ids, is at most max, and is shorter when the pool is smaller`.
  - `the same seed gives the same round and a different seed a different order` (use a pool of at least 12 words).

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/lib/tone-practice.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `buildToneRound`**

Build the candidate list per mode as in the spec section 5, dedupe by NFC-lowercase answer with vocab entries taking precedence over pair words, id `${mode}:${answer}`, then `seededShuffle(candidates, seed).slice(0, max)`. Sentences mode only accepts a vocab entry when `blankOf(word)` equals the word (NFC, lowercase) and `locateBlank(sentence, blank).count === 1`. Build the prompt with `locateBlank`'s start and end, as `buildGap` in `src/lib/vocab-questions.ts` does. Only single-word vocab entries reach this point (validation guarantees it).

- [ ] **Step 4: Run to verify pass, then commit**

Run: `npx vitest run src/lib/tone-practice.test.ts`
Expected: PASS.

```bash
git add src/lib/tone-practice.ts src/lib/tone-practice.test.ts
git commit -m "feat: tone practice round builder"
```

---

### Task 3: TonePractice component

**Files:**
- Create: `src/components/TonePractice.tsx`
- Test: `src/components/TonePractice.test.tsx`

**Interfaces:**
- Consumes: `buildToneRound`, `ToneMode`, `ToneSources`, `ToneQuestion` (Task 2); `AudioButton`, `ChoiceQuestion`, `PitchLine` from `src/components`.
- Produces: `TonePractice({ sources }: { sources: ToneSources })`. Same shape as `SoundPractice` (`src/components/SoundPractice.tsx`): a `<section className="card" data-testid="practice">`, "Question i of N", score, "See score", "Try again".

- [ ] **Step 1: Write failing tests**

Mock `@/lib/audio` as `SoundPractice.test.tsx` does (`audioUrlFor: vi.fn()`) and stub `Audio`. Use fixtures like Task 2. Tests:
  - `starts in Words mode with a "Play the word" button and no English`.
  - `Sentences mode shows the gapped sentence, its English translation and a "Play the sentence" button, and no English on the choices` (choice buttons contain only the Yoruba spelling).
  - `answering marks the correct choice and shows a pitch line; a wrong answer shows two pitch lines` (assert `getAllByLabelText(/Pitch pattern for/)` length 1 for right, 2 for wrong).
  - `in Sentences mode the gap fills with the correct word after answering` (no `___` left in the section text).
  - `runs through every question, shows "You got x of N right.", and Try again restarts at question 1`.
  - `switching mode mid-round resets to question 1 and score 0`.
  - `a mode with no playable question shows a message containing "audio" and the switch still works`.

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/components/TonePractice.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `TonePractice`**

Mode switch: a `role="group"` named "Mode" with two buttons "Words" and "Sentences" using `aria-pressed`; default Words. State: mode, attempt, index, chosen, score; changing mode or Try again bumps the round and resets index, chosen and score. Round via `useMemo(() => buildToneRound(mode, sources, \`tone#${mode}#${attempt}\`), ...)`. Question text: Words "Listen, then pick the word you heard."; Sentences "Listen to the sentence, then pick the word that fills the gap." with the gapped prompt and English line below. Reuse `ChoiceQuestion` with prompt "Which word did you hear?" in Words mode and "Which word fills the gap?" in Sentences mode. After answering: show the correct word, `PitchLine` for it, an `AudioButton` labelled "Listen again", and when wrong a `PitchLine` for the chosen word labelled "You chose". Empty mode: "Listening practice needs audio, which is still being added. Check back soon." Copy has no em dashes.

- [ ] **Step 4: Run to verify pass, then commit**

Run: `npx vitest run src/components/TonePractice.test.tsx`
Expected: PASS.

```bash
git add src/components/TonePractice.tsx src/components/TonePractice.test.tsx
git commit -m "feat: TonePractice component with Words and Sentences modes"
```

---

### Task 4: Replace the old practice on the Sound Bank page

**Files:**
- Modify: `src/pages/SoundBank.tsx`, `src/pages/SoundBank.test.tsx`
- Delete: `src/components/SoundPractice.tsx`, `src/components/SoundPractice.test.tsx`, `src/lib/sound-practice.ts`, `src/lib/sound-practice.test.ts`

**Interfaces:** Consumes `TonePractice`, `TONE_TWINS`, `VOCAB_LEVELS`, `MINIMAL_PAIRS`. Produces: the Practice section on `/sounds` now renders `<TonePractice sources={{ pairs: MINIMAL_PAIRS, twins: TONE_TWINS, vocab: VOCAB_LEVELS }} />`, with the same heading, `id="practice"` and `practice-wrap` container.

- [ ] **Step 1: Update `SoundBank.test.tsx` first**

Keep the existing `practice gives feedback and offers Try again` test (it should still pass through the tone-pair path because the mocked audio has ọkọ, ọkọ̀, ọkọ́). Add `the Practice section offers Words and Sentences modes`: `screen.getByRole("button", { name: "Sentences" })` exists inside `getByTestId("practice")`.

- [ ] **Step 2: Run to verify the new test fails**

Run: `npx vitest run src/pages/SoundBank.test.tsx`
Expected: FAIL on the new test.

- [ ] **Step 3: Swap the component and delete the old files**

Edit `src/pages/SoundBank.tsx`; delete the four old files with `git rm`. Search for remaining imports: `grep -rn "SoundPractice\|sound-practice" src e2e`. Expected: no hits.

- [ ] **Step 4: Verify**

Run: `npm test && npx tsc --noEmit && npx playwright test e2e/sounds.spec.ts`
Expected: all pass. If the e2e test fails on the old "Which word did you hear?" wording, update `e2e/sounds.spec.ts` to match the new copy.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: tone practice replaces the Sound Bank practice"
```

---

### Task 5: Review file support

**Files:**
- Modify: `src/lib/review.ts`, `scripts/generate-review.ts`
- Test: `src/lib/review.test.ts`

**Interfaces:** `buildReviewMarkdown(levels, vocabLevels = [], soundData?, toneTwins: ToneTwinEntry[] = [])`: a fourth optional parameter. Adds a `## Tone twins` section after Sound Bank when any entry needs review, counted in the "N items need review" total.

- [ ] **Step 1: Write the failing test**

`review.test.ts`: `lists tone twins with their English, source and doubt`: with one needs-review entry for a fixture vocab word, the output contains `## Tone twins`, the word, `ọkọ́ (hoe)`, the source string and the note; and the header count increases by one. A verified entry or an empty list adds no section.

- [ ] **Step 2: Run to verify failure, implement, verify**

Run: `npx vitest run src/lib/review.test.ts` (FAIL), then implement following the Sound Bank block in `buildReviewMarkdown`, then re-run (PASS). Update `scripts/generate-review.ts` to pass `TONE_TWINS`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/review.ts src/lib/review.test.ts scripts/generate-review.ts
git commit -m "feat: list tone twins in the review file"
```

---

### Task 6: Draft the first batch of twins (content)

**Files:**
- Modify: `src/content/tone-twins.ts`, regenerate `content/REVIEW.md`

**Interfaces:** Fills `TONE_TWINS` with `ToneTwinEntry` values. Test: the existing validation from Task 1.

This task is research, not code, and the result is Yoruba content that a native speaker must check.

- [ ] **Step 1: List the candidates**

Print every single-word vocab entry (`id`, `yoruba`, `english`) from `VOCAB_LEVELS` (about 214 words) to work from.

- [ ] **Step 2: Find real twins**

For each word, look for other real Yoruba words with the same letters (under-dots included) and different tone marks, using published sources (dictionaries and grammars, consulted online or otherwise available). Add an entry only when a source confirms every twin. Record in `source` only sources actually consulted, in a form a reviewer can find again. Leave out any word whose twins you cannot confirm. Set `confidence: "needs-review"` and a `note` naming the doubt. Write each twin's English for the reviewer.

- [ ] **Step 3: Validate and regenerate**

Run: `npm run validate && npm run review && npm test`
Expected: `OK`, `content/REVIEW.md` has a Tone twins section, all tests pass.

- [ ] **Step 4: Report before committing**

Tell the user how many entries were found (the target is at least 30; report the true number if lower), list them with sources and doubts, and list the vocab words you looked at but left out. Commit after the user has seen the list.

```bash
git add src/content/tone-twins.ts content/REVIEW.md
git commit -m "content: first batch of tone twins (needs-review)"
```

---

### Task 7: End-to-end check

**Files:** none new.

- [ ] **Step 1: Full checks**

Run: `npm test && npm run validate && npm run build && npx playwright test e2e/sounds.spec.ts`
Expected: all pass.

- [ ] **Step 2: Look at it in the browser**

Run `npm run dev` and open `/sounds`. Check, in light and dark themes: Words mode plays a word and answering shows the pitch line; Sentences mode shows the gapped sentence with its English, the choices have no English, and the gap fills after answering; switching mode resets; the page order is Vowels, Consonants, Tones, Minimal pairs, Practice. Report what you see, including anything odd about how tones render.

- [ ] **Step 3: Report**

Summarize what shipped, the twin count, and that nothing was pushed unless the user asks.
