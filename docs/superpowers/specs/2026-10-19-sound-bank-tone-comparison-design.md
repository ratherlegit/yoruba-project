# Sound Bank Tone Comparison: Design Spec

Date: 2026-10-19
Status: Draft, awaiting review

## 1. Intent

The Sound Bank's Tones section has three cards (High, Mid, Low), and each card uses different example words (wá, omi, bàtà and so on). A learner never sees the same vowel in all three tones side by side, so the cards teach "what a tone is" but not "how one vowel changes with tone". Two gaps came up in use:

- Letters that carry both an under-dot and a tone mark (ẹ́, ẹ̀, ọ́, ọ̀) are not covered anywhere in the Sound Bank.
- There is no way to hear and compare a, á and à next to each other.

This feature replaces the three Tone cards with a comparison grid: one row per vowel, three real words per row that share the same spelling and differ only in the tone of the vowel, each with audio and a pitch line. It adds a short card that explains how the under-dot and the tone mark combine.

## 2. Goals, non-goals, anti-goals

### Goals
- For each of the seven oral vowels (a, e, ẹ, i, o, ọ, u), a learner can hear mid, high and low versions of the same single-syllable word, side by side, in that order (mid, high, low).
- The ẹ and ọ rows show the dotted vowels with every tone mark.
- A short explanation card says what the under-dot does and what the tone mark does, and that they are independent.
- Every word has audio and a pitch line. Every row is tagged with its source and marked needs-review.
- Works in light and dark themes and at phone width, with existing diacritic rendering rules (precomposed NFC).

### Non-goals
- A quiz or practice for this content (the Practice section below already trains tone listening).
- Nasal vowels (an, ẹn, in, un, ọn) and syllabic nasals (ń, ǹ). They are not covered by this feature.
- Isolated-letter audio. Every clip is a real word.
- Changing the Vowels, Consonants, Minimal pairs or Practice sections.

### Anti-goals (a failure even if it technically works)
- A row whose words differ in anything other than the tone of the vowel, since that would compare spelling, not tone.
- A word shown without a working audio clip. A row must not ship unless all three of its clips exist.
- Content that looks verified when it is not.
- Mixing multi-syllable words into a row, which would blur which syllable carries the tone.

## 3. How it works

The Tones section keeps its heading and its `#tones` anchor and its place in the page order (Vowels, Consonants, Tones, Minimal pairs, Practice). Inside it, top to bottom:

1. **Explanation card.** My draft copy, needs-review: "Two marks do two different jobs. A dot under e or o changes the vowel sound (ẹ as in 'bed', ọ as in 'saw'). A mark above the vowel changes its pitch: no mark is mid, an acute accent is high, a grave accent is low. They are independent, so ẹ, ẹ́ and ẹ̀ are the same vowel at three pitches, and so are ọ, ọ́ and ọ̀." A legend with the three tone chips (Mid, unmarked; High, acute; Low, grave) sits with it. The card points to the ẹ and ọ rows.
2. **The grid.** Seven rows in the order a, e, ẹ, i, o, ọ, u. Each row shows the vowel letter, then three cells in the order mid, high, low. Each cell has the word (Yoruba, bold), its English meaning (muted, like the other Sound Bank cards), a play button, and the word's `PitchLine`. Each row also has a "Play all" button that plays mid, high, low in sequence, like the Minimal pairs cards.

The three old Tone cards (`t-high`, `t-mid`, `t-low`) are removed. Their example words are all vocab words, so their clips stay in use and no audio is orphaned.

## 4. Content

Seven rows. Every word is a single syllable; the three words in a row have the same letters and the vowel carries the tone. Sources are the Yoruba sections of the Wiktionary pages named in the last column, read on 2026-10-19.

| Vowel | Mid | High | Low | Page |
|---|---|---|---|---|
| a | wa (our) | wá (come) | wà (be, be located) | wa |
| e | le (hard) | lé (chase) | lè (can) | le |
| ẹ | bẹ (peel) | bẹ́ (hop down) | bẹ̀ (beg) | bẹ |
| i | ṣi (make a mistake) | ṣí (open) | ṣì (become dull) | ṣi |
| o | ro (hoe, till) | ró (wrap a wrapper) | rò (think) | ro |
| ọ | kọ (write) | kọ́ (build, teach) | kọ̀ (refuse) | kọ |
| u | mu (drink) | mú (take) | mù (be hidden) | mu |

Doubts to record in each row's note: Wiktionary writes the mid words (ṣi, le, ro, bẹ and so on) without a tone mark, as mid tone is unmarked, so a native speaker should confirm each mid word and meaning; several words have more than one meaning on the page and one is chosen for display.

All 21 words have clips: wá, ṣí, kọ́ and mu already existed, and the other 17 were generated on 2026-10-19 and are in `public/audio/` with manifest entries.

Data model, in `src/content/sounds.ts`:

```ts
export type ToneCompareWord = { yoruba: string; english: string; tone: Tone };
export type ToneCompareRow = {
  id: string;                  // for example "tc-a"
  vowel: string;               // "a", "e", "ẹ", "i", "o", "ọ" or "u"
  words: [ToneCompareWord, ToneCompareWord, ToneCompareWord]; // mid, high, low
  source: string;
  confidence: Confidence;
  note: string;
};
export const TONE_COMPARE: ToneCompareRow[];
```

Validation (extends `validateSounds` or a new `validateToneCompare`, run by `npm run validate`):
- Exactly three words per row, with tones mid, high, low in that order.
- All three words have the same letters once tone marks are removed (`stripTones` in `src/lib/tone.ts`) and are distinct.
- Each word is one syllable (`syllabify`), its syllable's tone (`toneOf`) equals the word's declared tone, and the syllable's vowel (tone marks removed) equals the row's `vowel`.
- Strings are NFC and contain no em dash; each row has a source and, because it is needs-review, a note.
- Every word has an audio clip (see section 5).

## 5. Audio

No further generation is needed for this feature as specified.
- The new words must be listed so the audio tooling knows about them: `collectSoundAudioStrings` in `src/lib/audio-strings.ts` takes the comparison rows as an optional third parameter and adds each word as a `sound-word` string. The string lister (`scripts/list-audio-strings.ts`) and the audio tests (`src/lib/audio.test.ts`, `src/lib/audio-strings.test.ts`) pass the rows too.
- This also fixes a test that fails right now: `has no manifest entries without a lesson, vocab or sound string` fails because the 17 new clips are in the manifest but no content uses them yet.
- A new test fails if any comparison word has no manifest entry or no file in `public/audio/`.

## 6. Review file

`content/REVIEW.md` gets the comparison rows in its Sound Bank section: the row, its three words with English, the source and the doubt. They count toward "N items need review". `buildReviewMarkdown` in `src/lib/review.ts` takes the rows through its existing `soundData` argument, and `scripts/generate-review.ts` passes them.

## 7. Code changes

- `src/content/sounds.ts`: add `ToneCompareWord`, `ToneCompareRow`, `TONE_COMPARE`; remove the three tone `Sound` entries; drop `"tones"` from `SoundSection` and the `tone` field on `Sound` if nothing else uses them.
- `src/content/validate-sounds.ts`, `src/content/sounds.test.ts`: remove tones-section rules and tests; add the validation above.
- `src/components/SoundCard.tsx`: remove the tones branch (the tone heading, `ToneChip`, `PitchLine`) now that no card is a tone card.
- New `src/components/ToneCompare.tsx`: the explanation card and the grid, reusing `AudioButton`, `PitchLine`, `ToneChip` and `playSequence`.
- `src/pages/SoundBank.tsx`: the Tones section renders `ToneCompare`; the generic loop covers vowels and consonants only.
- Audio tooling, review and tests as in sections 5 and 6.
- e2e: `e2e/sounds.spec.ts` still reaches `#tones` and the Tones heading; add an assertion that the grid has seven rows.

## 8. Left to the builder

- Exact layout: three columns on desktop, stacked cells on a phone, within the existing visual style.
- How the explanation card and legend are arranged.
- Accessible names for the play buttons (for example "Listen to wà") and whether the row is a list or a table.

## 9. Risks

- Content correctness: tone and meaning of each word need a native check. Everything is needs-review.
- Mid words are unmarked, so a reader could take "wa" for a word with no tone at all. The mid column's label and the pitch line address this.
- A word's meaning is only one of several on its Wiktionary page. The displayed meaning is a teaching choice, not the whole entry.
- Very short clips (kọ and kọ̀ are about 0.3 seconds). They should be auditioned in the app.

## 10. Calls made by the author of this spec

These are not agreed decisions:
1. English meanings are shown next to the words, as on the other Sound Bank cards.
2. Column order is mid, high, low, following the user's "a, a high, a low".
3. A "Play all" button per row, as on the Minimal pairs cards.
4. The three old Tone cards and their `tone` plumbing are removed, not kept.
5. The row words and the explanation card copy are my drafts.
6. Nasal vowels and syllabic nasals are out of scope.
