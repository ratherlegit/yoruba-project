# Yoruba Project: Design Spec

Date: 2026-10-13
Status: Draft, awaiting review
Working name: "Yoruba Project" (placeholder)

## 1. Purpose

A web app that teaches Yoruba grammar to English speakers starting from zero. Five levels (Getting Started, Beginner, Intermediate, Advanced, Mastery), four grammar lessons per level (20 total). Every lesson opens with an instruction page, then an activity. Yoruba is always shown with full tone marks and diacritics. Instruction pages break words into components and show how they are built and then contracted.

LangLoop's grammar section is the structural model: primer first, then practice.

### Success criteria
- A learner can open the app, pick a level, read an instruction page, and complete an activity with no account.
- Every Yoruba string renders with correct diacritics (precomposed Unicode, NFC) in both themes.
- Every example word in a primer shows its components and, where contraction applies, the contracted form with the rule named.
- Content that has not been verified is visibly tracked (see section 7).
- Light and dark modes, both dark green in character, pass WCAG AA contrast.

### Non-goals (v1)
- Accounts, sync, leaderboards, XP economy.
- Speech recognition or pronunciation scoring.
- A rule engine that generates contractions (see section 4).
- Vocabulary trainer or reading/listening modules.

## 2. Stack and hosting

Same as LangLoop: TypeScript, React, Vite, TanStack Router/Start, Tailwind, deployed to Cloudflare Workers. Progress is stored in `localStorage`. Supabase sign-in is a possible later addition and is out of scope for v1.

Hydration rule carried over from LangLoop: read `localStorage` in a `useEffect`, never in a `useState` initializer, to avoid SSR hydration mismatch.

Project location: `~/Desktop/Professional/5_Projects and Gigs/Yoruba Project`.

## 3. Learner flow

Home (level map) -> Level page (4 lesson cards) -> Lesson: Instruction page -> Activity -> Results -> next lesson.

- Levels unlock sequentially by completing the previous level's lessons, but any unlocked lesson can be revisited. A "skip ahead" toggle on the home page unlocks everything (useful for heritage learners and for review).
- The instruction page must be viewed (scrolled to a "Start practice" button) before the activity opens. It can be reopened from inside the activity.

## 4. Content model

All curriculum lives in typed data files under `src/content/`. One source of truth feeds both instruction pages and activities, so they cannot disagree.

```ts
type Tone = "high" | "mid" | "low";

type Morpheme = {
  text: string;          // NFC, tone-marked, e.g. "kú"
  gloss: string;         // English meaning, e.g. "greet / die"
  role: string;          // e.g. "verb", "agent prefix", "pronoun"
};

type BuildStep = {
  kind: "join" | "elide" | "assimilate" | "tone-shift";
  result: string;        // tone-marked form after this step
  ruleId: string;        // points to a Rule in the same lesson
};

type WordBreakdown = {
  id: string;
  surface: string;               // final form, e.g. "káàárọ̀"
  english: string;
  parts: Morpheme[];             // components in order
  steps: BuildStep[];            // authored build, empty if no contraction
  confidence: "verified" | "needs-review";
  note?: string;                 // why uncertain
};

type Rule = { id: string; title: string; explanation: string };

type Lesson = {
  id: string;
  level: LevelId;
  title: string;
  primer: {
    rule: string;                // one-sentence rule
    formula: string;             // e.g. "olù + verb = one who does it"
    rules: Rule[];
    examples: WordBreakdown[];
    commonMistake: { wrong: string; right: string; why: string };
    toneFocus?: Tone[];          // which tone chips to highlight
  };
  questions: Question[];         // 8 per lesson
};

type Question =
  | { type: "blank"; prompt: string; answer: string; choices: string[]; wordId?: string }
  | { type: "pick"; prompt: string; choices: string[]; answer: number; wordId?: string }
  | { type: "order"; english: string; words: string[]; answer: string[] };
```

### Why authored surface forms, not a rule engine
Yoruba vowel elision, assimilation, and tone carry-over have many exceptions. A generator that is wrong looks authoritative; an authored form is checked once, by a person. Each `BuildStep.result` is hand-written. A unit test confirms the last step equals `surface`, that `parts` joined without contraction equals the first step where applicable, and that every `ruleId` resolves.

### Tone-mark handling
- All strings stored NFC. A test rejects any string that is not NFC-normalized.
- A helper `toneOf(syllable)` classifies a syllable as high (acute), low (grave), or mid (unmarked, or macron where used) so the UI can draw tone chips and a pitch contour under each word. Syllabic nasals and `ṣ`, `ẹ`, `ọ`, `gb` are handled explicitly.
- Answer checking in activities compares NFC-normalized strings and is tone-sensitive: a missing tone mark is wrong, with feedback that names the tone difference.

## 5. Curriculum (v1 draft)

| Level | Lesson 1 | Lesson 2 | Lesson 3 | Lesson 4 |
|---|---|---|---|---|
| Getting Started | Vowels and consonants (ẹ, ọ, ṣ, gb) | The three tones | Syllables and greetings | Pronouns |
| Beginner | "To be": *jẹ́* and *ni* | Negation with *kò* | Present action with *ń* | Questions: *ṣé*, *kí ni* |
| Intermediate | Tense and aspect: *ti*, *yóò*, *máa* | Possession and tone carry-over | Agent nouns (*olùkọ́*) | Demonstratives and plurals |
| Advanced | Vowel elision and contraction | Verbal nouns and reduplication | Serial verbs | Relative clauses with *tí* |
| Mastery | Fused forms (*ẹ káàárọ̀*) | Focus with *ni* | Complex sentences | Proverbs (*òwe*) and idiom |

Final lesson order and wording are drafted during content authoring and listed in the review file.

## 6. UI

### Pages
- `/` Home: level map, five level cards with progress rings.
- `/level/$levelId`: four lesson cards.
- `/lesson/$levelId/$lessonId`: instruction page, then activity, then results (single route, internal view state, matching LangLoop's pattern).
- `/about`: how tones and the breakdown notation work, plus a note on content review status.

### Instruction page components
- `RuleHeader`: one-sentence rule and formula.
- `WordBreakdownCard`: the signature component. Row of component tiles (text, gloss, role), a "+" join, then step-by-step build with an arrow per step labeled with the rule name, ending in the final form. Steps reveal one at a time with a "Next step" control; "Show all" is available. Reduced-motion users get no animation.
- `ToneChip` and `PitchLine`: color-independent tone indicators (shape plus label, not color alone).
- `CommonMistake`: wrong vs right.
- `AudioButton`: uses browser speech synthesis with a Yoruba (`yo`) voice if present. If none exists, the button is hidden and a one-line note explains. Labeled "approximate pronunciation".

### Activity components
`BlankQuestion`, `PickQuestion`, `OrderQuestion`, a progress bar, feedback panel, and a results screen with a retry-missed option. Same three question types as LangLoop.

### Theme
- Tokens on `:root`, overridden for dark under `prefers-color-scheme` and a manual `data-theme` toggle (system, light, dark), stored in `localStorage`.
- Dark: near-black green background, deep green surfaces, light green accents.
- Light: warm off-white background, dark green primary, same accent family.
- Tone colors are supplemental; shape and label carry meaning.
- Font must render Yoruba diacritics, including combining marks, without clipping. Candidate: a family with full Latin Extended Additional coverage (e.g. Noto Sans or Inter). Verified visually on every tone-mark combination in a test page before adoption.
- Per standing preference: no em dashes and no eyebrow labels in any copy or design.
- Real screenshots of home, instruction page, and activity in both themes are shown for approval before the visual design is finalized.

## 7. Accuracy and flagged uncertainty

Tone and contraction errors are the main risk. The model drafts content; it cannot replace a native-speaker check.

- Every `WordBreakdown` has `confidence: "verified" | "needs-review"`. Default for all newly drafted content is `needs-review`. Only the owner or a reviewer flips it to `verified`.
- A generated `content/REVIEW.md` lists every `needs-review` item with lesson, word, authored steps, and the specific doubt (tone, contraction rule, or regional variant).
- In the UI, `needs-review` items show a small "pending review" marker during development builds only. A build flag (`SHOW_REVIEW_MARKERS`) controls it; production builds can hide markers once the owner is satisfied.
- Where standard Yoruba has regional variants, the primer uses the standard (Ìbàdàn/Standard Yoruba) form and the `note` field mentions the variation.
- Source preference when drafting: published grammars and dictionaries. Each lesson file carries a `sources` comment listing what it was checked against. Anything that could not be cross-checked is marked `needs-review` with the reason.

## 8. Progress storage

`localStorage` key `yp:progress:v1`:

```ts
{ completedLessons: { [lessonId]: { bestScore: number; completedAt: string } },
  skipAhead: boolean,
  theme: "system" | "light" | "dark" }
```

All reads wrapped in try/catch. The app renders fully with storage unavailable. No personal data is collected.

## 9. Testing

- Unit (Vitest): NFC check across all content; `toneOf` on a table of syllables; breakdown integrity (steps end at `surface`, `ruleId`s resolve); answer checking is tone-sensitive; question shape validation (answer is among choices, order answer is a permutation of words).
- Content validator script, run before any content batch is merged (modeled on LangLoop's `validate-reading-content.mjs`).
- Component tests for `WordBreakdownCard` step reveal and reduced-motion behavior.
- Playwright smoke test: complete one lesson per level on localhost, in both themes.
- Manual: a diacritic rendering page, checked in Safari and Chrome. Local check on localhost required before any deploy.
- Contrast check on both themes' token pairs.

## 10. Build order

1. Scaffold project, theme tokens, fonts, diacritic test page (design approval checkpoint with screenshots).
2. Content model, `toneOf`, validators, tests.
3. Instruction page components, with Getting Started lesson 1 as the reference lesson.
4. Activity components and results flow.
5. Home, level pages, progress storage, theme toggle.
6. Author remaining 19 lessons level by level, generating `REVIEW.md` after each level.
7. Localhost verification, then deploy to Cloudflare Workers.

## 11. Open questions
- Final product name.
- Who performs the native-speaker review, and in what format they prefer to receive `REVIEW.md`.
- Whether to add Supabase sign-in after v1.
