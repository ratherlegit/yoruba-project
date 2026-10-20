# Sentence Transformation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/transform` page where the learner types the negative, question, future or past form of a Yoruba sentence, graded in an easy mode (dots and tones ignored) and an advanced mode (exact).

**Architecture:** A pure grading module (`src/lib/transform-grade.ts`) built on the existing `cleanAnswer`, `stripMarks` and `stripTones` helpers; a content file with a validator and review section wired like proverbs; a small `YorubaKeys` typing-aid component; and a page holding the index, mode and per-item results in React state.

**Tech Stack:** TypeScript, React, TanStack Router, Vitest + Testing Library, Playwright, `tsx` scripts.

**Spec:** `docs/superpowers/specs/2026-10-20-sentence-transformation-design.md`

## Global Constraints

- No em dashes (U+2014) in any content or source file (`src/no-em-dash.test.ts` enforces it; in validators build the character with `String.fromCharCode(0x2014)`).
- All Yoruba strings are NFC with tone marks.
- Every item has `confidence: "needs-review"`, a `source`, and a `note` naming the doubt.
- No audio ships.
- One attempt per item; Next unlocks after checking; the mode switch is not saved.
- Easy mode ignores dots and tone marks; advanced mode needs both exact; capitalisation, spacing and final `.`, `?`, `!` are ignored in both modes.
- An item whose unchanged base sentence would pass in either mode is invalid.
- An item with no sourced pattern is left out, even if the batch ends under 20.

## Review Focus

- A correct answer typed as decomposed (NFD) text, with capital letters, extra spaces or a final `?` must pass (Task 1 test).
- The unchanged base sentence must fail in both modes (Task 2 validator test, applied to the real data in Task 4).
- Tapping a tone mark with the caret at the start of the box, or after a space, must not insert a stray combining mark (Task 3 test).
- Going Previous to a checked item must show it as left, box disabled, not re-askable (Task 3 test).
- Empty `TRANSFORMS` array: friendly message, no crash (Task 3 test).
- Last item: Next disabled (Task 3 test).

---

### Task 1: Grading module

**Files:**
- Create: `src/lib/transform-grade.ts`, `src/lib/transform-grade.test.ts`

**Interfaces:**
- Consumes: `cleanAnswer`, `stripMarks` from `src/lib/normalize.ts`.
- Produces: `type TransformMode = "easy" | "advanced"`; `type TransformResult = "right" | "close" | "wrong"`; `comparable(s: string): string` (NFC, trimmed, collapsed spaces, lowercased, trailing `.?!` removed); `foldMarks(s: string): string` (`comparable` then `stripMarks`); `gradeTransform(input: string, answers: string[], mode: TransformMode): TransformResult`.

- [ ] **Step 1: Write failing tests** in `transform-grade.test.ts` (`describe("gradeTransform")`, answers `["Mi ò lọ"]` unless stated):
  - advanced: exact match is "right"; same text typed as NFD, in capitals, with double spaces and a final "." is "right";
  - advanced: "Mi o lo" (no dots, no tones) is "close"; "Mi ò lo" is "close"; "Mi ò lọ́" (wrong tone) is "close"; "Mo ò lọ" is "wrong";
  - easy: "Mi o lo", "mi ò lọ" and "Mi ò lọ́" are all "right"; "Mo o lo" is "wrong";
  - an answer matching any entry of several accepted answers (`["Mo máa lọ", "Mo yóò lọ"]`) is "right" in advanced mode;
  - a final "?" is ignored: `["Ṣé o lọ?"]` accepts "se o lo" in easy mode;
  - empty or whitespace input is "wrong" in both modes;
  - `comparable` and `foldMarks` return the expected strings for one example each.
- [ ] **Step 2: Run** `npx vitest run src/lib/transform-grade.test.ts`. Expected: FAIL, module not found.
- [ ] **Step 3: Implement** the four exports. `gradeTransform` returns "right" when `comparable(input)` equals any `comparable(answer)` (advanced) or `foldMarks(input)` equals any `foldMarks(answer)` (easy); in advanced mode a fold-only match is "close"; empty folded input is always "wrong".
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: transform answer grading"`.

### Task 2: Content model, validator, review and validate wiring

**Files:**
- Create: `src/content/transforms.ts`, `src/content/validate-transforms.ts`, `src/content/validate-transforms.test.ts`
- Modify: `src/lib/review.ts`, `src/lib/review.test.ts`, `scripts/generate-review.ts`, `scripts/validate-content.ts`

**Interfaces:**
- Consumes: `Confidence` from `src/content/types.ts`; `strings` from `src/content/validate.ts`; `foldMarks` from Task 1.
- Produces: `type TransformKind = "negative" | "question" | "future" | "past"`; `type Transform = { id: string; kind: TransformKind; base: string; baseEnglish: string; answers: string[]; rule: string; source: string; confidence: Confidence; note?: string }`; `const TRANSFORMS: Transform[]` (empty in this task); `INSTRUCTIONS: Record<TransformKind, string>` ("Make this negative", "Turn this into a question", "Say this in the future", "Say this in the past"); `validateTransforms(entries: Transform[]): string[]`; `buildReviewMarkdown(..., proverbs, transforms: Transform[] = [])` gains a trailing parameter and a "## Transformations" section.

- [ ] **Step 1: Write failing validator tests** (valid `entry()` factory with overrides, in the style of `validate-proverbs.test.ts`). Cases, each asserting the message substring: accepts a valid entry; "duplicate id"; "needs a source"; "needs-review needs a note"; "empty field" for base, baseEnglish and rule; "needs at least one answer"; "duplicate answer"; "not NFC"; "em dash"; "unchanged sentence would pass" when an answer folds to the same text as the base (e.g. base "Mo lọ", answers ["mo lo"]).
- [ ] **Step 2: Run** `npx vitest run src/content/validate-transforms.test.ts`. Expected: FAIL, module not found.
- [ ] **Step 3: Implement** the types, `INSTRUCTIONS`, `TRANSFORMS = []` and `validateTransforms` (errors prefixed with the id; NFC and em dash checks over `strings(e)`; fold comparison with `foldMarks`).
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Write a failing review test** in `review.test.ts`: with one transform, `buildReviewMarkdown([], [], undefined, [], [], [t])` contains "## Transformations", the id, the base, every accepted answer, the rule, the source and the note. Run it; Expected: FAIL.
- [ ] **Step 6: Implement** the section in `src/lib/review.ts` (one block per needs-review transform; count it in `total`), pass `TRANSFORMS` from `scripts/generate-review.ts`, add `validateTransforms(TRANSFORMS)` to `scripts/validate-content.ts`. The existing "matches the committed content/REVIEW.md" test must also pass `TRANSFORMS`.
- [ ] **Step 7: Run** `npm test && npm run validate`. Expected: all pass.
- [ ] **Step 8: Commit** `git add -A && git commit -m "feat: transform content model, validator and review section"`.

### Task 3: Typing aid, page, route and nav link

**Files:**
- Create: `src/components/YorubaKeys.tsx`, `src/lib/insert-char.ts`, `src/lib/insert-char.test.ts`, `src/pages/Transform.tsx`, `src/pages/Transform.test.tsx`
- Modify: `src/router.tsx`, `src/components/Layout.tsx`, `src/styles.css`

**Interfaces:**
- Consumes: `Transform`, `TRANSFORMS`, `INSTRUCTIONS` from Task 2; `gradeTransform`, `TransformMode` from Task 1.
- Produces: `insertChar(value: string, caret: number, ch: string): { value: string; caret: number }` (NFC-normalising; a combining mark U+0300 or U+0301 attaches to the character before the caret, and is dropped if there is no letter before the caret); `YorubaKeys({ onInsert }: { onInsert: (ch: string) => void })` rendering buttons labelled ẹ, ọ, ṣ, acute, grave; `export function Transform({ items = TRANSFORMS }: { items?: Transform[] })`; test ids `transform-card`, `transform-position` ("Sentence 1 of N"), `transform-input`, `transform-result`, `transform-reveal`; buttons named "Check", "Previous", "Next"; mode switch as two buttons named "Easy" and "Advanced" (`aria-pressed`).

- [ ] **Step 1: Write failing `insertChar` tests**: inserting ọ mid-string moves the caret one place right; acute after "a" gives "á" and the string is NFC; grave after "ọ" gives a string equal to `"ọ̀".normalize("NFC")`; a mark at caret 0 or after a space returns the value unchanged; the caret is clamped to the string.
- [ ] **Step 2: Run** `npx vitest run src/lib/insert-char.test.ts`. Expected: FAIL.
- [ ] **Step 3: Implement** `insertChar`. Run the test. Expected: PASS.
- [ ] **Step 4: Write failing page tests** in `Transform.test.tsx` with a four-item fixture (one per kind, each with `answers` and `rule`):
  - shows "Sentence 1 of 4", the base, its English, the instruction for its kind, an input and a Check button; no result before checking; Next disabled;
  - typing the exact answer in advanced mode and pressing Check shows `transform-result` containing "Correct" and `transform-reveal` containing the model answer and the rule;
  - typing the answer without dots in advanced mode shows "Right words, check the dots and tones" and the correct sentence; the same text in easy mode shows "Correct";
  - a wrong answer shows "Not quite" with the user's text and the correct sentence;
  - Check on an empty box does nothing;
  - after checking, the input is disabled and Next goes to "Sentence 2 of 4"; Previous returns to sentence 1 still checked, input disabled and showing the typed text;
  - tapping the ọ key inserts "ọ" at the caret of the input;
  - Next disabled on the last item; Previous disabled on the first;
  - `items={[]}` renders "No sentences yet";
  - the mode buttons set `aria-pressed`; changing mode after checking does not change the shown result;
  - the nav has a "Transform" link to `/transform`.
- [ ] **Step 5: Run** `npx vitest run src/pages/Transform.test.tsx`. Expected: FAIL, module not found.
- [ ] **Step 6: Implement** `YorubaKeys.tsx` (buttons call `onInsert`; `type="button"`; `onMouseDown` preventDefault so the input keeps focus), and `Transform.tsx`: state `index`, `mode`, `drafts: Record<id, string>` and `checked: Record<id, { given: string; result: TransformResult }>`; heading "Transform"; card with `yo` base sentence, English, instruction, input (`lang="yo"`, `autoComplete="off"`, `spellCheck={false}`, `autoCapitalize="off"`, Enter submits), `YorubaKeys` using `insertChar` with the input's `selectionStart`, then the result and reveal after checking. Copy for results: "Correct.", "Right words, check the dots and tones." and "Not quite."; the reveal shows "Your answer", "Model answer" (bold, `answers[0]`), "Also accepted" when there is more than one, and the rule. Style `.transform-card`, `.transform-input`, `.yo-keys`, `.transform-reveal` in `styles.css` with existing tokens.
- [ ] **Step 7: Wire** a `/transform` route in `src/router.tsx` and a "Transform" link in `Layout.tsx` between "Proverbs" and "About".
- [ ] **Step 8: Run** `npm test && npx tsc --noEmit`. Expected: PASS.
- [ ] **Step 9: Commit** `git add -A && git commit -m "feat: transform page, typing aid, route and nav link"`.

### Task 4: Content (about 20 sourced sentences)

**Files:**
- Create: `src/content/transforms-data.test.ts`
- Modify: `src/content/transforms.ts`, `content/REVIEW.md` (generated)

**Interfaces:**
- Consumes: `Transform`, `validateTransforms`, `gradeTransform`.

- [ ] **Step 1: Write failing data tests** over the real `TRANSFORMS`: each kind has at least 3 items; for every item the base sentence graded against its own answers is "wrong" in both modes; every `answers[0]` graded against itself is "right" in advanced mode; ids unique. Run `npx vitest run src/content/transforms-data.test.ts`. Expected: FAIL (the empty array has no items per kind).
- [ ] **Step 2: Research** the patterns with the Wiktionary API (`curl`, `action=parse&prop=wikitext`, with retries and sleeps) and the lessons' own sources (`src/content/lessons`): negation with kò/ò (mo becomes mi before ò), ṣé questions, future with máa/yóò, ń progressive versus bare verb. Keep a scratch list (sentence, pattern, source) in the scratchpad. Use vocabulary the app already teaches.
- [ ] **Step 3: Write about 20 entries** (five per kind, interleaved in the order negative, question, future, past, repeating), each with every accepted answer (most natural first), a one-line `rule`, a `source` naming what was consulted, and a `note` naming the tone or contraction doubt. For the past kind the base is a progressive sentence and the answer drops ń. Drop any sentence whose pattern cannot be sourced; report the real count.
- [ ] **Step 4: Self-check**: read each item's accepted answers as a learner would, and add any natural alternative that is missing.
- [ ] **Step 5: Run** `npm run validate && npm test`. Expected: PASS.
- [ ] **Step 6: Run** `npm run review` and confirm the "## Transformations" section lists every entry.
- [ ] **Step 7: Commit** `git add -A && git commit -m "content: transform sentences first batch, all needs-review"`.

### Task 5: End-to-end check and final run

**Files:**
- Create: `e2e/transform.spec.ts`

- [ ] **Step 1: Write** the e2e test: from `/`, click the "Transform" nav link, expect URL `/transform`, expect "Sentence 1 of" visible, fill `transform-input` with the first item's model answer (read from the page's reveal-free data by importing `TRANSFORMS` in the spec), click Check, expect `transform-result` to contain "Correct", click Next, expect "Sentence 2 of". A second test pastes a decomposed (NFD) copy of the model answer and expects "Correct". A dark-mode test (click "Switch to dark mode") checks the card is visible.
- [ ] **Step 2: Run** `npm run e2e -- e2e/transform.spec.ts`. Expected: PASS.
- [ ] **Step 3: Run** the whole suite: `npm test && npm run validate && npm run build`. Expected: all pass.
- [ ] **Step 4: Commit** `git add -A && git commit -m "test: transform e2e"`.
