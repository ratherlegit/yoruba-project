# Landing Page and Stats Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/` into a menu of five large activity cards (each with a Yoruba-object icon) plus a short stats strip, move the grammar levels to `/grammar`, and add a `/stats` page backed by a new local store that tone practice, Proverbs and Transform write to.

**Architecture:** A pure `src/lib/stats.ts` (types, load/save, record functions, summaries) and `src/lib/stats-summary.ts` (landing figures), a `useStats` hook shaped like `useVocabProgress`, an `ActivityIcon` component beside `LevelIcon`, one-line recording calls in three activities, and three pages (`Home`, `Grammar`, `Stats`).

**Tech Stack:** TypeScript, React, TanStack Router, Vitest + Testing Library, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-20-landing-and-stats-design.md`

## Global Constraints

- No em dashes (U+2014) in any source or copy (`src/no-em-dash.test.ts`). No eyebrow labels. Never display environmental impact figures.
- localStorage only; key `yp:stats:v1`; every storage access in try/catch; corrupt or missing data falls back to `emptyStats`. Existing keys `yp:progress:v1` and `yp:vocab-progress:v1` are only read.
- Stored data is ids, counts, results and `YYYY-MM-DD` dates only.
- Recording happens only in event handlers, never in render or effects. Each proverb counts once (first answer). Each Transform item counts once per mode. Tone practice counts every answer.
- With no data, nothing shows zeros, NaN or 0%: accuracy with no answers is `null` and renders as nothing.
- Counts of lessons, topics and proverbs come from the content arrays, never hard-coded.
- Icons: 64 by 64 viewBox, same stroke settings and gold tile as `LevelIcon`, decorative (`aria-hidden`). None repeats a level icon (cowrie, calabash, talking drum, aṣọ òkè, palm tree). No sacred objects.
- Existing home-page tests and e2e checks that assume the levels are on `/` are moved to `/grammar`, not deleted.

## Review Focus

- A fresh visitor (empty storage) sees the empty state on the strip and on every stats section, with no zeros or NaN (Tasks 4, 6).
- Storage blocked or throwing: every activity still works and the pages render (Tasks 1, 2).
- Double counting: re-render, Previous/Next, revisiting a checked item, and a second visit to a proverb or Transform item must not add to the stats (Task 2).
- "Close" Transform results are not counted as right in accuracy (Task 1).
- Consecutive-day run across month and year boundaries, and when today has no activity but yesterday did (Task 1).
- Nav at phone width (375px) shows every link with no horizontal scroll (Task 7).

---

### Task 1: Stats library and hook

**Files:**
- Create: `src/lib/stats.ts`, `src/lib/stats.test.ts`, `src/lib/stats-summary.ts`, `src/lib/stats-summary.test.ts`, `src/hooks/useStats.ts`, `src/hooks/useStats.test.tsx`

**Interfaces:**
- Consumes: `ToneMode` from `src/lib/tone-practice.ts`; `TransformKind` from `src/content/transforms.ts`; `TransformMode`, `TransformResult` from `src/lib/transform-grade.ts`.
- Produces (`stats.ts`):
  - `type Stats = { tone: Record<ToneMode, { answered: number; correct: number }>; proverbs: Record<string, { correct: boolean }>; transform: Record<string, { kind: TransformKind; mode: TransformMode; result: TransformResult }>; days: string[] }`; the `transform` key is `${mode}:${id}`.
  - `emptyStats: Stats`; `loadStats(storage?: Storage | null): Stats`; `saveStats(s: Stats, storage?: Storage | null): void`.
  - `dayKey(d: Date): string` (local `YYYY-MM-DD`).
  - `recordToneAnswer(s, mode: ToneMode, correct: boolean, now?: Date): Stats`; `recordProverbAnswer(s, id: string, correct: boolean, now?: Date): Stats` (no change if the id is already present, apart from adding the day); `recordTransformResult(s, id: string, kind: TransformKind, mode: TransformMode, result: TransformResult, now?: Date): Stats` (no change if `${mode}:${id}` already present).
  - `accuracy(correct: number, answered: number): number | null` (null when `answered` is 0, else a 0 to 100 integer).
  - `toneSummary(s)`, `proverbSummary(s)` returning `{ guessed: number; right: number }`, `transformSummary(s)` returning `{ byKind: Record<TransformKind, Tally>; byMode: Record<TransformMode, Tally> }` where `Tally = { right: number; close: number; wrong: number; total: number }`, `practiceAnswers(s): { answered: number; correct: number }` (tone answers plus proverb guesses plus Transform checks; only `right` and correct count as correct), `practiceDays(s): number`, `currentRun(s, now?: Date): number` (consecutive days ending today, or ending yesterday if today has none).
- Produces (`stats-summary.ts`): `type StripFigure = { label: string; value: string }`; `buildStrip(input: { lessonsDone: number; lessonsTotal: number; topicsDone: number; topicsTotal: number; stats: Stats; now?: Date }): StripFigure[]`, returning at most four figures in this order, each omitted when it has no data: "Lessons done" (`3 of 20`), "Vocab topics done" (`2 of 25`), "Practice answers right" (`74%`, shown only when `practiceAnswers.answered > 0`), "Days practised" (`5`). "Day run" is not on the strip (it is on the stats page only). An empty array means no data anywhere.
- Produces (`useStats.ts`): `useStats(): { stats: Stats; update: (fn: (s: Stats) => Stats) => void; loaded: boolean }` and `__resetStatsStoreForTests()`, written exactly in the shape of `useVocabProgress.ts` (module store, `useSyncExternalStore`, load in an effect, write-through on update).

- [ ] **Step 1: Write failing `stats.test.ts`**: `emptyStats` has zeroed tone modes and no entries; `loadStats` returns empty for null storage, missing key, malformed JSON, wrong shapes, and a throwing storage; a save-then-load round trip returns the same value; `saveStats` with a throwing storage does not throw; `recordToneAnswer` increments answered and correct (correct only when true) and adds today's day once; `recordProverbAnswer` records the first answer and ignores a second answer for the same id (the first result stays); `recordTransformResult` records once per `mode:id`, and the same id in the other mode is recorded separately; `accuracy(0,0)` is null, `accuracy(3,4)` is 75; `transformSummary` counts close separately and `practiceAnswers` treats close and wrong as not correct; `practiceDays` counts distinct days; `currentRun` is 3 for three consecutive days ending today, 2 when it ends yesterday, 0 when the last day is older, and correct across 2026-02-28 to 2026-03-01 and 2025-12-31 to 2026-01-01; `days` stays sorted, unique and capped at 400 entries (oldest dropped).
- [ ] **Step 2: Run** `npx vitest run src/lib/stats.test.ts`. Expected: FAIL, module not found.
- [ ] **Step 3: Implement** `stats.ts` to the interface. Validate loaded data field by field (drop bad entries, never throw). Build `dayKey` from local date parts, not `toISOString`.
- [ ] **Step 4: Run** the same command. Expected: PASS.
- [ ] **Step 5: Write failing `stats-summary.test.ts`**: empty input gives `[]`; lessons only gives one figure `3 of 20`; all data gives exactly four figures in order; a figure with no data is omitted; accuracy figure is hidden when no practice answers exist; `5` days practised shows as "Days practised".
- [ ] **Step 6: Run** `npx vitest run src/lib/stats-summary.test.ts`. Expected: FAIL. **Implement** `buildStrip`, run again. Expected: PASS.
- [ ] **Step 7: Write failing `useStats.test.tsx`** modelled on `useVocabProgress.test.tsx`: starts empty, loads saved data after mount, `update` persists to localStorage and notifies subscribers. Run (FAIL), implement `useStats.ts`, run (PASS).
- [ ] **Step 8: Run** `npm test && npx tsc --noEmit`. Expected: PASS. **Commit** `git add -A && git commit -m "feat: stats store, summaries and hook"`.

### Task 2: Record results in tone practice, Proverbs and Transform

**Files:**
- Modify: `src/components/TonePractice.tsx`, `src/pages/Proverbs.tsx`, `src/pages/Transform.tsx`
- Test: `src/components/TonePractice.test.tsx`, `src/pages/Proverbs.test.tsx`, `src/pages/Transform.test.tsx`

**Interfaces:**
- Consumes: `useStats`, `recordToneAnswer`, `recordProverbAnswer`, `recordTransformResult` from Task 1.
- Produces: no new exports. Behavior: `TonePractice` calls `recordToneAnswer(mode, chosen === answer)` in the choose handler; `Proverbs` calls `recordProverbAnswer(proverb.id, choice === proverb.meaning)` in its choose handler; `Transform` calls `recordTransformResult(item.id, item.kind, mode, result)` inside `check()` after grading.

- [ ] **Step 1: Write failing tests** (each file clears localStorage in `beforeEach` and reads `yp:stats:v1` back, or reads `useStats` through `loadStats()`):
  - tone practice: answering one question in Words mode stores `tone.words` as answered 1 and correct 1 (right) or correct 0 (wrong); an answer in Sentences mode goes to `tone.sentences`; no stats are written before an answer;
  - Proverbs: choosing the right meaning stores `{ correct: true }` for that id; choosing a wrong one stores `{ correct: false }`; going Next then Previous and back does not change the count; remounting the page and answering the same proverb again keeps the first result;
  - Transform: checking a correct answer stores `result: "right"` under `easy:<id>` or `advanced:<id>` according to the mode; a close advanced answer stores "close"; pressing Check on an empty box stores nothing; switching mode after checking and revisiting does not add a second entry for the same mode; checking the same item again after remount in the same mode keeps the first result;
  - with `localStorage` replaced by an object whose `setItem` throws, each of the three activities still completes an answer without error.
- [ ] **Step 2: Run** `npx vitest run src/components/TonePractice.test.tsx src/pages/Proverbs.test.tsx src/pages/Transform.test.tsx`. Expected: the new tests FAIL.
- [ ] **Step 3: Implement** the three recording calls via `useStats().update`. Do not record in render or effects.
- [ ] **Step 4: Run** the same command. Expected: PASS. Then `npm test && npx tsc --noEmit`. Expected: PASS.
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: record tone practice, proverb and transform results"`.

### Task 3: Activity icons

**Files:**
- Create: `src/components/ActivityIcon.tsx`, `src/components/ActivityIcon.test.tsx`
- Modify: `src/styles.css` (only if `.level-icon` classes cannot be reused as they are)

**Interfaces:**
- Produces: `type ActivityId = "grammar" | "vocab" | "sounds" | "proverbs" | "transform"`; `ACTIVITY_IDS: readonly ActivityId[]`; `ActivityIcon({ activity, size? }: { activity: ActivityId; size?: "md" | "lg" })` rendering the same `<span className="level-icon level-icon-{size}" aria-hidden="true"><svg viewBox="0 0 64 64" ...>` structure as `LevelIcon`. Drawings (line style matching `LevelIcon`, stroke widths 1.8 to 2.6, a `fillOpacity=".25"` accent fill as in the level icons):
  - grammar: adire cloth square with a repeating dyed motif of concentric circles and small squares (not a woven strip);
  - vocab: round woven basket (apẹ̀rẹ̀) with a rim, criss-cross weave lines and a handle arc;
  - sounds: agogo, two iron bells of different size joined by a curved bar, with a short striking stick;
  - proverbs: horse (ẹṣin) in profile, head and arched neck with a mane and a simple body suggestion;
  - transform: ayò board, a rectangle with two rows of round pits and a few seeds, plus one curved arrow between pits.

- [ ] **Step 1: Write failing tests**: each id renders an `svg` inside an element with `aria-hidden="true"`; the five rendered SVG contents are all different from each other and from every `LevelIcon` level; the `lg` size adds the `level-icon-lg` class; `ACTIVITY_IDS` has exactly the five ids.
- [ ] **Step 2: Run** `npx vitest run src/components/ActivityIcon.test.tsx`. Expected: FAIL, module not found.
- [ ] **Step 3: Implement** `ActivityIcon.tsx` with the five drawings.
- [ ] **Step 4: Run** the test. Expected: PASS.
- [ ] **Step 5: Render check**: write a temporary Playwright script (not committed) that shows the five icons at `lg` size in light and dark on a throwaway page and saves screenshots to `.screenshots/icons-light.png` and `icons-dark.png`. Look at them. Redraw any icon that is not recognisable at card size. The author approves the final drawings at handoff, so keep the screenshots.
- [ ] **Step 6: Run** `npm test && npx tsc --noEmit`. Expected: PASS. **Commit** `git add -A && git commit -m "feat: activity icons"` (no screenshots in the commit).

### Task 4: Grammar page, routes and nav

**Files:**
- Create: `src/pages/Grammar.tsx`
- Modify: `src/pages/Home.tsx` (remove the level list in Task 5; in this task only extract it), `src/router.tsx`, `src/components/Layout.tsx`, `src/pages/LevelPage.tsx`, `src/pages/pages.test.tsx`, `e2e/lessons.spec.ts` only if a check relies on levels at `/`
- Test: `src/pages/pages.test.tsx`

**Interfaces:**
- Produces: `export function Grammar()` rendering exactly what `Home` renders today for levels (the `Hero` with first "Learn Yoruba grammar," and second "level by level", the "Unlock all levels" checkbox, the level cards), routes `/grammar` and `/stats` (the latter points at a placeholder component until Task 6: `Stats` exported from `src/pages/Stats.tsx` returning a heading "Stats" only), nav links "Grammar" (before "Vocab") and "Stats" (before "About").

- [ ] **Step 1: Write failing tests** in `pages.test.tsx`: `/grammar` lists the five levels (move the existing "home lists the five levels" test here); `/grammar` has the "Unlock all levels" checkbox and toggling it saves `skipAhead`; the nav has links "Grammar" to `/grammar` and "Stats" to `/stats`; `LevelPage`'s "All levels" link points to `/grammar`.
- [ ] **Step 2: Run** `npx vitest run src/pages/pages.test.tsx`. Expected: new tests FAIL.
- [ ] **Step 3: Implement**: create `Grammar.tsx` by moving the level list and checkbox out of `Home.tsx` (leave `Home` rendering its current content until Task 5 so the suite stays green; the level list is now duplicated briefly, which Task 5 removes); add the two routes and nav links; change the `LevelPage` "All levels" link to `/grammar`; add the placeholder `Stats` page.
- [ ] **Step 4: Run** `npm test && npx tsc --noEmit`. Expected: PASS.
- [ ] **Step 5: Commit** `git add -A && git commit -m "feat: grammar page, stats route and nav links"`.

### Task 5: Landing page

**Files:**
- Create: `src/components/ActivityCard.tsx`, `src/components/StatsStrip.tsx`, `src/pages/Home.test.tsx`
- Modify: `src/pages/Home.tsx`, `src/styles.css`, `src/pages/pages.test.tsx`

**Interfaces:**
- Consumes: `ActivityIcon`, `ActivityId` (Task 3); `useStats`, `buildStrip`, `practiceAnswers`, `proverbSummary`, `transformSummary` (Task 1); `useProgress`, `useVocabProgress`, `LEVELS`, `VOCAB_LEVELS`, `PROVERBS`.
- Produces: `ActivityCard({ activity, to, title, description, progress }: { activity: ActivityId; to: string; title: string; description: string; progress?: string })` rendering a single `Link` (a large card: icon `lg`, title, description, and the progress line only when given); `StatsStrip({ figures }: { figures: StripFigure[] })` rendering the figures, or when empty the text "Start a lesson to see your stats" with a link "Start with Grammar" to `/grammar`; both strip variants link to `/stats` (the empty variant keeps its own link to `/grammar`, and a "See all stats" link to `/stats` shows only when there are figures). Card data in `Home`:
  - Grammar → `/grammar`, "Grammar", "Five levels from sounds to sentences, one small lesson at a time.", progress `N of {lessonsTotal} lessons done` when N > 0;
  - Vocab → `/vocab`, "Vocab", "Common words by topic, with flashcards and practice.", progress `N of {topicsTotal} topics done` when N > 0;
  - Sound Bank → `/sounds`, "Sound Bank", "Every vowel, consonant and tone, with audio and listening practice.", progress `N practice answers` (singular `1 practice answer`) when N > 0;
  - Proverbs → `/proverbs`, "Proverbs", "Read a proverb, guess what it means, then see when you would say it.", progress `N of {PROVERBS.length} proverbs guessed` when N > 0;
  - Transform → `/transform`, "Transform", "Type the negative, question, future or past form of a sentence.", progress `N sentences checked` (singular `1 sentence checked`; distinct item ids) when N > 0.

- [ ] **Step 1: Write failing `Home.test.tsx`** (router render at `/`, localStorage cleared): shows the hero heading "Learn Yoruba, tone by tone"; shows five cards in order Grammar, Vocab, Sound Bank, Proverbs, Transform, each a link to its route; no level cards and no "Unlock all levels" checkbox on `/`; with empty storage, the strip shows "Start a lesson to see your stats" and no card shows a progress line and nowhere appears "0" or "NaN" or "%"; with saved lesson progress (2 lessons) the Grammar card shows "2 of 20 lessons done" (take 20 from `LEVELS`) and the strip shows "Lessons done"; with saved stats (tone 4 answered 3 correct, one proverb right) the Sound Bank card shows "4 practice answers", the Proverbs card shows "1 of 16 proverbs guessed" (take 16 from `PROVERBS`) and the strip shows "Practice answers right"; the strip links to `/stats` when it has figures.
- [ ] **Step 2: Run** `npx vitest run src/pages/Home.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** `ActivityCard`, `StatsStrip`, rewrite `Home.tsx` (remove the level list and checkbox now that `Grammar` holds them) and add styles `.activity-card`, `.activity-grid`, `.stats-strip` (single column on phones, two columns at `min-width: 40rem`, large padding, the existing card look, icon on the left).
- [ ] **Step 4: Update** `pages.test.tsx` and any e2e check that still expects levels or the checkbox on `/`. The vocab e2e check that clicks the `/Common words by topic/` link in `main` must still pass.
- [ ] **Step 5: Run** `npm test && npx tsc --noEmit`. Expected: PASS. **Commit** `git add -A && git commit -m "feat: landing page with activity cards and stats strip"`.

### Task 6: Stats page

**Files:**
- Modify: `src/pages/Stats.tsx` (replace the placeholder)
- Create: `src/pages/Stats.test.tsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: Task 1 summaries; `useProgress`, `useVocabProgress`, `LEVELS`, `VOCAB_LEVELS`, `PROVERBS`; `ToneMode` labels Words, Sentences, Sounds.
- Produces: `export function Stats()` with a `Hero` ("Your stats"), then sections with `h2` headings and test ids `stats-grammar`, `stats-vocab`, `stats-tone`, `stats-proverbs`, `stats-transform`, `stats-days`. Each section with no data shows "Start a lesson to see your stats" and a link into its activity ("Go to Grammar", "Go to Vocab", "Go to Sound Bank", "Go to Proverbs", "Go to Transform"); the days section shows the same message when there are no practice days.
  - Grammar: per level `x of y lessons done`, and per completed lesson its title and best score as a percent.
  - Vocab: per level with topics, `x of y topics done`, and per completed topic its best quiz and gap-fill percent where present.
  - Tone practice: per mode `answered`, `correct` and accuracy (the accuracy text is omitted when null).
  - Proverbs: `guessed of total` and `right on first try`.
  - Transform: per kind and per mode the right / close / wrong counts, close shown on its own.
  - Days: "Days practised" and "Day run".

- [ ] **Step 1: Write failing `Stats.test.tsx`**: with empty storage every section shows the empty message and its link, and the page contains no "0%" or "NaN"; with seeded lesson, vocab and stats data each section shows its numbers (for example `1 of 4 lessons done` for a level with four lessons, "3 of 4" tone correct and "75%" accuracy, Transform close counted separately from right, "Days practised" 3); a section with data hides its empty message while another empty one keeps it; a corrupt `yp:stats:v1` value renders the empty state without error.
- [ ] **Step 2: Run** `npx vitest run src/pages/Stats.test.tsx`. Expected: FAIL.
- [ ] **Step 3: Implement** `Stats.tsx` and styles.
- [ ] **Step 4: Run** `npm test && npx tsc --noEmit`. Expected: PASS. **Commit** `git add -A && git commit -m "feat: stats page"`.

### Task 7: End-to-end, phone width and final run

**Files:**
- Create: `e2e/landing-stats.spec.ts`
- Modify: `e2e/screens.spec.ts` (add screenshots of `/grammar` and `/stats` next to the home one)

- [ ] **Step 1: Write** the e2e tests: `/` shows five activity cards in order and the empty strip message; clicking the Grammar card reaches `/grammar` with five level cards; completing one Transform check (using the first item's model answer from `TRANSFORMS`) and reloading `/` shows the Transform card progress line "1 sentence checked" and `/stats` shows the Transform section with a right count of 1; answering one Proverb and one tone-practice question shows their counts on `/stats`; with `localStorage` blocked (as in `lessons.spec.ts`) `/`, `/stats` and `/proverbs` render; at 375px width the nav links are all visible and the page has no horizontal scroll (`document.documentElement.scrollWidth <= window.innerWidth`); dark-mode pass on `/` and `/stats`.
- [ ] **Step 2: Run** `npm run e2e -- e2e/landing-stats.spec.ts`. Expected: PASS.
- [ ] **Step 3: Run** the whole suite: `npm test && npm run validate && npx tsc --noEmit && npm run build && npm run e2e`. Expected: all pass.
- [ ] **Step 4: Take** `.screenshots` of `/`, `/grammar`, `/stats` and the icon sheet in light and dark and keep them for the author's approval at handoff.
- [ ] **Step 5: Commit** `git add -A && git commit -m "test: landing page and stats e2e"`.
