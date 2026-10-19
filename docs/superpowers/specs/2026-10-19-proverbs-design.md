# Proverbs Page: Design Spec

Date: 2026-10-19
Status: Draft, awaiting review
Feature 2 of the practice shortlist (dictation was dropped; sentence transformation is still open).

## 1. Intent

Proverbs (òwe) carry how Yoruba speakers talk about life, and they only make sense once you work out what they are for. This page shows one proverb at a time. The learner reads the Yoruba and its direct (word for word) English translation, then guesses its social meaning from three choices before it is revealed. The page is for fun and for understanding, not for drilling vocabulary.

## 2. Goals, non-goals, anti-goals

### Goals
- A new page, `/proverbs`, linked from the top navigation.
- One proverb at a time, with Previous and Next.
- For each proverb: the Yoruba, the direct translation, a guess step, then the reveal (the social meaning and when someone would say it).
- A first batch of about 20 proverbs, each with a recorded source, marked `needs-review`, and listed in `content/REVIEW.md`.
- Works in light and dark themes, with precomposed (NFC) diacritics.

### Non-goals
- Audio. The user chose to add it later. The data model leaves room for it, but no clips, manifest entries or play buttons ship now.
- Free-text answers, scoring across proverbs, streaks, accounts, or saved progress.
- Word-by-word tap glosses (the direct translation line is the gloss).
- Changing lesson Mastery 4 (Proverbs), which teaches grammar through two proverbs. Those two may also appear on this page.

### Anti-goals (a failure even if it technically works)
- A wrong choice that is also a fair reading of the proverb, so the question has two right answers.
- A proverb or meaning that looks verified when it is not.
- A meaning so general ("be wise") that the learner can pick it without reading the proverb.
- Padding to reach 20 with proverbs that have no source.

## 3. How it works

The page shows "Proverb 3 of 20" and one card at a time.

1. **Guess step.** The Yoruba proverb and its direct translation are shown. Below are three possible social meanings in a shuffled order. The learner picks one.
2. **Reveal.** The chosen answer is marked right or wrong, and the correct meaning is shown with a second line, "You would say this when...". A wrong choice stays visible so the learner can compare. Next unlocks only after answering; Previous is always available.
3. Going back to an answered proverb shows it in its revealed state.

Order is fixed, as listed in the data. Choice order is shuffled with a seed built from the proverb id, so it is stable between visits and the correct answer is not always in the same position (a test pins this, as with the quiz content).

## 4. Content model

New file `src/content/proverbs.ts`.

```ts
export type Proverb = {
  id: string;            // kebab-case, unique
  yoruba: string;        // full proverb, NFC, tone marks included
  literal: string;       // direct, word for word English translation
  meaning: string;       // the social meaning, in one or two sentences
  usedWhen: string;      // when a speaker would say it
  wrong: [string, string]; // two plausible but wrong meanings
  source: string;        // where the Yoruba and the meaning were drafted from
  confidence: Confidence; // "needs-review"
  note?: string;
};
```

Validation (`validate-proverbs.ts`, run by `npm run validate` and a unit test):
- Ids unique; every field except `note` non-empty; `wrong` has exactly two distinct entries, none equal to `meaning`.
- Yoruba is NFC.
- Every entry has a source and confidence `needs-review`.
- No em dashes anywhere in the content (the existing `no-em-dash` test covers source files).

## 5. Where it lives

- `src/pages/Proverbs.tsx` (the page), a `/proverbs` route in `src/router.tsx`, and a "Proverbs" link in `Layout.tsx` nav.
- Reuses `ChoiceQuestion` for the guess step if it fits; otherwise a small local choice list in the same style.
- `src/lib/review.ts` and `scripts/generate-review.ts` gain a Proverbs section; `scripts/validate-content.ts` runs the new validator.
- An e2e check in `e2e/` that the page loads, a guess reveals the meaning, and Next advances.

## 6. Content authoring process

1. Search published sources for well-known proverbs with a stated meaning (Wiktionary and published proverb collections, as Mastery 4 did). Record the source per entry, as done in `m-4.ts`.
2. Draft the direct translation from the Yoruba, and the meaning and usage from the source's own explanation. If no source states the meaning, say so in `note` and keep the meaning plain.
3. Write the two wrong meanings so they are clearly wrong given the proverb but sound like things a proverb might say.
4. Anything that cannot be sourced is left out. The batch may end up under 20; the real count is reported.
5. Nothing is marked verified by the builder. Tones in proverbs are a known weak spot (Mastery 4 notes every tone there as a high doubt), so the review file flags this.

## 7. Left to the builder

- Card layout and copy for the labels, within the existing visual style.
- Whether Previous/Next are buttons or a small step indicator.
- Which of the two Mastery 4 proverbs to include, if their sources hold up.

## 8. Risks

- Content correctness: proverb tones and meanings are easy to get wrong. The needs-review marker and review file are the mitigation; a native check is required before the page is described as accurate.
- Distractors that are accidentally right: the review file lists them too, so a reviewer can catch this.
- Fewer than 20 sourceable proverbs: accepted over inventing.

## 9. Calls made by the author of this spec (not agreed decisions)

1. Multiple choice (three options) for the guess, in a seeded shuffle.
2. Fixed order, no saved progress.
3. Next is locked until the learner answers.
4. The page is linked as "Proverbs" in the top nav.
5. Proverbs from Mastery 4 may be reused.
