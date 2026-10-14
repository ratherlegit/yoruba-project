# Vocab Section: Design Spec

Date: 2026-10-13
Status: Draft, awaiting review
Extends: `2026-10-13-yoruba-learning-app-design.md` (the grammar app, section 1 non-goal "Vocabulary trainer" is now in scope)

## 1. Purpose

Grammar lessons currently include word-meaning and spelling-recall questions (for example "The sh sound in ṣọ́ra is written ___", "Which word means teacher?"). These give the answer away and test vocabulary, not the lesson's rule. This work:

1. Adds a **Vocab** section: common words grouped by difficulty level and by topic, practiced the way LangLoop does it.
2. Removes vocab and spelling-recall questions from grammar lessons and replaces them with questions that test the lesson's rule.

### Success criteria
- A learner can open Vocab, pick a level and topic, study flashcards with audio, then take a quiz and a gap-fill, with no account.
- Every Yoruba string (words and sentences) is NFC with full tone marks, in both themes.
- No grammar question can be answered by recalling a word's meaning or spelling alone.
- All new Yoruba is `needs-review` and appears in `content/REVIEW.md`, grouped by topic.
- Existing grammar behavior, progress, and tests are unaffected apart from the removed and replaced questions.

### Non-goals (v1)
- Spaced repetition or a daily review.
- Accounts or sync.
- Speech recognition.
- Custom or AI-generated word lists (LangLoop has these; out of scope).
- Locking vocab behind grammar progress.

## 2. Content

Five levels, same ids as grammar (`getting-started`, `beginner`, `intermediate`, `advanced`, `mastery`). Five topics per level, ten words per topic: 25 topics, 250 words.

Topics run from concrete to abstract. Proposed list (final wording is drafted during authoring and appears in the review file):

| Level | Topics |
|---|---|
| Getting Started | Greetings, numbers 1 to 10, family, body, food and drink |
| Beginner | Animals, colors, home and household, clothing, time and days |
| Intermediate | Town and travel, work and school, feelings, weather and nature, common verbs |
| Advanced | Market and money, health, community and religion, adjectives of quality, common verbs 2 |
| Mastery | Abstract nouns, character and virtues, law and custom, idiomatic phrases, proverb vocabulary |

### Data model

```ts
type VocabWord = {
  id: string;             // unique across all vocab, e.g. "gs-family-baba"
  yoruba: string;         // NFC, tone-marked
  english: string;        // gloss
  pos: "noun" | "verb" | "adjective" | "adverb" | "phrase" | "number" | "other";
  sentence: { yoruba: string; english: string }; // short, contains `yoruba` verbatim
  confidence: "verified" | "needs-review";
  note?: string;          // required when needs-review
};

type VocabTopic = { id: string; level: LevelId; title: string; blurb: string; words: VocabWord[] };
```

Files: `src/content/vocab/<level>.ts` (one per level), `src/content/vocab/index.ts` (`VOCAB_LEVELS`, `getTopic`, `allVocabWords`). Each file carries a `sources` comment like the lesson files.

### Validator (extends `validate.ts` or a sibling `validate-vocab.ts`)
- NFC on all Yoruba; no em dash (U+2014) anywhere.
- Exactly 5 topics per level, 10 words per topic, unique ids.
- `needs-review` requires a `note`.
- The word's `yoruba` appears verbatim in its own `sentence.yoruba` (gap-fill depends on it). Where the word legitimately changes form in a sentence (verb with a tone change, contractions), the validator accepts an optional `sentence.blank` field naming the exact substring to blank; otherwise it must match `yoruba`.
- English glosses within a topic are unique (so quiz definitions are not interchangeable).

## 3. Pages and practice

### Routes
- `/vocab`: five level cards with progress rings (topics completed out of 5).
- `/vocab/$levelId`: five topic cards.
- `/vocab/$levelId/$topicId`: the topic page, with a mode switcher.
- Nav gets a "Vocab" link beside the grammar entry; Home links to both sections.

### Modes (per topic)
1. **Flashcards**: Yoruba side shows the word with tone chips, pitch line and a Listen button; flip shows the English, part of speech and the example sentence (with its own Listen button and translation). Shows the construction breakdown only for words where `hasConstruction` would apply; v1 vocab words have no breakdown (plain words), so none shown.
2. **Quiz**: 10 questions, one per word. Mixed direction: Yoruba to English, and English to Yoruba. Four choices each. English to Yoruba distractors include same-letters-different-tone spellings where the topic has them, which reuses `checkAnswer` feedback kinds (correct / tone / mark / wrong).
3. **Gap-fill**: the word is blanked out of its example sentence; the English translation is shown as a hint; four choices from the topic's words. Choices are tone-sensitive.

### Distractor rule (from LangLoop)
No other word in the topic may also truthfully complete a blanked sentence or fit a quiz definition. Enforced two ways:
- Validator: unique glosses; the sentence must contain the blanked word.
- Authoring: each sentence includes a disambiguating detail drawn from the word's meaning, and sibling words are checked by hand in review. Distractors are seeded-shuffled from the same topic.

### Completion
A topic is complete after finishing a full quiz run or a full gap-fill run (flashcards alone do not count). Best score per mode is stored. Reuses the seeded shuffle, the checker, and the feedback panel from the grammar activity where possible (extract a shared question runner only if the reuse is clean; otherwise build vocab-specific components and share the small pieces: `ChoiceQuestion`, `AudioButton`, `ToneChip`, `PitchLine`).

## 4. Grammar question cleanup

- Remove every question that tests only word meaning, vocabulary choice, or letter/sound-to-spelling recall. Known examples:
  - `gs-1`: "The 'sh' sound in ṣọ́ra is written ___", "Which word contains the sound gb?", and the "aw" sound spelling question (review the rest of gs-1 for the same pattern; sound-to-letter questions that test the lesson's own rule, not a lookup, may stay if they require applying the rule).
  - "Which word means teacher / farm / husband" style questions (`word-farm` / `word-husband` ask for a tone-contrast and are kept only if the stem makes the tone rule the point; otherwise replaced).
  - "Which short pronoun means 'we'?" style lookups.
- Questions that translate a whole sentence to test a construction ("Which means 'I usually eat'?") are grammar and stay.
- Each lesson stays at 8 questions with the 3 blank / 2 pick / 3 order shape. Replacements test application of the lesson's rule (choose the correct form, repair a sentence, order words), written to avoid obvious distractors.
- A one-time audit table of all 160 questions (lesson, question, keep / replace / reason) is written to `.superpowers` during planning, and the final removed and replacement questions are summarized for the owner.
- Orphaned `wordId` references are fixed; word cards in primers are unaffected.

## 5. Progress storage

New key `yp:vocab-progress:v1` in the same store module (separate key so grammar progress and its tests are untouched):

```ts
{ topics: { [topicId]: { quiz?: { bestScore: number; completedAt: string }; gap?: { bestScore: number; completedAt: string } } } }
```

Same rules as grammar: try/catch on every read and write, shared in-memory store via `useSyncExternalStore`, works with storage blocked, completion recorded only on a full run.

## 6. Audio

- Reuses the existing pipeline: `audioKey()` normalizer, `src/content/audio-manifest.json`, `public/audio/<sha1[:12]>.mp3`, `AudioButton`.
- `npm run audio:list` is extended to include vocab words and sentences, giving about 500 new items. Words and sentences are separate lists so word audio can ship first.
- The existing ElevenLabs web-tool workflow (`prepare_paste.py` then `split_clips.py`) is reused; more paste parts are needed. The owner generates them by hand; the free plan's character allowance may spread this over several days.
- Until a clip exists, the manifest drift tests allow vocab items to be missing from the manifest, but `AudioButton` renders nothing for a key that is not in the manifest (current behavior). A separate test asserts that every manifest entry has a file, and a reported count (not a failure) lists vocab items still without audio.

## 7. Accuracy and flagged uncertainty

- Everything is `needs-review` with a note; nothing is marked `verified` by the model.
- `content/REVIEW.md` gains a vocab section grouped by topic: word, gloss, sentence, translation, doubt (tone, regional variant, register).
- Regional variants: standard Yoruba is used; `note` mentions common variants.
- Sources preference unchanged: published dictionaries and grammars, listed per file.
- Example sentences are kept short and simple on purpose to reduce error surface. The model drafts them, so they are the highest-risk content and are called out in the review file.

## 8. Testing

- Unit: vocab validator (counts, NFC, em dash, sentence contains word, unique glosses and ids); quiz and gap-fill question builders (4 choices, answer present, seeded determinism, distractors from the same topic, no duplicate choices); vocab progress load/save/record with blocked storage.
- Content test: every vocab string passes NFC; every `needs-review` has a note; REVIEW generation includes all topics.
- Grammar content tests updated for the replaced questions; the full existing suite stays green.
- Component tests: flashcard flip and audio button, quiz feedback kinds, completion only on a full run.
- Playwright: one topic per level, flashcards then quiz then gap-fill, both themes; nav between grammar and vocab.
- Manual: localhost check of all three modes before any deploy, with screenshots shown to the owner for design approval (vocab pages follow the existing theme tokens, so no new design language is expected).

## 9. Build order

1. Grammar cleanup audit and replacements (independent of vocab, delivers the original complaint first).
2. Vocab data model, validator, progress store, question builders, with Getting Started topic 1 as the reference topic.
3. Vocab pages and the three modes; nav and Home links.
4. Author the remaining 24 topics level by level, regenerating `REVIEW.md` after each level.
5. Extend audio listing; owner generates clips in batches.
6. Localhost verification and review.

## 10. Open questions
- Final topic list per level (draft above; owner may reorder or swap topics).
- Whether the tone-contrast questions (`word-husband`, `word-farm`) stay in grammar or move to vocab.
- Who reviews the Yoruba, and the format they prefer (unchanged from the main spec).
