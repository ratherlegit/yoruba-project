# Tone Practice: Design Spec

Date: 2026-10-19
Status: Draft, awaiting review
Feature 1 of 4 on the practice shortlist (tone practice, dictation, sentence transformation, proverb reading, built in that order).

## 1. Intent

Yoruba is tonal, and the app's current listening practice (`SoundPractice`) rests on seven hand-written minimal pairs, four of them about tone. That is a taste, not practice. The goal is a listening activity that trains the ear to hear tone, with enough material that a learner cannot memorize the answer key.

The learner hears a word (easier mode) or a whole sentence (harder mode) and picks the correct tone-marked spelling from real Yoruba words that have the same letters and differ only in their tone marks. In the harder mode the sentence is written out with a gap where the target word goes, and its English translation is shown. Hearing the full sentence matters: the learner has to pick the target word out from the words around it, which is how tone is met in real speech.

The practice reuses the vocab section's words, sentences, English and audio. What is new is a curated list of real tone-twins for those words, as text only.

## 2. Goals, non-goals, anti-goals

### Goals
- A learner can do repeated rounds of tone listening without seeing the same questions soon.
- Every choice is a real Yoruba word. No made-up distractors.
- Every twin is tagged with the source it was drafted from and marked needs-review, like all other content.
- Feedback teaches: after answering, the learner sees the correct word, its pitch line, and hears it again.
- Works in light and dark themes, with the existing diacritic rendering rules (precomposed NFC).
- No new audio is required to ship, because answers come from vocab words and sentences that already have clips (section 6).

### Non-goals
- Speech recognition, pronunciation scoring, recording.
- English meanings or glosses for the answer choices (the sentence's translation is shown; see section 3).
- Replacing the existing Sound Bank listening practice (it stays).
- Accounts, sync, XP, streaks.
- Spaced repetition scheduling.

### Anti-goals (a failure even if it technically works)
- Padding a choice list with invented words to reach three or four choices.
- A twin that differs in more than tone marks (a vowel dot or a consonant), since that tests spelling, not tone.
- Content that looks verified when it is not.
- A gap sentence that is ungrammatical, or a question the learner can finish without the audio. The choices carry no meanings, so the learner has to hear or already know the vocab.

## 3. How it works (decided with the user)

Two modes, which are also the difficulty levels. Words is the easier mode and Sentences is the harder one. A switch chooses between them; the default is Words.

**Words (easier).** The learner hears one vocab word on its own and picks it from the word and its real twins. No sentence, no gap, no English.

**Sentences (harder).**
- A play button plays the whole vocab sentence.
- The sentence is written out with one gap where the target word goes (the vocab section's existing `blank` field says which part to blank when the word changes form).
- The sentence's English translation is shown on screen while the learner answers. (Decided with the user: show English for the sentence, not for the possible answers.)
- Choices: the target word plus its real twins, two to four in all, same letters (including under-dots), different tone marks only. A word with one real twin gives a two-choice question.
- No English is shown for the choices, before or after answering.

**After answering (both modes).** The correct word is shown, its `PitchLine` shows, and the audio plays again. In Sentences mode the gap fills with the correct word. A wrong answer also shows the chosen word's pitch line, so the difference is visible. (Author's call: in Words mode a wrong answer could also play the chosen word, but only if that word has a clip; most twins will not, so v1 does not.)

## 4. Content model

A new file `src/content/tone-twins.ts`. It adds only the twins; the word, sentence, English and audio stay in the vocab data.

```ts
export type ToneTwin = {
  yoruba: string;     // single word, NFC, tone marks included
  english: string;    // for the reviewer only, never rendered in the app
};
export type ToneTwinEntry = {
  vocabId: string;    // id of the vocab word this entry belongs to
  twins: ToneTwin[];  // 1 to 3 real words
  source: string;     // where the twins were drafted from
  confidence: Confidence; // "needs-review" until a native speaker checks it
  note?: string;
};
```

Validation (run by `npm run validate` and a unit test):
- `vocabId` exists in the vocab data, and the vocab word is a single word.
- Each entry has 1 to 3 twins.
- Each twin has the same letters as the vocab word once tone marks (acute, grave, macron) are removed; under-dots and nasal marks are kept and must match.
- A twin is not equal to the vocab word or to another twin after NFC normalization.
- Every twin, and the vocab word, has a tone pattern the app can compute (`syllabify`, `toneOf` in `src/lib/tone.ts`).
- Every entry has a source and a confidence value.

## 5. Question generation

`src/lib/tone-practice.ts` builds a round, in the style of `buildPractice` in `src/lib/sound-practice.ts`:
- Words mode: one question per vocab word that has an entry and a word clip.
- Sentences mode: one question per vocab word that has an entry and a sentence clip.
- The answer is the vocab word; the choices are the word plus its twins.
- Seeded shuffle, round length of 10 (same as today), no repeats within a round.
- The gap sentence is the vocab sentence with the target (the `blank` substring, or the word) replaced by a blank of fixed width.

A word appears in a mode only if it has that mode's clip. Ordering within a mode is random for v1; sorting by how many syllables differ is deferred.

## 6. Audio

No new audio is needed for a first release.
- All 250 vocab words have word clips today.
- 150 of the 250 vocab sentences have clips today. The other 100 belong to the vocab audio batch that is not generated yet. When those are generated through the normal vocab workflow, their words become available in Sentences mode with no extra work in this feature.
- Twins are only ever shown as text, so they need no clips.

Optional later: clips for twin words, which would allow "play the word you chose" on a wrong answer. That is not part of v1.

## 7. Where it lives

A new "Tone practice" section on the Sound Bank page (`src/pages/SoundBank.tsx`), next to the existing listening practice, which stays. A separate component `TonePractice.tsx` reusing `AudioButton`, `ChoiceQuestion` and `PitchLine`. (Author's call; easy to move.)

## 8. Left to the builder

- Final copy and layout for the question and feedback screens, within the existing visual style.
- Where the English translation sits relative to the gap sentence.
- Ordering inside a mode (random for v1).
- Content batch size for the first release (the target is at least 30 vocab words with real twins; the real number depends on how many vocab words have twins that can be sourced).

## 9. Content authoring process

1. Go through the vocab words and, for each single-word entry, look for real words with the same letters and different tone marks. Draft from published sources (standard Yoruba dictionaries and grammars). Record the source per entry. If no source confirms a twin, leave it out rather than guess.
2. Record each twin's English meaning for the reviewer, in the data only.
3. All entries are `needs-review`. They appear in `content/REVIEW.md` through `scripts/generate-review.ts` so a native speaker can check them.
4. Nothing is marked verified by the builder.

## 10. Risks

- Content correctness: tone-twin lists are easy to get wrong. The needs-review marker and review file are the mitigation; a native check is required before the feature is described as accurate.
- Coverage: many vocab words may have no real twin. The practice only includes words that do, so the pool could be smaller than the 250 words. That is accepted over inventing twins.
- The sentence translation can hint at the answer. Accepted: it was the user's choice, and the choices carry no meanings.
- Whole-sentence audio hides word boundaries from a learner who cannot segment speech yet. Accepted: the user wants this because it trains separating the word from its neighbors.

## 11. Calls made by the author of this spec

These are not agreed decisions:
1. Placement on the Sound Bank page next to the existing practice.
2. Words mode shows no English at all.
3. No "play the chosen word" on a wrong answer in v1.
4. Random order inside each mode for v1.
5. A first batch target of at least 30 vocab words with sourced twins.
6. Default mode is Words.
7. The existing Sound Bank minimal pairs are not folded into this practice.
