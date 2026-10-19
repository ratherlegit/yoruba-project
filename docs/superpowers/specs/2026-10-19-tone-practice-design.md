# Tone Practice: Design Spec

Date: 2026-10-19
Status: Draft, awaiting review
Feature 1 of 4 on the practice shortlist (tone practice, dictation, sentence transformation, proverb reading, built in that order).

## 1. Intent

Yoruba is tonal, and the app's current listening practice (`SoundPractice`) rests on seven hand-written minimal pairs, four of them about tone. That is a taste, not practice. The goal is a listening activity that trains the ear to hear tone inside real speech, with enough material that a learner cannot memorize the answer key.

The learner hears a whole sentence, sees the same sentence written with a gap where the target word goes, and picks the real word that belongs in the gap from words that differ from each other only in their tone marks. Hearing the full sentence matters: the learner has to pick the target word out from the words around it, which is how tone is met in real speech.

This is not vocabulary practice. Meanings stay in the vocab section.

## 2. Goals, non-goals, anti-goals

### Goals
- A learner can do repeated rounds of tone listening without seeing the same questions soon.
- Every choice is a real Yoruba word. No made-up distractors.
- Every item is tagged with the source it was drafted from and marked needs-review, like all other content.
- Feedback teaches: after answering, the learner sees the correct word in the sentence, its pitch line, and hears it again.
- Works in light and dark themes, with the existing diacritic rendering rules (precomposed NFC).

### Non-goals
- Speech recognition, pronunciation scoring, recording.
- English meanings or glosses shown during a question.
- Replacing the existing Sound Bank listening practice (it stays).
- Accounts, sync, XP, streaks.
- Spaced repetition scheduling.

### Anti-goals (a failure even if it technically works)
- Padding a set with invented words to reach three or four choices.
- A set whose words differ in more than tone marks (a vowel dot or a consonant), since that tests spelling, not tone.
- Content that looks verified when it is not.
- A question whose written gap sentence is ungrammatical or whose answer can be had by meaning alone while the audio goes unused. The audio must be needed.

## 3. How it works (decided with the user)

- Question screen: a play button for the whole sentence, the sentence written out with one gap, and the choices.
- Audio plays the whole sentence, not the word alone.
- Choices: two to four real words, same letters (including under-dots), different tone marks only. A set with only two real words gives a two-choice question.
- No English shown during the question.
- After answering: the gap fills with the correct word, its `PitchLine` shows, the sentence plays again. If the answer was wrong, the chosen word's pitch line is also shown, so the difference is visible. (Builder's call: playing the chosen word's own clip is not possible unless that word has a clip; see section 6.)
- Material: a curated list of real tone-minimal word sets, roughly 30 to 60 sets, with one short sentence per word.

## 4. Content model

A new file `src/content/tone-sets.ts`:

```ts
export type ToneSetWord = {
  yoruba: string;      // single word, NFC, tone marks included
  sentence: string;    // full sentence containing the word exactly once
};
export type ToneSet = {
  id: string;
  words: ToneSetWord[];     // 2 to 4 entries
  source: string;           // where the set was drafted from
  confidence: Confidence;   // always "needs-review" until a native speaker checks it
  note?: string;
};
```

English meanings are not stored in the question data. For the review file only, an `english` field per word is allowed so a native speaker can check the set; it is never rendered in the app. (Builder's call.)

Validation (run by `npm run validate` and a unit test):
- Each set has 2 to 4 words.
- All words in a set share the same letters once tone marks (acute, grave, macron) are removed; under-dots and nasal marks are kept and must match.
- All words in a set are distinct after NFC normalization.
- Each word's sentence contains that word exactly once as a whole word, and does not contain the other words of its set.
- Every word has a tone pattern the app can compute (`syllabify`, `toneOf` in `src/lib/tone.ts`).
- Every set has a source and a confidence value.

## 5. Question generation

`src/lib/tone-practice.ts` builds a round from the sets, in the style of `buildPractice`:
- One question per word whose sentence clip exists, in a set where at least two words have clips.
- The answer is the word; the choices are every word in the set.
- Seeded shuffle, round length of 10 (same as today), no repeats within a round.
- The gap sentence is the word's sentence with the word replaced by a blank of fixed width.

Difficulty ordering is deferred (section 8). Round one is random from the available pool.

## 6. Audio

Clips are whole sentences, generated with the existing ElevenLabs pipeline in `tools/audio/`. The sentence strings need to be added to the string lister (`scripts/list-audio-strings.ts` and `src/lib/audio-strings.ts`) as a new group, and the existing audio tests (every collected string has a manifest entry and file; no manifest entry without a source string) must cover them.

Budget: one sentence per word. At 30 to 60 sets and about 2.5 words per set that is roughly 75 to 150 sentences, a few thousand characters of generation. The free-plan paste workflow in `tools/audio/README.md` applies.

Because only sentence clips are guaranteed, the "play the word you chose" idea is out for v1; wrong answers show the chosen word's pitch line only.

The existing rule that every clip's text must be spoken Yoruba applies. Sentences must not contain parentheses or English.

## 7. Where it lives

A new "Tone practice" section on the Sound Bank page (`src/pages/SoundBank.tsx`), next to the existing listening practice, which stays. A separate component `TonePractice.tsx` reusing `AudioButton`, `ChoiceQuestion` and `PitchLine`. (Builder's call; easy to move.)

## 8. Left to the builder

- Final copy and layout for the question and feedback screens, within the existing visual style.
- Whether choices render as plain words or with the word's pitch line hidden until answered (the default is hidden).
- Difficulty ordering: a first version can be random. A later version can sort sets by how many syllables differ.
- Content batch size for the first release (a minimum of 30 sets is the target).

## 9. Content authoring process

1. Draft the sets from published sources (standard Yoruba dictionaries and grammars). Record the source per set. Where no source confirms a set or sentence, the note says so.
2. Write one short, natural sentence per word. Sentences use vocabulary and grammar the learner will meet in the app where possible, so the gap is not a vocabulary test.
3. All entries are `needs-review`. They appear in `content/REVIEW.md` through `scripts/generate-review.ts` so a native speaker can check them.
4. Nothing is marked verified by the builder.

## 10. Risks

- Content correctness: tone-minimal sets and sentence tones are exactly the kind of thing that is easy to get wrong. The needs-review marker and review file are the mitigation; a native check is required before the feature is described as accurate.
- Audio credits: each sentence costs credits; the first batch should be sized to what the plan allows.
- Whole-sentence audio hides the target word's boundaries from a learner who cannot segment speech yet. Accepted: the user wants this because it trains separating the word from its neighbors.

## 11. Calls made by the author of this spec

These are not agreed decisions:
1. Placement on the Sound Bank page next to the existing practice.
2. English meanings kept only in the review data, never shown in the app.
3. No "play the chosen word" on wrong answers.
4. Random order for v1; difficulty ordering later.
5. First batch of at least 30 sets.
