# Sentence Transformation: Design Spec

Date: 2026-10-20
Status: Draft, awaiting review
Last feature on the practice shortlist (tone discrimination and proverbs are done, dictation was dropped).

## 1. Intent

Learners can read Yoruba grammar and still not be able to produce it. This page makes them produce it. Each round shows a Yoruba sentence and an instruction ("make this negative"), and the learner types the transformed sentence themselves. Typing from scratch is harder than picking or tapping tiles, and that difficulty is the point: it is the closest thing in the app to actually speaking.

## 2. Goals, non-goals, anti-goals

### Goals
- A new page, `/transform`, linked from the top navigation.
- Four transformations: negative, question, future, past.
- The learner types the full new sentence. A row of tap-to-insert letters sits under the box for ẹ, ọ, ṣ and the tone marks.
- Two modes, switched at the top of the page:
  - **Easy:** dots under letters and tone marks are ignored.
  - **Advanced:** dots and tone marks must be exact.
- Feedback after checking: right, close (advanced only), or wrong, with the learner's answer shown next to the correct one and a one-line rule.
- About 20 new sentences (five per transformation), each with a source, marked `needs-review`, listed in `content/REVIEW.md`.
- Works in light and dark themes, on a phone, with precomposed (NFC) diacritics.

### Non-goals
- Audio. It can come later, as with proverbs.
- Word tiles, multiple choice, or hints that reveal part of the answer.
- Saved progress, scores across items, streaks, accounts.
- Transformations beyond the four (progressive, imperative, relative clauses).
- Reusing sentences from the lessons. The user chose new ones.

### Anti-goals (a failure even if it technically works)
- A correct answer marked wrong because of how it was typed: pasted decomposed (NFD) text, different capitalisation, extra spaces, or a final full stop or question mark.
- A wrong answer marked right. In easy mode this includes handing in the original sentence unchanged.
- A valid alternative left out of the accepted answers, so a learner who knows the language is told they are wrong (máa versus yóò; kò versus ò).
- An item whose "correct" answer is not what a Yoruba speaker would say. Content that looks verified when it is not.
- A tap-to-insert row that makes typing slower than a normal keyboard or inserts the tone mark in the wrong place.

## 3. How it works

The page shows "Sentence 3 of 20", a mode switch (Easy / Advanced), and one card at a time.

1. **Prompt.** The card shows the Yoruba base sentence, its English, and the instruction, for example "Make this negative". Below it is a text box and the tap-to-insert row.
2. **Check.** The learner presses Check (or Enter). One attempt is allowed.
3. **Result.** Three outcomes:
   - **Right:** matches an accepted answer under the current mode's rules.
   - **Close (advanced mode only):** the letters match an accepted answer once dots and tones are ignored, but the marks are off. Shown as "Right words, check the dots and tones", with the learner's text and the correct sentence side by side.
   - **Wrong:** anything else. The learner's text and the correct sentence are shown side by side.
4. **Reveal.** After any result the page shows the most natural answer, any other accepted answers, and a one-line rule ("kò goes before the verb, and shortens to ò after a pronoun"). Next unlocks only after checking; Previous is always available, and going back to a checked item shows it as it was left, with the box disabled.

Order is fixed, as listed in the data, with the four transformations interleaved so the learner reads the instruction each time. The mode switch applies to the next Check; switching it never re-grades a finished item.

### Grading rules

Both sides are normalised before comparing: Unicode NFC, trimmed, runs of spaces collapsed to one, lowercased, and trailing `.`, `?` and `!` removed.

- **Advanced:** the normalised answer must equal a normalised accepted answer exactly.
- **Easy:** both sides are also folded: decomposed, every combining mark removed (this takes off the dot below and all tone marks), so ẹ becomes e, ọ becomes o, ṣ becomes s, and á becomes a. Folded text is compared.
- **Close** is reported only in advanced mode, when the folded forms match but the exact forms do not.

### Typing aid

The row has ẹ, ọ, ṣ, and the three tone marks (acute, grave, and the mid-tone macron if the lessons use it; the builder checks the lessons). Tapping a letter inserts it at the caret. Tapping a tone mark adds the combining mark to the letter before the caret, and the result is re-normalised to NFC. The text box is `lang="yo"` with spellcheck and autocomplete off.

## 4. Content model

New file `src/content/transforms.ts`.

```ts
export type TransformKind = "negative" | "question" | "future" | "past";

export type Transform = {
  id: string;             // kebab-case, unique
  kind: TransformKind;
  base: string;           // the sentence shown, NFC, tone marks included
  baseEnglish: string;    // its English
  answers: string[];      // every accepted answer; answers[0] is the one shown as the model
  rule: string;           // one line on what changed and why
  source: string;         // where the pattern and sentence were drafted from
  confidence: Confidence; // "needs-review"
  note?: string;
};
```

The instruction text comes from `kind` ("Make this negative", "Turn this into a question", "Say this in the future", "Say this in the past"). For the past, the base is a progressive sentence ("Mo ń lọ") and the answer drops ń, as the lessons teach: without ń, it already happened. English glosses show this, for example "I am going" to "I went".

Validation (`validate-transforms.ts`, run by `npm run validate` and a unit test):
- Ids unique; every field except `note` non-empty; `answers` has at least one entry and no duplicates.
- All strings are NFC; no em dash.
- Every entry has a source, confidence `needs-review`, and a note.
- No accepted answer, once normalised and folded, equals the folded base sentence. Handing in the sentence unchanged must never pass, in either mode.
- Each kind appears at least three times in the real data.

## 5. Where it lives

- `src/lib/transform-grade.ts`: `normalise`, `fold`, and `gradeTransform(input, answers, mode)` returning `"right" | "close" | "wrong"`. Pure functions, heavily unit-tested.
- `src/pages/Transform.tsx` (the page), a `/transform` route in `src/router.tsx`, and a "Transform" link in `Layout.tsx` between Proverbs and About (name is the builder's call).
- `src/lib/review.ts` and `scripts/generate-review.ts` gain a Transformations section; `scripts/validate-content.ts` runs the new validator.
- An e2e check in `e2e/`: the page loads, typing an answer and pressing Check shows a result, Next advances, and the card is visible in dark mode.

## 6. Content authoring process

1. Take the four patterns from the lessons (Negation with kò, Questions with ṣé, Will not and future with máa/yóò, Ongoing action with ń). Write new sentences with vocabulary the app already teaches, so the sentence is not the hard part.
2. Check each pattern against an outside source (Wiktionary entries for kò, ṣé, máa, yóò, ń, and published grammar references), and record it in `source`. Where the shortened ò forms or pronoun changes apply (mo becomes mi before ò), say so in `rule`.
3. List every accepted answer. Where a sentence has two natural forms, both go in `answers`, with the more natural one first.
4. Anything whose pattern cannot be sourced is left out. The batch may end under 20; the real count is reported.
5. Nothing is marked verified by the builder. The review file flags tones and the kò/ò contractions as the likeliest errors.

## 7. Left to the builder

- Card layout, copy for the labels, and the page and nav name.
- The exact set of characters on the typing row, and its look.
- The exact wording of the Close and Wrong messages, within the plain tone of the existing pages.

## 8. Risks

- Content correctness: new sentences with tones are the easiest place to teach something wrong. The needs-review marker and the review file are the mitigation; a native check is required before the page is described as accurate.
- Incomplete accepted answers: a correct sentence the data does not list is graded wrong. The review file lists all accepted answers so a reviewer can add missing ones.
- Typing aid on mobile: combining marks behave differently across keyboards and browsers. The builder tests insertion in the e2e run and with a pasted decomposed string.

## 9. Calls made by the author of this spec (not agreed decisions)

1. Easy mode also ignores tone marks, not only dots.
2. Each item has one attempt, then the reveal.
3. A "close" result exists only in advanced mode.
4. About 20 items, five per transformation, fixed and interleaved.
5. Terminal punctuation and capitalisation are ignored in both modes.
6. The mode switch is not saved between visits.
7. The page is called "Transform" in the nav.
8. Each item lists every accepted answer, with the most natural first.
