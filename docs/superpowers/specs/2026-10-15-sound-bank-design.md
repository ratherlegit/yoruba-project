# Sound Bank: Design Spec

Date: 2026-10-15
Status: Draft, awaiting review
Extends: `2026-10-13-yoruba-learning-app-design.md` and `2026-10-13-vocab-section-design.md`

## 1. Purpose

A page called **Sound Bank** that lists every sound in Yoruba with a way to hear it: vowels, consonants and tones, each demonstrated through real words, plus minimal pairs and a short listen-and-pick practice. It is a reference a learner can return to at any point, with no account and no lock.

### Success criteria
- `/sounds` is reachable from the header nav ("Sound Bank") and from Home.
- Every sound card shows the letter, a plain English comparison, and 2 to 3 tone-marked example words, each with a speaker button.
- Tones section shows high, mid and low with pitch lines and example words.
- Minimal pairs can be played one word at a time and as a "play all" row.
- A listen-and-pick practice gives instant feedback; it stores no progress in v1.
- All Yoruba is NFC with full tone marks, in both themes, and `needs-review` with a note.
- Existing grammar, vocab, progress and tests are unaffected.

### Non-goals (v1)
- Progress tracking or completion for the Sound Bank.
- Speech recognition or recording the learner.
- Playing bare isolated consonants (unreliable in ElevenLabs; every sound is shown through real words).
- Dialect variation beyond a `note` where relevant.

## 2. Content

File: `src/content/sounds.ts`, exporting `SOUND_SECTIONS`, `MINIMAL_PAIRS`, and helpers. A `sources` comment at the top, like the lesson files.

### Data model

```ts
type SoundExample = { yoruba: string; english: string };   // NFC, tone-marked

type Sound = {
  id: string;                       // e.g. "c-sh", "v-ee-open"
  section: "vowels" | "consonants" | "tones";
  letter: string;                   // display form, e.g. "ṣ", "gb", "ẹ", "an"
  compare: string;                  // plain English comparison, e.g. "like 'sh' in 'ship'"
  examples: SoundExample[];         // 2 to 3
  tone?: Tone;                      // tones section only
  confidence: Confidence;           // "needs-review" for all in v1
  note?: string;                    // required when needs-review
};

type MinimalPair = {
  id: string;
  contrast: "tone" | "sound";
  explain: string;                  // one line on what changes
  words: SoundExample[];            // 2 to 3, differ only in the contrast
  confidence: Confidence;
  note?: string;
};
```

### Coverage
- **Vowels:** the 7 oral vowels (a, e, ẹ, i, o, ọ, u) and the nasal vowels (an, ẹn, in, ọn, un).
- **Consonants:** the full Yoruba consonant set, with extra emphasis cards for gb, kp and ṣ.
- **Tones:** high, mid, low (3 cards), each with a pitch line.
- **Minimal pairs:** about 6 to 10 sets, mixing tone contrasts (for example the ọkọ family) and sound contrasts (ṣ vs s, ẹ vs e, ọ vs o).
- Final sound list and pairs are drafted during authoring and listed in the review file for a native speaker to check.

### Validator (sibling `validate-sounds.ts`, wired into `npm run validate`)
- NFC on all Yoruba; no em dash (U+2014) anywhere.
- Unique ids; every sound has 2 to 3 examples; every pair has 2 to 3 words, all distinct.
- `needs-review` requires a `note`.
- Tones section has exactly one card per tone with the `tone` field set; other sections do not set it.
- Minimal-pair words are distinct strings after NFC (a pair of identical strings is a content bug).

## 3. Page

Route `/sounds`, component `src/pages/SoundBank.tsx`. Layout follows the existing theme tokens and the adire look; no new design language.

1. **Hero/heading:** "Sound Bank" with one short line of orientation (no eyebrow label).
2. **Jump bar:** anchor links to Vowels, Consonants, Tones, Minimal pairs, Practice.
3. **Sound cards** (grid, one column on phones): large letter, English comparison, example rows (word, gloss, `AudioButton`). Tone cards also show `ToneChip` and `PitchLine`.
4. **Minimal pairs:** each set is a card with its explanation, the words side by side each with an `AudioButton`, and a "Play all" button that plays the clips in order.
5. **Practice:** listen-and-pick. One question at a time: a speaker button plays a word from a minimal pair; the learner picks which spelling they heard (2 to 3 choices, from the same pair). Reuses `ChoiceQuestion` and the feedback styling; ends with a score line and "Try again". Seeded shuffle for choices, no progress stored.

Nav: "Sound Bank" link in `Layout.tsx` header beside Vocab; a card or link on Home.

### Play all
A small helper in `src/lib/audio.ts` plays a list of keys sequentially (waits for `ended`, skips keys with no clip, stops if a new play starts). Reuses the module-level "one clip at a time" rule from `AudioButton`.

## 4. Audio

- Reuses `audioKey()`, `src/content/audio-manifest.json`, `public/audio/<sha1[:12]>.mp3`, and `AudioButton`.
- `scripts/list-audio-strings.ts` (`npm run audio:list`) gains a `sound-word` group covering every example and pair word. Words already in the manifest from vocab are not regenerated.
- Expected volume: about 120 to 150 clips of 1 to 2 words each, a few hundred credits. Generation follows the existing paste-and-split workflow (`prepare_paste.py --group sound-word`, then `split_clips.py`).
- Until a clip exists, `AudioButton` renders nothing for that word; the page still shows the word and gloss. A reported count (not a failure) lists sound words still without audio.
- Practice questions only draw from words that have audio; if a pair has fewer than 2 playable words, it is skipped in practice.

## 5. Accuracy and flagged uncertainty

- Everything is `needs-review` with a note; nothing is marked `verified` by the model.
- `content/REVIEW.md` gains a Sound Bank section: each sound (letter, comparison, examples) and each pair, with the doubt noted (tone, English comparison accuracy, regional variant).
- English comparisons are approximations; wording says "like" or "close to", never "the same as".
- Sources preference unchanged: published grammars and phonology references, listed in the file comment.

## 6. Testing

- Unit: sounds validator (counts, NFC, em dash, unique ids, tone coverage, distinct pair words); practice question builder (answer present, no duplicate choices, choices from the same pair, seeded determinism, skips pairs without audio); `playSequence` helper (order, skip missing, stop on new play).
- Content test: every sounds string passes NFC; every `needs-review` has a note; REVIEW generation includes the section.
- Component: `SoundBank` renders all sections and anchors; cards show speaker buttons only for words with audio; practice feedback and "Try again".
- Playwright: open `/sounds` from the nav, see all five sections, answer one practice question, in both themes.
- Manual: localhost check with screenshots shown to the owner for design approval before any commit.

## 7. Build order

1. Data model, validator, and a first small set (vowels) as the reference.
2. Page, cards, nav and Home link.
3. Author the rest (consonants, tones, pairs); regenerate REVIEW.
4. Minimal pairs UI, `playSequence`, practice quiz.
5. Extend audio listing; owner generates clips in batches.
6. Localhost verification and review.

## 8. Open questions
- Final consonant list and example words (drafted in authoring, owner or native speaker may swap).
- Whether Practice should later feed into progress or a daily review (out of scope for v1).
- Who reviews the Yoruba, and in what format (unchanged from the main spec).
