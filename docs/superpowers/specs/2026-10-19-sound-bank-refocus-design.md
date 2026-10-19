# Sound Bank Refocus: Design Spec

Date: 2026-10-19
Status: Draft, awaiting review
Supersedes `2026-10-19-sound-bank-tone-comparison-design.md` (deleted; its content is folded in here).

## 1. Intent

The Sound Bank has five sections: Vowels, Consonants, Tones, Minimal pairs and Practice. Three problems came up in use:

- The Tones section is three cards with different words, so a learner never hears the same vowel in all three tones, and letters with an under-dot plus a tone mark (ẹ́, ẹ̀, ọ́, ọ̀) are not covered.
- The Vowels and Consonants cards describe sounds by comparison to English ("close to 'aw' in 'saw'"). That is approximate, and most consonants are obvious or close to English.
- The sounds that actually need practice are the tones, gb, p (said like "kp"), and s versus ṣ (sh). The Practice section only trains tone.

So the Sound Bank is refocused: the tone comparison becomes the centerpiece, the three hard consonants get focused cards with audio and real contrast words, the rest becomes a collapsed reference list, and Practice trains the consonants as well as tone.

## 2. Goals, non-goals, anti-goals

### Goals
- A learner can hear the same single-syllable word in mid, high and low tone side by side, for every oral vowel (a, e, ẹ, i, o, ọ, u) and every nasal vowel (an, in, un, ọn).
- The under-dot and the tone mark are explained together, with the ẹ and ọ rows showing every combination.
- gb, p and s versus ṣ each have a focused card with real contrast words that differ only in that consonant, each playable.
- Practice can quiz those contrasts as well as tone.
- All new words are real Yoruba words with audio. Every row and set is tagged with its source and marked needs-review.

### Non-goals
- Isolated-letter audio. Every clip is a real word.
- Removing content or deleting audio clips. Demoted cards keep their words and clips.
- Sentence-level consonant practice (no sentence audio exists for these).
- The ẹn nasal vowel (the app already marks it rare and debated) and syllabic nasals (ń, ǹ).

### Anti-goals (a failure even if it technically works)
- A row or set whose words differ in more than the thing being compared (tone for rows, the consonant for sets).
- Padding a set with invented words.
- A word shown without a working clip.
- Content that looks verified when it is not.

## 2a. Page structure

Order on `/sounds`, with the jump bar following it:
1. **Tones** (heading and `#tones` anchor kept): the explanation card, then the grid.
2. **Key consonants**: three focused cards (gb, p, s versus ṣ).
3. **Minimal pairs**: unchanged.
4. **Letters reference**: a collapsed `<details>` containing the old Vowels cards and the old Consonants cards other than gb, p, s and ṣ (those four become the focused cards). Collapsed by default. (Author's call: vowels are demoted here rather than deleted, so no cards or audio are lost.)
5. **Practice**: the extended activity (section 6), last on the page (decided with the user).

## 3. Tones section

**Explanation card** (my draft copy, needs-review): "Two marks do two different jobs. A dot under e or o changes the vowel sound (ẹ as in 'bed', ọ as in 'saw'). A mark above the vowel changes its pitch: no mark is mid, an acute accent is high, a grave accent is low. They are independent, so ẹ, ẹ́ and ẹ̀ are the same vowel at three pitches, and so are ọ, ọ́ and ọ̀. In a nasal vowel the mark goes on the vowel, not the n, as in ọ́n." A legend of the three tone chips (Mid, unmarked; High, acute; Low, grave) sits with it.

**Grid.** Eleven rows: a, e, ẹ, i, o, ọ, u, an, in, un, ọn. Each row has a header (the vowel letter and its short English comparison, reused from the old cards, needs-review) and three cells in the order mid, high, low. Each cell has the word (bold), its English meaning (muted), a play button and a `PitchLine`. Each row has a "Play all" button that plays mid, high, low in order.

| Vowel | Mid | High | Low | Wiktionary page |
|---|---|---|---|---|
| a | wa (our) | wá (come) | wà (be, be located) | wa |
| e | le (hard) | lé (chase) | lè (can) | le |
| ẹ | bẹ (peel) | bẹ́ (hop down) | bẹ̀ (beg) | bẹ |
| i | ṣi (make a mistake) | ṣí (open) | ṣì (become dull) | ṣi |
| o | ro (hoe, till) | ró (wrap a wrapper) | rò (think) | ro |
| ọ | kọ (write) | kọ́ (build, teach) | kọ̀ (refuse) | kọ |
| u | mu (drink) | mú (take) | mù (be hidden) | mu |
| an | kan (one) | kán (break) | kàn (touch, concern) | kan |
| in | rin (grate) | rín (smile, laugh) | rìn (walk) | rin |
| un | sun (roast, cry) | sún (move, shift) | sùn (sleep) | sun |
| ọn | wọn (their) | wọ́n (expensive; also "they") | wọ̀n (measure, weigh) | wọn |

Doubts for each row's note: Wiktionary writes mid words without a tone mark, so a native speaker should confirm every mid word and meaning; several words have unrelated meanings on their page and one is chosen for display (sun and wọn especially).

## 4. Key consonants

Three cards, each with a one-line description (reused from the existing gb, p, s and ṣ cards, needs-review) and contrast sets. Every set's words have the same vowel and tone, so only the consonant differs. Each word has English, a play button, and each set a "Play all".

| Focus | Set | Words |
|---|---|---|
| gb | a, low | bà (perch), gà (tickle), gbà (rescue, take) |
| gb | e, high | gé (cut), gbé (carry) |
| gb and p | ọ, high | pọ́ (inflate, pump), kọ́ (build), bọ́ (fall), gbọ́ (hear) |
| p | ọ, low | pọ̀ (be plenty), kọ̀ (refuse), bọ̀ (come back), gọ̀ (be foolish) |
| s versus ṣ | é, high | sé (shut, block), ṣé (question word, as in "Ṣé o fẹ́ jẹun?") |
| s versus ṣ | ẹ́, high | sẹ́ (sieve), ṣẹ́ (break) |
| s versus ṣ | ẹ̀, low | sẹ̀ (condense), ṣẹ̀ (sin) |

The gb card shows the first three sets (the ọ-high set shows it next to b and k), the p card shows the two ọ sets, and the s versus ṣ card shows the three s/ṣ sets. A set may appear on more than one card. Strict p minimal pairs are scarce, so the p sets contrast p with k, b, gb and g at the same vowel and tone.

## 5. Content model and validation

In `src/content/sounds.ts`:

```ts
export type ToneCompareWord = { yoruba: string; english: string; tone: Tone };
export type ToneCompareRow = {
  id: string;        // "tc-a", ..., "tc-on"
  vowel: string;     // "a", "ẹ", ..., "an", "ọn"
  words: [ToneCompareWord, ToneCompareWord, ToneCompareWord]; // mid, high, low
  source: string; confidence: Confidence; note: string;
};
export type ConsonantSet = {
  id: string;
  focus: "gb" | "p" | "s-sh";
  explain: string;   // one line saying what to listen for
  words: { yoruba: string; english: string }[]; // 2 to 4
  source: string; confidence: Confidence; note: string;
};
export const TONE_COMPARE: ToneCompareRow[];
export const CONSONANT_SETS: ConsonantSet[];
```

Validation (run by `npm run validate` and unit tests):
- **Tone rows:** exactly three words with tones mid, high, low in that order; same letters once tones are removed (`stripTones` in `src/lib/tone.ts`); distinct; each word is one syllable (`syllabify`), its syllable tone (`toneOf`) equals the declared tone, and `stripTones(word)` ends with the row's vowel.
- **Consonant sets:** 2 to 4 words; distinct; every word has the same vowel and tone as the others (compare the string after the first consonant letters: `gb` counts as one letter, as `syllabify` already treats it), so only the consonant differs.
- **Both:** NFC, no em dash, a source, a note (needs-review), and every word has a clip in `src/content/audio-manifest.json` and in `public/audio/`.
- The old three tone cards (`t-high`, `t-mid`, `t-low`), the `tones` section, and the tone-specific rules in `validateSounds` and `sounds.test.ts` are removed.

## 6. Practice

The Practice section's mode switch gains a third mode, **Sounds**, next to Words and Sentences. In Sounds mode the learner hears one word and picks it from the words of its consonant set, with no English. Feedback is the same as Words mode: the correct word, its pitch line, a replay, and the chosen word when wrong. Words and Sentences are unchanged. `ToneMode` becomes `"words" | "sentences" | "sounds"`, `ToneSources` gains `sets: ConsonantSet[]`, and `buildToneRound` builds Sounds questions from the sets (one question per word with a clip, in a set with at least two clips). The existing Sound Bank sound pairs (vowel contrasts such as oko and ọkọ) are not included. A mode with no playable question shows the existing "needs audio" message.

## 7. Audio

All new words are real words and the audio workflow already in `tools/audio/` is used. Clips for the 21 tone words are already generated and split (17 new on 2026-10-19). The other 25 words (about 121 credits) were generated and split on 2026-10-19 from the paste file `tools/audio/workspace/split-work/sound-focus/part-1.txt` (download saved as `raw-downloads/sounds/sound-focus-1.mp3`):
- Nasal rows (10): kan, kán, kàn, rin, rín, rìn, sun, sún, wọn, wọ̀n.
- Consonant sets (15): bà, gà, gbà, gé, bọ́, bọ̀, gọ̀, pọ́, pọ̀, sé, ṣé, sẹ́, ṣẹ́, sẹ̀, ṣẹ̀.

Every row and set word now has a clip (the 9 that existed before: wá, ṣí, kọ́, kọ̀, mu, sùn, wọ́n, gbé, gbọ́). `collectSoundAudioStrings` in `src/lib/audio-strings.ts` takes the rows and sets (optional parameters) so `npm run audio:list`, the string lister and the audio tests know about them. Tests fail if any row or set word has no clip. No existing clip is deleted; the manifest-orphan test keeps passing because every old Sound Bank word stays on the page (in the reference list).

## 8. Review file

`content/REVIEW.md` lists each row and set (words, English, source, doubt) in its Sound Bank section and counts them in the needs-review total. `buildReviewMarkdown` takes them through its `soundData` argument; `scripts/generate-review.ts` passes them.

## 9. Code changes

- `src/content/sounds.ts`: add the types and data; remove the three tone `Sound` entries; remove `"tones"` from `SoundSection` and the `tone` field on `Sound` if nothing else uses them.
- `src/content/validate-sounds.ts`, `src/content/sounds.test.ts`: remove tones-section rules; add validation above.
- `src/components/SoundCard.tsx`: remove the tones branch.
- New `src/components/ToneCompare.tsx` (explanation card and grid) and `src/components/KeyConsonants.tsx` (three focused cards), reusing `AudioButton`, `PitchLine`, `ToneChip` and `playSequence`.
- `src/pages/SoundBank.tsx`: new section order, the `<details>` reference list, new jump bar names.
- `src/lib/tone-practice.ts`, `src/components/TonePractice.tsx`: the Sounds mode; `SoundBank` passes `sets`.
- Audio tooling, review file and tests as above. `e2e/sounds.spec.ts`: update the section names and jump links; assert the grid has 11 rows.

## 10. Left to the builder

- Layout within the existing visual style: grid columns on desktop, stacked cells on a phone.
- Accessible names for play buttons and whether rows are lists or tables.
- Where the explanation card's legend sits.

## 11. Risks

- Content correctness: tones, meanings and the choice of one meaning per word need a native check. Everything is needs-review.
- Mid words are unmarked, so "wa" can look like a word with no tone at all; the mid column label and pitch line address this.
- Very short clips (kọ and kọ̀ are about 0.3 seconds). They should be auditioned in the app.
- Two sets mix several consonants (p with k, b, gb or g). That teaches the contrast but is not a strict minimal pair.

## 12. Calls made by the author of this spec

These are not agreed decisions:
1. The Vowels cards move into the collapsed reference list, with the other consonants, instead of being deleted.
2. The old gb, p, s and ṣ cards are replaced by the focused cards.
3. The page order is Tones, Key consonants, Minimal pairs, Letters reference, then Practice last (Practice last was decided with the user).
4. Row headers keep the old English comparison for each vowel.
5. Sounds is a third mode in the existing Practice switch.
6. English meanings are shown next to words in the grid and sets, but not in Sounds mode.
7. The row words, set words, explanation copy and the ṣé gloss are my drafts.
8. A "Play all" per row and per set.
