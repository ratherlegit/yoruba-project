# Landing Page Reorganisation and Stats: Design Spec

Date: 2026-10-20
Status: Draft, awaiting review

## 1. Intent

The home page was built when the app was only grammar lessons. It now has five activities, and three of them (Sound Bank, Proverbs, Transform) are barely visible from it. This change makes the landing page a menu of the app's activities, one large card each, moves the grammar levels to their own page, and adds a stats page so a returning learner can see what they have done. A short stats strip on the landing page links to it.

The site is for the author's own use and for their portfolio. Data lives only in the browser (localStorage). There are no accounts and no database.

## 2. Goals, non-goals, anti-goals

### Goals
- **Landing page (`/`):** a large card per activity: Grammar, Vocab, Sound Bank, Proverbs, Transform. Each card has a title, a one-line description, and a short progress line.
- **Grammar page (`/grammar`):** the five level cards and the "Unlock all levels" checkbox move here unchanged, with a "Grammar" link in the top nav.
- **Stats strip on the landing page:** three or four numbers, linking to `/stats`.
- **Stats page (`/stats`):** a section per activity. Linked from the top nav and from the strip.
- **Recording:** tone practice, Proverbs and Transform start recording counts, and the stats page shows them next to the existing lesson and vocab numbers.
- **Empty state:** with no data, the strip and each stats section show "Start a lesson to see your stats" and a link into the app. Nothing shows zeros or fake data.
- Works in light and dark themes and at phone width.

### Non-goals
- Accounts, sync between devices, a server, or a database.
- Leaderboards, sharing, achievements or badges.
- Replaying or reviewing past answers. Only counts and dates are saved.
- Changing how any activity looks or behaves, other than recording results.
- A reset button is not required. (Builder may add one if it is small and safe; see section 7.)

### Anti-goals (a failure even if it technically works)
- A fresh visitor sees zeros, NaN, or "0%" where there is no data. Accuracy with no answers must read as empty, not 0%.
- Recording an answer breaks an activity when storage is blocked or full (private windows). Every activity must work with storage unavailable.
- Counting the same answer twice (React strict-mode double effects, re-renders, going Previous and Next).
- Counting Transform or Proverbs answers when the learner only went back to look at a checked item.
- Existing lesson and vocab progress is lost or reset.
- The landing page card for Grammar hides that levels exist (the progress line must show real counts).
- Saved stats store anything about content that could be mistaken for private data. Only ids, counts and dates.

## 3. How it works

### Landing page
Order of cards: Grammar, Vocab, Sound Bank, Proverbs, Transform. The existing hero stays above them. The stats strip sits between the hero and the cards. The "Unlock all levels" checkbox leaves this page. Cards are large (a wide card with a title, a description and a progress line) in a single column on a phone and a two-column grid on wider screens.

Progress line per card (empty states in brackets):
- Grammar: "N of 20 lessons done" (no lessons done: "Five levels, from sounds to sentences").
- Vocab: "N of 25 topics done" (none: "Common words by topic").
- Sound Bank: "N practice answers" (none: "Vowels, consonants, tones and listening practice").
- Proverbs: "N of 16 proverbs guessed" (none: "Guess what each proverb means").
- Transform: "N sentences checked" (none: "Type the negative, question, future or past").

The counts "20", "25" and "16" are taken from the content arrays, never hard-coded.

### Stats strip
Shows up to four figures drawn from: lessons done, vocab topics done, practice answers (tone practice, proverb guesses and Transform checks combined) with the share right, and days practised. With no data at all it shows only "Start a lesson to see your stats" and a link to `/grammar`. The strip links to `/stats`.

### Stats page
Sections in the same order as the landing cards. Each shows what its activity records:
- **Grammar:** lessons done per level (x of y), best score per lesson as a list or compact grid.
- **Vocab:** topics done per level, best quiz and gap-fill scores.
- **Tone practice:** answers and accuracy for each mode (Words, Sentences, Sounds).
- **Proverbs:** proverbs guessed of total, and how many were guessed right on the first try.
- **Transform:** sentences checked and accuracy for each kind (negative, question, future, past) and for each mode (easy, advanced). "Close" results are shown separately from "right" and "wrong".
- **Practice days:** number of distinct days with any recorded activity, and the current run of consecutive days (see section 9).

A section with no data shows the empty message and a link into that activity, not zeros.

### Recording
- **Lessons and vocab:** already saved (`yp:progress:v1`, `yp:vocab-progress:v1`). Unchanged and only read.
- **New store `yp:stats:v1`:** counters and per-item records, loaded and saved the same way as the existing progress modules (try/catch around every access; a blocked store means nothing persists and nothing breaks):
  - `tone`: per mode, `{ answered, correct }`.
  - `proverbs`: per proverb id, `{ firstChoiceCorrect: boolean, answeredAt }`. Each proverb counts once, on the first answer.
  - `transform`: per kind and mode, `{ right, close, wrong }`, plus a set of item ids already counted so each item counts once per mode.
  - `days`: a list of `YYYY-MM-DD` strings (local time) on which anything was recorded, capped to a sensible length.
- Every record function is a pure function `(stats, event) => stats`, tested without React. A thin hook wraps it, as `useProgress` does for lessons.
- An answer is recorded at the moment it is first checked or chosen, never on render or on revisiting a finished item.

## 4. Where it lives

- New pages: `src/pages/Grammar.tsx` (the moved level list), `src/pages/Stats.tsx`. `Home.tsx` becomes the activity menu.
- New components: an activity card and the stats strip, small and reusable.
- New lib: `src/lib/stats.ts` (types, `emptyStats`, load, save, pure record functions, summary helpers) and a `useStats` hook beside `useProgress`.
- Existing pages get one-line hooks to record: `TonePractice`, `Proverbs`, `Transform`.
- `src/router.tsx` gains `/grammar` and `/stats`; `Layout.tsx` nav gains "Grammar" and "Stats".
- Tests: unit tests for `stats.ts`; component tests for the landing page, the Grammar page, the Stats page (empty and populated); a recording test for each of the three activities; an e2e flow: landing shows five cards and the empty strip, answering in an activity makes the strip and `/stats` show it after reload.

## 5. Constraints

- No em dashes or eyebrow labels in copy or design.
- Do not display environmental impact figures.
- Existing tests that assert the old home page contents (levels on `/`) move with the content to the Grammar page.
- Storage keys are versioned (`:v1`). Corrupt or missing data falls back to empty.

## 6. Risks

- Home-page tests and e2e checks assume the level list is on `/`. They need updating, not deleting.
- Double counting from re-renders. Mitigated by recording only in event handlers and by the once-per-item rules above.
- Nav crowding: Grammar, Vocab, Sound Bank, Proverbs, Transform, Stats, About plus the theme toggle. The builder must check the nav at phone width.
- Combining totals across activities (practice answers) can mislead. The strip labels exactly what it counts.

## 7. Left to the builder

- Card layout, visual style within the existing look, and the strip's design.
- The exact stats-page layout and how best scores are shown.
- Whether to add a "Reset stats" control (only if it cannot touch lesson or vocab progress by mistake).
- How many figures the strip shows, between three and four, depending on how much data exists.

## 8. Risks to content correctness

No Yoruba content changes. The only copy added is interface text.

## 9. Calls made by the author of this spec (not agreed decisions)

1. Five landing cards: Grammar, Vocab, Sound Bank, Proverbs, Transform. Tone practice stays inside Sound Bank.
2. Nav gains "Grammar" and "Stats".
3. "Days practised" and a consecutive-day run are included. A day counts when any answer is recorded.
4. Each proverb counts once, on its first answer. Each Transform item counts once per mode. Tone practice counts every answer, because rounds repeat.
5. Stats strip shows three to four figures and hides any figure with no data.
6. Grammar's "Unlock all levels" checkbox moves to the Grammar page.
7. No reset control is required.
8. The mixed "practice answers" figure combines tone practice, proverb guesses and Transform checks.
