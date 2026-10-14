# Vocab Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a Vocab section (5 levels x 5 topics x 10 words, each with a Yoruba example sentence, flashcards, quiz and gap-fill), and remove vocab and spelling-recall questions from the grammar lessons.

**Architecture:** Vocab content is typed data under `src/content/vocab/`, validated like lessons. Quiz and gap-fill questions are built from a topic into the existing grammar `PickQuestion` / `BlankQuestion` shapes, so the existing `Activity` component runs them unchanged. Vocab progress has its own localStorage key and store. Audio reuses the manifest and `AudioButton`.

**Tech Stack:** Vite, React 19, TypeScript, TanStack Router (code-based), Vitest + Testing Library, Playwright. Same as the grammar app.

**Spec:** `docs/superpowers/specs/2026-10-13-vocab-section-design.md` (also read `docs/superpowers/specs/2026-10-13-yoruba-learning-app-design.md` for the base conventions).

## Global Constraints

- Project root: `~/Desktop/Professional/5_Projects and Gigs/Yoruba Project`. Work on a new branch `vocab-v1` cut from `master`, never on `master`.
- All Yoruba strings are NFC with full tone marks and dots (ẹ, ọ, ṣ). No em dash (U+2014) anywhere in code, content, copy or docs. No eyebrow labels in any UI copy.
- In `.ts`/`.tsx` source, write combining marks as `\u0300`/`\u0301`/`\u0304` escapes in any test that needs decomposed input. The Write tool tends to convert `\u` escapes into literal characters: after writing, verify with `grep -P '\x{2014}'` (must print nothing) and by checking escapes survived.
- Every implementer runs the FULL suite (`npx vitest run`), `npx tsc --noEmit` and `npm run validate` before committing. A task is not done until all three are green.
- All new vocab content is `confidence: "needs-review"` with a `note`. Nothing is marked `verified`. Each content file carries a `sources` list naming only what was actually consulted.
- `tools/audio/.env` is the owner's API key: never read, print, or commit it.
- Do not deploy, push, or touch a remote. Do not modify `tools/audio/legacy-mms/`.
- Commit messages end with the line `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- Constants: `WORDS_PER_TOPIC = 10`, `TOPICS_PER_LEVEL = 5`, grammar `QUESTIONS_PER_LESSON = 8` (3 blank, 2 pick, 3 order per lesson) unchanged.

## Review Focus

Failure modes the spec implies that most need explicit tests, most likely first:

1. **Sentence-initial capital letters:** a word that starts a sentence appears capitalized ("Bàbá mi ni." vs word "bàbá"). Blank location must be case-insensitive and still blank exactly one occurrence. (Task 2, Task 3)
2. **Distractors that also fit:** a sibling word that also truthfully completes a blanked sentence or fits a gloss. Validator enforces unique glosses and unique Yoruba within a topic; authors hand-check siblings. (Task 2, authoring tasks)
3. **Corrupt or blocked vocab progress:** unparsable JSON, wrong shape, or storage that throws must fall back to empty progress and never crash or touch grammar progress. (Task 4)
4. **Multi-word and apostrophe entries** (greetings, idioms such as "Ẹ káàárọ̀", "l'a"): pitch line, audio key and gap-fill must not break on spaces. (Task 3, Task 5, Task 6)
5. **Unknown level or topic ids in the URL:** show the existing NotFound, not a blank page or exception. (Task 5)

---

### Task 1: Remove vocab and spelling-recall questions from grammar lessons

**Files:**
- Modify: `src/content/lessons/*.ts` (only the `questions` arrays, and `wordId` values if a removed question was the only reference)
- Create: `src/content/question-quality.test.ts`
- Modify: `src/lib/audio.test.ts` (orphan manifest check and a `PENDING_AUDIO` allowlist), `src/content/audio-manifest.json` and `public/audio/*.mp3` (remove orphans only)
- Modify: `content/REVIEW.md` (regenerate with `npm run review`)

**Interfaces:**
- Consumes: `Lesson`, `Question` from `src/content/types.ts`; `collectAudioStrings` from `src/lib/audio-strings.ts`.
- Produces: no new exports. Every lesson still has exactly 8 questions (3 blank, 2 pick, 3 order).

**Criteria (apply to all 20 lessons, about 100 blank/pick questions; order questions are sentence building and stay unless broken):**

Remove or rewrite a question when it is any of these:
- A word-meaning lookup: "Which word means teacher / farm / husband?", "Which short pronoun means 'we'?"
- A sound-to-letter lookup where the prompt gives the answer away: 'The "sh" sound in ṣọ́ra is written ___.', "Which word contains the sound gb?", 'Which spelling shows the open o, the "aw" sound in "law"?'
- Any question where the correct choice is the only option that looks like Yoruba, or the other choices are obviously silly.

Keep a question when it tests applying the lesson's rule: choosing the correctly toned or correctly formed word in a sentence, translating a whole sentence that needs the construction, explaining why a particle is there, or tone contrast where the stem makes the tone the point (for example `word-husband` / `word-farm` style questions are kept only if the stem asks which tone or mark is needed, not which word means what; otherwise rewrite so the tone rule is the point).

Replacements must test the lesson's `primer.rule`, keep the lesson's blank/pick/order counts, have plausible distractors (same letters different tone, same words different order or particle), and use `wordId` values that exist in that lesson's `primer.examples`.

For getting-started lessons about sounds and spelling (gs-1, gs-2), the lesson topic is orthography, so a spelling question can stay only when it requires applying the rule to something not stated in the prompt (for example "Which spelling shows the sound in the word you hear described by the rule: ..." is NOT acceptable; "Which of these is a correctly marked word: a dot under a vowel and a high tone on the last syllable?" with a worked, non-obvious answer is acceptable). If you cannot write a non-obvious replacement for a rule-test in gs-1 or gs-2, rewrite it as a "spot the error" pick (three spellings, one with the mistake the lesson's `commonMistake` warns about).

Audio constraint: the correct choice of every pick question and the answer sentence of every order question is a spoken audio string (see `collectAudioStrings`). Prefer replacement answers whose normalized key already exists in `src/content/audio-manifest.json`. Where a new string is unavoidable, add its `audioKey` to `PENDING_AUDIO` in `src/lib/audio.test.ts` (see Step 5) and list it in your report; the owner generates those clips later.

- [ ] **Step 1: Write the guard test (fails on the known offenders)**

Create `src/content/question-quality.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { LEVELS } from "./levels";

// Patterns for questions that test vocabulary or letter lookup instead of a lesson's rule.
const BANNED: { name: string; re: RegExp }[] = [
  { name: "word-meaning lookup", re: /^which (short )?(word|pronoun|noun|verb)\b.* means\b/i },
  { name: "sound-to-letter lookup", re: /sound in .* is written/i },
  { name: "word-contains-sound lookup", re: /^which word contains the sound\b/i },
  { name: "spelling shows the sound", re: /^which spelling shows\b/i },
];

describe("grammar questions test rules, not vocabulary", () => {
  for (const level of LEVELS) {
    for (const lesson of level.lessons) {
      lesson.questions.forEach((q, n) => {
        if (q.type === "order") return;
        it(`${lesson.id} question ${n + 1} is not a vocab or lookup question`, () => {
          for (const b of BANNED) expect(q.prompt, b.name).not.toMatch(b.re);
        });
      });
    }
  }
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `npx vitest run src/content/question-quality.test.ts`
Expected: FAIL for at least gs-1 (sound in ṣọ́ra, gb, aw) and the "Which word means ..." questions.

- [ ] **Step 3: Audit all lessons**

Read every `questions` array. Write an audit table to `.superpowers/sdd/2026-10-13-vocab-section/task-1-audit.md` (git-ignored): lesson, question number, prompt, KEEP/REWRITE, one-line reason. Then edit the lessons per the criteria. Keep the guard test in sync: if a kept question legitimately matches a pattern, tighten the pattern rather than weakening the test.

- [ ] **Step 4: Fix audio drift**

Run `npm run audio:list`. In `src/lib/audio.test.ts`:
1. Replace the last test `has no manifest entries without a lesson string` body so it still fails on orphans (it already does); then delete the orphan manifest entries and their mp3 files from `public/audio/` that the removed questions left behind (list them in the report).
2. Add, above the `it.each`, a documented allowlist and use it:

```ts
// Strings added since the last clip batch. Each key here still needs a clip
// (see tools/audio/README.md). Shrink this list as clips are generated.
const PENDING_AUDIO = new Set<string>([]);
```

and change the `it.each` to `strings.filter((s) => !PENDING_AUDIO.has(s.key))`. Add the keys of any unavoidable new strings (via `audioKey`) to `PENDING_AUDIO`.

- [ ] **Step 5: Run the checks**

Run: `npx vitest run && npx tsc --noEmit && npm run validate`
Expected: all green. Then `npm run review` and confirm `git diff --stat content/REVIEW.md` shows the regenerated file.

- [ ] **Step 6: Run e2e and fix references**

Run: `npx playwright test`. If any e2e step references a removed question (grep `e2e/` for the old prompts), update the e2e to the replacement question.

- [ ] **Step 7: Commit**

```bash
git add -A src content public e2e
git commit -m "content: replace vocab and spelling-recall grammar questions with rule-based ones

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

Report: the count of removed/rewritten questions per lesson, any orphan clips deleted, and any `PENDING_AUDIO` keys added.

---

### Task 2: Vocab data model, validator, and empty content skeleton

**Files:**
- Create: `src/content/vocab/types.ts`, `src/content/vocab/validate.ts`, `src/content/vocab/index.ts`
- Create: `src/content/vocab/getting-started.ts`, `beginner.ts`, `intermediate.ts`, `advanced.ts`, `mastery.ts` (each exports an empty topics array for now)
- Modify: `src/content/validate.ts` (export the `strings` generator)
- Create: `src/content/vocab/validate.test.ts`
- Modify: `scripts/validate-content.ts` (also validate vocab)

**Interfaces:**
- Consumes: `LevelId`, `Confidence` from `src/content/types.ts`; `LEVELS` titles from `src/content/levels.ts`; `strings` generator from `src/content/validate.ts`.
- Produces:
  - `type VocabPos = "noun" | "verb" | "adjective" | "adverb" | "phrase" | "number" | "other"`
  - `type VocabSentence = { yoruba: string; english: string; blank?: string }`
  - `type VocabWord = { id: string; yoruba: string; english: string; pos: VocabPos; sentence: VocabSentence; confidence: Confidence; note?: string }`
  - `type VocabTopic = { id: string; level: LevelId; title: string; blurb: string; sources: string[]; words: VocabWord[] }`
  - `type VocabLevel = { id: LevelId; title: string; topics: VocabTopic[] }`
  - `const WORDS_PER_TOPIC = 10`, `const TOPICS_PER_LEVEL = 5`
  - `blankOf(w: VocabWord): string` returns `w.sentence.blank ?? w.yoruba`
  - `locateBlank(sentence: string, blank: string): { start: number; end: number; count: number }` (case-insensitive; `start`/`end` index the first occurrence in the original string; `count` is the number of occurrences; `start = -1` when absent)
  - `validateTopic(t: VocabTopic): string[]`
  - `validateVocabCatalog(levels: VocabLevel[], opts?: { complete?: boolean }): string[]` (global id uniqueness and `topic.level` matches its level always; the 5-topics-per-level count only when `opts.complete` is true)
  - `VOCAB_LEVELS: VocabLevel[]`, `getVocabLevel(id): VocabLevel | undefined`, `getVocabTopic(levelId, topicId): VocabTopic | undefined`, `nextVocabTopicPath(levelId, topicId): { levelId: string; topicId: string } | null`, `allVocabWords(): VocabWord[]`

- [ ] **Step 1: Export the strings walker**

In `src/content/validate.ts` change `function* strings(` to `export function* strings(` (no other change).

- [ ] **Step 2: Write the types**

`src/content/vocab/types.ts`:

```ts
import type { Confidence, LevelId } from "../types";

export type VocabPos = "noun" | "verb" | "adjective" | "adverb" | "phrase" | "number" | "other";
export const VOCAB_POS: readonly VocabPos[] = ["noun", "verb", "adjective", "adverb", "phrase", "number", "other"];

// `blank` names the exact substring of `yoruba` to blank in gap-fill when the
// word changes form inside the sentence. Defaults to the word itself.
export type VocabSentence = { yoruba: string; english: string; blank?: string };

export type VocabWord = {
  id: string;
  yoruba: string;
  english: string;
  pos: VocabPos;
  sentence: VocabSentence;
  confidence: Confidence;
  note?: string;
};

export type VocabTopic = {
  id: string;
  level: LevelId;
  title: string;
  blurb: string;
  sources: string[];
  words: VocabWord[];
};

export type VocabLevel = { id: LevelId; title: string; topics: VocabTopic[] };
```

- [ ] **Step 3: Write the failing validator tests**

`src/content/vocab/validate.test.ts` (use this fixture helper; keep Yoruba literal characters, they are NFC):

```ts
import { describe, expect, it } from "vitest";
import { blankOf, locateBlank, validateTopic, validateVocabCatalog, WORDS_PER_TOPIC } from "./validate";
import type { VocabTopic, VocabWord } from "./types";

function word(i: number, over: Partial<VocabWord> = {}): VocabWord {
  return {
    id: `t-w${i}`,
    yoruba: `ọ\u0300rọ\u0300${i}`.replace(/\d/g, (d) => "ábcdefghij"[Number(d)]!),
    english: `meaning ${i}`,
    pos: "noun",
    sentence: { yoruba: "Èyí ni ọ\u0300rọ\u0300", english: "This is a word" },
    confidence: "needs-review",
    note: "test",
    ...over,
  };
}

function topic(over: Partial<VocabTopic> = {}): VocabTopic {
  const words = Array.from({ length: WORDS_PER_TOPIC }, (_, i) => {
    const w = word(i);
    return { ...w, sentence: { yoruba: `Mo rí ${w.yoruba} níbí`, english: `I see it ${i}` } };
  });
  return { id: "t", level: "getting-started", title: "T", blurb: "b", sources: ["test"], words, ...over };
}

describe("locateBlank", () => {
  it("is case-insensitive and reports the original span", () => {
    expect(locateBlank("Bàbá mi ni", "bàbá")).toEqual({ start: 0, end: 4, count: 1 });
  });
  it("returns start -1 when absent and counts repeats", () => {
    expect(locateBlank("mo lọ", "bàbá").start).toBe(-1);
    expect(locateBlank("ọmọ ọmọ", "ọmọ").count).toBe(2);
  });
});

describe("blankOf", () => {
  it("uses sentence.blank when given", () => {
    const w = word(0, { sentence: { yoruba: "x", english: "y", blank: "z" } });
    expect(blankOf(w)).toBe("z");
    expect(blankOf(word(1))).toBe(word(1).yoruba);
  });
});

describe("validateTopic", () => {
  it("accepts a well-formed topic", () => {
    expect(validateTopic(topic())).toEqual([]);
  });
  it("requires exactly 10 words", () => {
    expect(validateTopic(topic({ words: topic().words.slice(0, 9) })).join("\n")).toMatch(/expected 10 words/);
  });
  it("rejects a non-NFC string and an em dash", () => {
    const t = topic();
    t.words[0] = { ...t.words[0]!, english: "e\u0301 a" };
    t.words[1] = { ...t.words[1]!, english: "a \u2014 b" };
    const msg = validateTopic(t).join("\n");
    expect(msg).toMatch(/not NFC/);
    expect(msg).toMatch(/em dash/);
  });
  it("requires a note on needs-review words", () => {
    const t = topic();
    t.words[0] = { ...t.words[0]!, note: undefined };
    expect(validateTopic(t).join("\n")).toMatch(/needs-review.*note/);
  });
  it("requires the blank to appear exactly once in the sentence", () => {
    const t = topic();
    t.words[0] = { ...t.words[0]!, sentence: { yoruba: "Mo lọ", english: "I go" } };
    t.words[1] = { ...t.words[1]!, sentence: { yoruba: `${t.words[1]!.yoruba} ${t.words[1]!.yoruba}`, english: "twice" } };
    const msg = validateTopic(t).join("\n");
    expect(msg).toMatch(/t-w0.*does not appear/);
    expect(msg).toMatch(/t-w1.*more than once/);
  });
  it("accepts a sentence-initial capital", () => {
    const t = topic();
    const y = t.words[0]!.yoruba;
    t.words[0] = { ...t.words[0]!, sentence: { yoruba: y[0]!.toUpperCase() + y.slice(1) + " ni", english: "e" } };
    expect(validateTopic(t)).toEqual([]);
  });
  it("rejects duplicate glosses and duplicate Yoruba within a topic", () => {
    const t = topic();
    t.words[1] = { ...t.words[1]!, english: t.words[0]!.english };
    t.words[2] = { ...t.words[2]!, yoruba: t.words[3]!.yoruba, sentence: { yoruba: `Mo rí ${t.words[3]!.yoruba}`, english: "q" } };
    const msg = validateTopic(t).join("\n");
    expect(msg).toMatch(/duplicate gloss/);
    expect(msg).toMatch(/duplicate Yoruba/);
  });
  it("requires non-empty sources, a valid pos, and a sentence translation", () => {
    const t = topic({ sources: [] });
    t.words[0] = { ...t.words[0]!, pos: "bogus" as never, sentence: { ...t.words[0]!.sentence, english: "" } };
    const msg = validateTopic(t).join("\n");
    expect(msg).toMatch(/sources is empty/);
    expect(msg).toMatch(/invalid pos/);
    expect(msg).toMatch(/sentence translation/);
  });
});

describe("validateVocabCatalog", () => {
  it("rejects duplicate word ids across topics and a topic filed under the wrong level", () => {
    const a = topic({ id: "a" });
    const b = topic({ id: "b", level: "beginner" });
    const msg = validateVocabCatalog([{ id: "getting-started", title: "GS", topics: [a, b] }]).join("\n");
    expect(msg).toMatch(/duplicate word id/);
    expect(msg).toMatch(/filed under/);
  });
  it("checks the 5-topics-per-level count only when complete", () => {
    const lv = [{ id: "getting-started" as const, title: "GS", topics: [topic()] }];
    expect(validateVocabCatalog(lv)).toEqual([]);
    expect(validateVocabCatalog(lv, { complete: true }).join("\n")).toMatch(/expected 5 topics/);
  });
});
```

- [ ] **Step 4: Run to confirm failure**

Run: `npx vitest run src/content/vocab/validate.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 5: Implement the validator**

`src/content/vocab/validate.ts`:

```ts
import { strings } from "../validate";
import { VOCAB_POS, type VocabLevel, type VocabTopic, type VocabWord } from "./types";

export const WORDS_PER_TOPIC = 10;
export const TOPICS_PER_LEVEL = 5;
const EM_DASH = "\u2014";

export const blankOf = (w: VocabWord): string => w.sentence.blank ?? w.yoruba;

export function locateBlank(sentence: string, blank: string): { start: number; end: number; count: number } {
  const hay = sentence.toLowerCase();
  const needle = blank.toLowerCase();
  const start = needle ? hay.indexOf(needle) : -1;
  let count = 0;
  if (needle) for (let at = hay.indexOf(needle); at !== -1; at = hay.indexOf(needle, at + needle.length)) count++;
  return { start, end: start === -1 ? -1 : start + needle.length, count };
}

export function validateTopic(t: VocabTopic): string[] {
  const errors: string[] = [];
  const err = (m: string) => errors.push(`${t.id}: ${m}`);

  for (const s of strings(t)) {
    if (s !== s.normalize("NFC")) err(`string is not NFC: "${s}"`);
    if (s.includes(EM_DASH)) err(`string contains an em dash: "${s}"`);
  }
  if (t.sources.length === 0) err("sources is empty");
  if (t.words.length !== WORDS_PER_TOPIC) err(`expected ${WORDS_PER_TOPIC} words, found ${t.words.length}`);

  const glosses = new Set<string>();
  const yoruba = new Set<string>();
  for (const w of t.words) {
    const e = (m: string) => err(`word "${w.id}": ${m}`);
    if (!VOCAB_POS.includes(w.pos)) e(`invalid pos "${w.pos}"`);
    if (!w.sentence.english.trim()) e("needs a sentence translation");
    if (w.confidence === "needs-review" && !w.note) e("needs-review words need a note naming the doubt");
    const loc = locateBlank(w.sentence.yoruba, blankOf(w));
    if (loc.start === -1) e(`"${blankOf(w)}" does not appear in its sentence "${w.sentence.yoruba}"`);
    else if (loc.count > 1) e(`"${blankOf(w)}" appears more than once in its sentence`);
    if (glosses.has(w.english.toLowerCase())) e(`duplicate gloss "${w.english}" in this topic`);
    glosses.add(w.english.toLowerCase());
    if (yoruba.has(w.yoruba.toLowerCase())) e(`duplicate Yoruba "${w.yoruba}" in this topic`);
    yoruba.add(w.yoruba.toLowerCase());
  }
  return errors;
}

export function validateVocabCatalog(levels: VocabLevel[], opts: { complete?: boolean } = {}): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const topicIds = new Set<string>();
  for (const level of levels) {
    if (opts.complete && level.topics.length !== TOPICS_PER_LEVEL) {
      errors.push(`${level.id}: expected ${TOPICS_PER_LEVEL} topics, found ${level.topics.length}`);
    }
    for (const t of level.topics) {
      if (t.level !== level.id) errors.push(`${t.id}: filed under ${level.id} but declares level ${t.level}`);
      if (topicIds.has(t.id)) errors.push(`${t.id}: duplicate topic id`);
      topicIds.add(t.id);
      for (const w of t.words) {
        if (ids.has(w.id)) errors.push(`${t.id}: duplicate word id "${w.id}"`);
        ids.add(w.id);
      }
    }
  }
  return errors;
}
```

- [ ] **Step 6: Skeleton content and index**

Each level file, for example `src/content/vocab/getting-started.ts`:

```ts
import type { VocabTopic } from "./types";

export const gettingStartedTopics: VocabTopic[] = [];
```

(`beginnerTopics`, `intermediateTopics`, `advancedTopics`, `masteryTopics` in the other four files.)

`src/content/vocab/index.ts`:

```ts
import { LEVELS } from "../levels";
import type { LevelId } from "../types";
import { advancedTopics } from "./advanced";
import { beginnerTopics } from "./beginner";
import { gettingStartedTopics } from "./getting-started";
import { intermediateTopics } from "./intermediate";
import { masteryTopics } from "./mastery";
import type { VocabLevel, VocabTopic, VocabWord } from "./types";

const TOPICS: Record<LevelId, VocabTopic[]> = {
  "getting-started": gettingStartedTopics,
  beginner: beginnerTopics,
  intermediate: intermediateTopics,
  advanced: advancedTopics,
  mastery: masteryTopics,
};

export const VOCAB_LEVELS: VocabLevel[] = LEVELS.map((lv) => ({ id: lv.id, title: lv.title, topics: TOPICS[lv.id] }));

export const getVocabLevel = (id: string): VocabLevel | undefined => VOCAB_LEVELS.find((l) => l.id === id);

export const getVocabTopic = (levelId: string, topicId: string): VocabTopic | undefined =>
  getVocabLevel(levelId)?.topics.find((t) => t.id === topicId);

export const allVocabWords = (): VocabWord[] => VOCAB_LEVELS.flatMap((l) => l.topics.flatMap((t) => t.words));

export function nextVocabTopicPath(levelId: string, topicId: string): { levelId: string; topicId: string } | null {
  const flat = VOCAB_LEVELS.flatMap((lv) => lv.topics.map((t) => ({ levelId: lv.id as string, topicId: t.id })));
  const i = flat.findIndex((x) => x.levelId === levelId && x.topicId === topicId);
  return i >= 0 && i + 1 < flat.length ? flat[i + 1]! : null;
}
```

- [ ] **Step 7: Wire the validate script**

In `scripts/validate-content.ts` import `VOCAB_LEVELS` from `../src/content/vocab` and `validateTopic`, `validateVocabCatalog` from `../src/content/vocab/validate`. After the lesson loop, run `validateTopic` on every topic and `validateVocabCatalog(VOCAB_LEVELS)` (not complete yet), counting failures into the same `failed` counter, and print `OK: N lesson(s) and M vocab topic(s) valid.`.

- [ ] **Step 8: Add a content test**

Create `src/content/vocab/content.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { VOCAB_LEVELS, getVocabLevel, getVocabTopic, nextVocabTopicPath } from "./index";
import { validateTopic, validateVocabCatalog } from "./validate";

describe("vocab content", () => {
  it("mirrors the five grammar levels in order", () => {
    expect(VOCAB_LEVELS.map((l) => l.id)).toEqual(["getting-started", "beginner", "intermediate", "advanced", "mastery"]);
  });
  it("has a valid catalog", () => {
    expect(validateVocabCatalog(VOCAB_LEVELS)).toEqual([]);
  });
  for (const level of VOCAB_LEVELS) {
    for (const topic of level.topics) {
      it(`${topic.id} passes validation`, () => {
        expect(validateTopic(topic)).toEqual([]);
      });
    }
  }
  it("returns undefined for unknown ids", () => {
    expect(getVocabLevel("nope")).toBeUndefined();
    expect(getVocabTopic("beginner", "nope")).toBeUndefined();
    expect(nextVocabTopicPath("beginner", "nope")).toBeNull();
  });
});
```

- [ ] **Step 9: Run the checks and commit**

Run: `npx vitest run && npx tsc --noEmit && npm run validate`. Expected: all green.

```bash
git add -A src scripts
git commit -m "feat: vocab data model, validator, and empty content skeleton

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Quiz and gap-fill question builders

**Files:**
- Create: `src/lib/vocab-questions.ts`, `src/lib/vocab-questions.test.ts`

**Interfaces:**
- Consumes: `VocabTopic`, `VocabWord` and `blankOf`, `locateBlank` from `src/content/vocab/*`; `PickQuestion`, `BlankQuestion` from `src/content/types.ts`; `seededShuffle` from `src/lib/shuffle.ts`; `stripTones` from `src/lib/normalize.ts`.
- Produces:
  - `buildQuiz(topic: VocabTopic, seed?: string): PickQuestion[]` (one question per word; even positions Yoruba to English, odd positions English to Yoruba; 4 distinct choices; deterministic for a given seed; `seed` defaults to `topic.id`)
  - `buildGap(topic: VocabTopic, seed?: string): BlankQuestion[]` (one per word; prompt is the sentence with the blank replaced by `___` followed by ` (` + English translation + `)`; 4 distinct choices; answer is `blankOf(word)`)
  - `distractors(answer: string, pool: string[], seed: string, n?: number): string[]`

Distractor rule: distractors come only from the same topic, are never equal to the answer (case-insensitive), are distinct from each other, and prefer entries whose `stripTones` equals the answer's `stripTones` (tone-only confusables) before others.

- [ ] **Step 1: Write the failing tests**

`src/lib/vocab-questions.test.ts`. Reuse a local fixture builder like the one in Task 2 (ten distinct words with sentences "Mo rí <word> níbí"); also include a sentence-initial-capital word and a multi-word entry:

```ts
import { describe, expect, it } from "vitest";
import type { VocabTopic, VocabWord } from "@/content/vocab/types";
import { buildGap, buildQuiz, distractors } from "./vocab-questions";

const YORUBA = ["ọkọ", "ọkọ\u0300", "oko", "ilé", "ẹja", "bàbá", "ìyá", "ẹ káàárọ\u0300", "omi", "ewé"];

function fixture(): VocabTopic {
  const words: VocabWord[] = YORUBA.map((y, i) => ({
    id: `f-${i}`,
    yoruba: y,
    english: `gloss ${i}`,
    pos: "noun",
    sentence: i === 3
      ? { yoruba: "Ilé mi tóbi", english: "My house is big", blank: "ilé" }
      : { yoruba: `Mo rí ${y} níbí`, english: `I see ${i}` },
    confidence: "needs-review",
    note: "t",
  }));
  return { id: "f", level: "getting-started", title: "F", blurb: "b", sources: ["t"], words };
}

describe("distractors", () => {
  it("excludes the answer, is distinct, and has the requested count", () => {
    const d = distractors("ọkọ", YORUBA, "s", 3);
    expect(d).toHaveLength(3);
    expect(new Set(d).size).toBe(3);
    expect(d).not.toContain("ọkọ");
  });
  it("prefers tone-only confusables first", () => {
    const d = distractors("ọkọ", YORUBA, "s", 3);
    expect(d).toContain("ọkọ\u0300");
  });
  it("is deterministic for a seed", () => {
    expect(distractors("ilé", YORUBA, "x", 3)).toEqual(distractors("ilé", YORUBA, "x", 3));
  });
});

describe("buildQuiz", () => {
  const t = fixture();
  const qs = buildQuiz(t);
  it("asks one question per word with 4 distinct choices and a valid answer index", () => {
    expect(qs).toHaveLength(10);
    for (const q of qs) {
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices).size).toBe(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(4);
    }
  });
  it("mixes both directions and only uses topic content as choices", () => {
    const golds = qs.map((q) => q.choices[q.answer]!);
    const english = new Set(t.words.map((w) => w.english));
    const yoruba = new Set(t.words.map((w) => w.yoruba));
    expect(golds.some((g) => english.has(g))).toBe(true);
    expect(golds.some((g) => yoruba.has(g))).toBe(true);
    for (const q of qs) for (const c of q.choices) expect(english.has(c) || yoruba.has(c)).toBe(true);
  });
  it("covers every word exactly once", () => {
    const covered = new Set(qs.map((q) => q.wordId));
    expect(covered.size).toBe(10);
  });
  it("is deterministic per seed and differs across seeds", () => {
    expect(buildQuiz(t, "a")).toEqual(buildQuiz(t, "a"));
    expect(buildQuiz(t, "a")).not.toEqual(buildQuiz(t, "b"));
  });
});

describe("buildGap", () => {
  const t = fixture();
  const qs = buildGap(t);
  it("blanks the word, adds the translation, and offers 4 distinct choices including the answer", () => {
    expect(qs).toHaveLength(10);
    for (const q of qs) {
      expect(q.prompt).toContain("___");
      expect(q.prompt).toMatch(/\(.+\)$/);
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices).size).toBe(4);
      expect(q.choices).toContain(q.answer);
    }
  });
  it("blanks a sentence-initial capitalized word and handles multi-word entries", () => {
    const house = qs.find((q) => q.answer === "ilé")!;
    expect(house.prompt.startsWith("___ mi tóbi")).toBe(true);
    const greet = qs.find((q) => q.answer === "ẹ káàárọ\u0300")!;
    expect(greet.prompt).toContain("Mo rí ___ níbí");
  });
  it("never leaves the answer word visible in the prompt", () => {
    for (const q of qs) expect(q.prompt.toLowerCase().split("(")[0]).not.toContain(q.answer.toLowerCase());
  });
});
```

(The fixture's `ọkọ`, `ọkọ̀`, `oko` all appear in different sentences, so the "answer not visible" check holds; if a fixture sentence contains another word as substring, adjust the fixture, not the assertion.)

- [ ] **Step 2: Run to confirm failure**

Run: `npx vitest run src/lib/vocab-questions.test.ts` -> FAIL (module not found).

- [ ] **Step 3: Implement**

`src/lib/vocab-questions.ts`:

```ts
import type { BlankQuestion, PickQuestion } from "@/content/types";
import type { VocabTopic } from "@/content/vocab/types";
import { blankOf, locateBlank } from "@/content/vocab/validate";
import { stripTones } from "./normalize";
import { seededShuffle } from "./shuffle";

export function distractors(answer: string, pool: string[], seed: string, n = 3): string[] {
  const a = answer.toLowerCase();
  const uniq = [...new Set(pool.filter((p) => p.toLowerCase() !== a))];
  const shuffled = seededShuffle(uniq, `${seed}|d`);
  const similar = shuffled.filter((p) => stripTones(p) === stripTones(answer));
  const rest = shuffled.filter((p) => stripTones(p) !== stripTones(answer));
  return [...similar, ...rest].slice(0, n);
}

function choicesFor(answer: string, pool: string[], seed: string): string[] {
  return seededShuffle([answer, ...distractors(answer, pool, seed)], `${seed}|c`);
}

export function buildQuiz(topic: VocabTopic, seed: string = topic.id): PickQuestion[] {
  const order = seededShuffle(topic.words, `${seed}|quiz`);
  const english = topic.words.map((w) => w.english);
  const yoruba = topic.words.map((w) => w.yoruba);
  return order.map((w, i) => {
    const toEnglish = i % 2 === 0;
    const answer = toEnglish ? w.english : w.yoruba;
    const choices = choicesFor(answer, toEnglish ? english : yoruba, `${seed}|${w.id}`);
    return {
      type: "pick" as const,
      prompt: toEnglish ? `What does ${w.yoruba} mean?` : `Which word means "${w.english}"?`,
      choices,
      answer: choices.indexOf(answer),
      wordId: w.id,
    };
  });
}

export function buildGap(topic: VocabTopic, seed: string = topic.id): BlankQuestion[] {
  const order = seededShuffle(topic.words, `${seed}|gap`);
  const pool = topic.words.map((w) => blankOf(w));
  return order.map((w) => {
    const answer = blankOf(w);
    const { start, end } = locateBlank(w.sentence.yoruba, answer);
    const s = w.sentence.yoruba;
    const prompt = `${s.slice(0, start)}___${s.slice(end)} (${w.sentence.english})`;
    return { type: "blank" as const, prompt, answer, choices: choicesFor(answer, pool, `${seed}|${w.id}`), wordId: w.id };
  });
}
```

If `start === -1` (validator should prevent this) the builder must not silently produce a broken prompt: throw `new Error(\`${w.id}: blank not found\`)`.

- [ ] **Step 4: Run, typecheck, and full suite**

`npx vitest run && npx tsc --noEmit && npm run validate` -> green.

- [ ] **Step 5: Commit**

```bash
git add src/lib/vocab-questions.ts src/lib/vocab-questions.test.ts
git commit -m "feat: vocab quiz and gap-fill question builders

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Vocab progress storage and hook

**Files:**
- Create: `src/lib/vocab-progress.ts`, `src/lib/vocab-progress.test.ts`, `src/hooks/useVocabProgress.ts`

**Interfaces:**
- Consumes: pattern of `src/lib/progress.ts` and `src/hooks/useProgress.ts` (read both first).
- Produces:
  - `type VocabMode = "quiz" | "gap"`
  - `type VocabProgress = { topics: Record<string, Partial<Record<VocabMode, { bestScore: number; completedAt: string }>>> }`
  - `emptyVocabProgress`, `loadVocabProgress(storage?)`, `saveVocabProgress(p, storage?)`, `recordVocabCompletion(p, topicId, mode, score, now?)`, `isTopicComplete(p, topicId): boolean` (true if either mode recorded), `topicsDone(p, topicIds: string[]): number`
  - storage key `yp:vocab-progress:v1`
  - `useVocabProgress(): { progress: VocabProgress; update: (fn) => void; loaded: boolean }`, plus `__resetVocabProgressStoreForTests()`

- [ ] **Step 1: Write failing tests**

`src/lib/vocab-progress.test.ts` must cover, using a fake Storage object (`Map`-backed, plus one whose `getItem`/`setItem` throw):
- empty storage returns `emptyVocabProgress`
- round-trips a recorded completion through save then load
- corrupt JSON, JSON `null`, a string, `{}`, and `{"topics": 5}` all return `emptyVocabProgress` without throwing
- throwing `getItem` returns empty; throwing `setItem` does not throw
- `recordVocabCompletion` keeps the best score and the first `completedAt` per mode, and does not touch the other mode
- `isTopicComplete` / `topicsDone` semantics
- grammar key untouched: saving vocab progress does not write `yp:progress:v1`

- [ ] **Step 2: Run to confirm failure**, then implement

```ts
export type VocabMode = "quiz" | "gap";
type Entry = { bestScore: number; completedAt: string };
export type VocabProgress = { topics: Record<string, Partial<Record<VocabMode, Entry>>> };

export const emptyVocabProgress: VocabProgress = { topics: {} };
const KEY = "yp:vocab-progress:v1";

function defaultStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function validEntry(e: unknown): e is Entry {
  return !!e && typeof e === "object" && typeof (e as Entry).bestScore === "number" && typeof (e as Entry).completedAt === "string";
}

export function loadVocabProgress(storage: Storage | null = defaultStorage()): VocabProgress {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return emptyVocabProgress;
    const v = JSON.parse(raw) as { topics?: unknown };
    if (!v || typeof v !== "object" || !v.topics || typeof v.topics !== "object" || Array.isArray(v.topics)) {
      return emptyVocabProgress;
    }
    const topics: VocabProgress["topics"] = {};
    for (const [id, modes] of Object.entries(v.topics as Record<string, unknown>)) {
      if (!modes || typeof modes !== "object") continue;
      const m = modes as Record<string, unknown>;
      const kept: Partial<Record<VocabMode, Entry>> = {};
      if (validEntry(m.quiz)) kept.quiz = m.quiz;
      if (validEntry(m.gap)) kept.gap = m.gap;
      if (kept.quiz || kept.gap) topics[id] = kept;
    }
    return { topics };
  } catch {
    return emptyVocabProgress;
  }
}

export function saveVocabProgress(p: VocabProgress, storage: Storage | null = defaultStorage()): void {
  try {
    storage?.setItem(KEY, JSON.stringify(p));
  } catch {
    // Storage can be blocked. Progress simply will not persist.
  }
}

export function recordVocabCompletion(
  p: VocabProgress, topicId: string, mode: VocabMode, score: number, now: Date = new Date(),
): VocabProgress {
  const prev = p.topics[topicId]?.[mode];
  const entry: Entry = {
    bestScore: prev ? Math.max(prev.bestScore, score) : score,
    completedAt: prev?.completedAt ?? now.toISOString(),
  };
  return { topics: { ...p.topics, [topicId]: { ...p.topics[topicId], [mode]: entry } } };
}

export const isTopicComplete = (p: VocabProgress, topicId: string): boolean => {
  const t = p.topics[topicId];
  return !!(t?.quiz || t?.gap);
};

export const topicsDone = (p: VocabProgress, topicIds: string[]): number =>
  topicIds.filter((id) => isTopicComplete(p, id)).length;
```

`src/hooks/useVocabProgress.ts`: copy the structure of `useProgress.ts` (shared `snapshot`, `listeners`, `ensureLoaded`, `updateProgress`, `subscribe`, `getSnapshot`, `getServerSnapshot`, `useSyncExternalStore`, load in `useEffect`) but over `VocabProgress`, with no theme handling, and export `__resetVocabProgressStoreForTests`.

- [ ] **Step 3: Add a hook test** `src/hooks/useVocabProgress.test.tsx` that renders a tiny component, calls `update(p => recordVocabCompletion(...))`, and asserts the shared store updates two components at once and survives `localStorage.setItem` throwing (use `vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); })`).

- [ ] **Step 4: Run the checks and commit**

`npx vitest run && npx tsc --noEmit && npm run validate` -> green.

```bash
git add src/lib/vocab-progress* src/hooks/useVocabProgress*
git commit -m "feat: vocab progress store with its own storage key

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Vocab pages, flashcards, routes, and navigation

**Files:**
- Create: `src/components/Flashcards.tsx`, `src/components/Flashcards.test.tsx`
- Create: `src/components/VocabResults.tsx`
- Create: `src/pages/VocabHome.tsx`, `src/pages/VocabLevelPage.tsx`, `src/pages/VocabTopicPage.tsx`, `src/pages/vocab-pages.test.tsx`
- Modify: `src/router.tsx`, `src/components/Layout.tsx`, `src/pages/Home.tsx`
- Modify: `src/components/ProgressRing.tsx` (add optional `unit` prop, default `"lessons"`, so the aria-label can read "topics")

**Interfaces:**
- Consumes: `VOCAB_LEVELS`, `getVocabLevel`, `getVocabTopic`, `nextVocabTopicPath` (Task 2); `buildQuiz`, `buildGap` (Task 3); `useVocabProgress`, `recordVocabCompletion`, `isTopicComplete`, `topicsDone` (Task 4); existing `Activity` (`{ questions: Question[]; onDone: (r: ActivityResult) => void }`), `AudioButton`, `PitchLine` (`word` prop), `ProgressRing`, `NotFound`.
- Produces: routes `/vocab`, `/vocab/$levelId`, `/vocab/$levelId/$topicId`; `Flashcards` (`{ words: VocabWord[] }`).

Read `src/pages/pages.test.tsx` and `src/pages/lesson-nav.test.tsx` first and follow their router-testing pattern.

- [ ] **Step 1: Write failing component and page tests**

`Flashcards.test.tsx`: renders "Card 1 of N" and the first word; "Flip" reveals the English gloss, the part of speech, the Yoruba sentence and its translation; "Next" and "Previous" move through cards and are disabled at the ends; flipping resets when moving to the next card; a multi-word entry (contains a space) renders without throwing and without a pitch line.

`vocab-pages.test.tsx` (use the memory router and `vi.mock` of `@/content/vocab` OR set real content after Task 7; for this task mock `VOCAB_LEVELS` with a fixture of one level and one topic with 10 words so the tests do not depend on authored content):
- `/vocab` lists five level cards and a progress ring per level labelled in topics
- `/vocab/getting-started` lists the topics, shows "Best" score text once a mode is recorded
- `/vocab/nope` and `/vocab/getting-started/nope` render NotFound
- topic page: default mode is flashcards; switching to Quiz shows "Question 1 of 10"; finishing a full quiz run records `quiz` progress for the topic; abandoning midway records nothing
- Results screen offers "Try again", "Retry the N you missed" when N > 0, "Back to flashcards", and "Next topic" (link) when `nextVocabTopicPath` returns a value, else "Back to level"
- grammar progress key is unchanged after a vocab run

- [ ] **Step 2: Run to confirm failure**, then implement

`Flashcards.tsx`:

```tsx
import { useState } from "react";
import type { VocabWord } from "@/content/vocab/types";
import { AudioButton } from "./AudioButton";
import { PitchLine } from "./PitchLine";

export function Flashcards({ words }: { words: VocabWord[] }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const w = words[i]!;
  const go = (n: number) => {
    setI(n);
    setFlipped(false);
  };
  return (
    <section className="card" style={{ display: "grid", gap: "0.75rem" }}>
      <p className="muted" style={{ margin: 0 }}>Card {i + 1} of {words.length}</p>
      <p className="yo" style={{ margin: 0, fontSize: "2rem" }} data-testid="flashcard-word">{w.yoruba}</p>
      {!/\s/.test(w.yoruba) && <PitchLine word={w.yoruba} />}
      <div><AudioButton text={w.yoruba} /></div>
      {flipped ? (
        <div style={{ display: "grid", gap: "0.5rem" }} data-testid="flashcard-back">
          <p style={{ margin: 0 }}><strong>{w.english}</strong> <span className="muted">({w.pos})</span></p>
          <p className="yo" style={{ margin: 0 }}>{w.sentence.yoruba}</p>
          <p className="muted" style={{ margin: 0 }}>{w.sentence.english}</p>
          <div><AudioButton text={w.sentence.yoruba} /></div>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={() => setFlipped(true)}>Flip</button>
      )}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button className="btn" disabled={i === 0} onClick={() => go(i - 1)}>Previous</button>
        <button className="btn" disabled={i === words.length - 1} onClick={() => go(i + 1)}>Next</button>
      </div>
    </section>
  );
}
```

`VocabResults.tsx`: props `{ correct: number; total: number; missedCount: number; onRetryMissed: () => void; onTryAgain: () => void; onFlashcards: () => void; next: { levelId: string; topicId: string } | null; levelId: string }`. Card styled like `Results.tsx`: heading "Results", `You got {correct} of {total} right.`, buttons per the test list; "Next topic" is a `Link` to `/vocab/$levelId/$topicId`, otherwise "Back to level" links to `/vocab/$levelId`.

`VocabTopicPage.tsx`: reads `{ levelId, topicId }` via `useParams({ strict: false })`, `NotFound` when either lookup fails, waits for `loaded` (render `<main className="page" aria-busy="true" />`). Mode state `"flashcards" | "quiz" | "gap"`, plus `attempt` counter and an optional `retry` question list. Wrap the page body in a component keyed `${topic.id}` so navigating to the next topic resets state (same lesson-keying fix as `LessonPage`). Quiz/gap questions: `useMemo(() => buildQuiz(topic, \`${topic.id}#${attempt}\`), [...])`. Render `<Activity key={...} questions={retry ?? questions} onDone={...} />`; in `onDone`, if the run was the full question set (not a retry of missed ones) call `update((p) => recordVocabCompletion(p, topic.id, mode, r.correct / r.total))`; then show `VocabResults`. A mode switcher is three buttons (`aria-pressed`) labelled "Flashcards", "Quiz", "Gap fill"; changing mode resets attempt and results. Heading: topic title, blurb, and a "Back to level" link.

`VocabLevelPage.tsx`: like `LevelPage` but over `getVocabLevel`, topic cards link to `/vocab/$levelId/$topicId`, showing `Best quiz N%` / `Best gap-fill N%` when recorded. When `level.topics.length === 0` show "Topics for this level are on the way." No locking.

`VocabHome.tsx`: `h1` "Learn Yoruba words", intro sentence, five level cards (`ProgressRing` with `done = topicsDone(...)`, `total = level.topics.length`, `unit="topics"`), links to `/vocab/$levelId`.

Router: add the three routes. Layout nav: add `<Link to="/vocab">Vocab</Link>` before About and rename nothing else. Home: below the level cards add a card-link to `/vocab` titled "Vocab" with the sentence "Common words by topic, with flashcards and practice."

Copy rules: no em dashes, no eyebrow labels.

- [ ] **Step 3: Run the checks**

`npx vitest run && npx tsc --noEmit && npm run validate` -> green. Also start nothing new: the dev server on 5173 is already running; do not restart it.

- [ ] **Step 4: Commit**

```bash
git add -A src
git commit -m "feat: vocab pages with flashcards, quiz and gap-fill modes

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Review markdown and audio listing for vocab

**Files:**
- Modify: `src/lib/review.ts`, `src/lib/review.test.ts`, `scripts/generate-review.ts`
- Modify: `src/lib/audio-strings.ts`, `src/lib/audio-strings.test.ts`, `scripts/list-audio-strings.ts`, `src/lib/audio.test.ts`
- Modify: `tools/audio/prepare_paste.py`, `tools/audio/README.md`, `tools/audio/test_split.py` only if its tests reference changed behavior

**Interfaces:**
- Consumes: `VocabLevel`, `VocabWord` (Task 2); existing `buildReviewMarkdown(levels)`, `collectAudioStrings(levels)`.
- Produces:
  - `buildReviewMarkdown(levels: Level[], vocabLevels?: VocabLevel[]): string` (second argument optional; existing one-argument calls unchanged)
  - `collectVocabAudioStrings(levels: VocabLevel[]): { key: string; text: string; group: "vocab-word" | "vocab-sentence" }[]`
  - `strings.json` items gain a `group` field: `"grammar"` for existing items, `"vocab-word"`, `"vocab-sentence"` for the new ones. Keys unique across all groups (a grammar string wins over a vocab duplicate).

- [ ] **Step 1: Review markdown, test first**

In `review.test.ts` add tests (fixture vocab level with one topic of ten words): output contains a `## Vocab` section, a `### <level title>` then `#### <topic title> (\`<topic.id>\`)` block listing each word as `- \`<id>\`: **<yoruba>** (<english>, <pos>)`, then `  - Sentence: <yoruba> / <english>` and `  - Doubt: <note>`, plus the count line includes vocab items (`N items need review` counts grammar plus vocab). Calling with one argument yields exactly the previous output (regression test against a stored fixture string or by comparing to the two-argument call with `[]`).

Implement, grouping by level then topic, listing `needs-review` words only for the Doubt block but the topic header and sources line always. Update `scripts/generate-review.ts` to pass `VOCAB_LEVELS`.

- [ ] **Step 2: Audio listing, test first**

In `audio-strings.test.ts` add: `collectVocabAudioStrings` returns words and sentences with the right groups; keys are `audioKey` of the text; keys are unique NFC; a multi-word entry keeps its spaces; it does not apply the `isSpokenYoruba` English-word filter (a Yoruba word that equals an English stopword, for example a fixture word "ẹ" is excluded by the one-letter rule but "ìdí" is kept).

Implement `collectVocabAudioStrings`. Update `scripts/list-audio-strings.ts` to write grammar items (with `group: "grammar"`) followed by vocab items, deduplicated by key with grammar first, and print counts per group.

In `src/lib/audio.test.ts`:
- the orphan test must treat vocab keys as known: allowed manifest keys = grammar keys plus vocab keys
- add `describe("audio matches vocab content")`: every manifest entry that belongs to a vocab key has a file on disk; and one `it` that never fails but logs `console.info` with the count of vocab strings still without a clip

- [ ] **Step 3: prepare_paste.py group filter**

Read `tools/audio/prepare_paste.py` and `tools/audio/README.md` first. Add a `--group` option (`grammar`, `vocab-word`, `vocab-sentence`, repeatable; default all that still have no manifest entry) so the owner can generate vocab words first and sentences after. The script must only include strings whose key is not yet in `src/content/audio-manifest.json`, so re-runs after partial batches only paste what is missing. Keep the existing part-splitting and `order.json` behavior and the `tools/audio/paste/` gitignore. Document the new flow in the README (one short section: words first, then sentences; free-plan limits as already written there). Run `npm run audio:test` and confirm it still passes.

- [ ] **Step 4: Run the checks and commit**

`npx vitest run && npx tsc --noEmit && npm run validate && npm run audio:list && npm run audio:test` -> green.

```bash
git add -A src scripts tools/audio/prepare_paste.py tools/audio/README.md
git commit -m "feat: vocab sections in the review file and audio string list

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Reference topic content, e2e, and design checkpoint

**Files:**
- Modify: `src/content/vocab/getting-started.ts` (add the first topic)
- Create: `e2e/vocab.spec.ts`
- Modify: `content/REVIEW.md` (regenerate)

**Interfaces:**
- Consumes: everything above.
- Produces: topic id `gs-greetings` ("Greetings and courtesies"), 10 words, which is the reference for how all other topics are authored.

Authoring rules (apply to every content task from here on):
- Standard (Ìbàdàn) Yoruba. Full tone marks; dots under ẹ, ọ, ṣ. NFC. No em dashes.
- 10 words per topic, `needs-review` with a specific `note` per word (what is uncertain: tone, a regional variant, register, or "sentence drafted by the model").
- Each sentence is short (3 to 6 words), natural, contains the word verbatim once (or uses `sentence.blank`), and carries a disambiguating detail so no sibling word in the topic could also fill the blank truthfully. Check every word against its nine siblings and rewrite any sentence where another sibling also fits.
- Glosses are unique within a topic and specific ("mother" and "father", never "parent" twice).
- `sources` lists only what was actually consulted; if only the model's own knowledge plus a dictionary lookup was used, say exactly that.
- Word ids follow `<level-prefix>-<topic>-<slug>` (for example `gs-greetings-bawo`), unique across all vocab.
- If you are unsure of a tone mark or form, still include the word but make the note say so plainly. Never fabricate a source.

- [ ] **Step 1: Author the topic**

Topic `gs-greetings`: ten common greetings and courtesies (for example good morning, good afternoon, good evening, welcome, thank you, please, sorry, goodbye, how are you, yes/no style courtesies), chosen so glosses are distinct and each sentence disambiguates its word. Use `pos: "phrase"` for multi-word entries.

- [ ] **Step 2: Validate**

`npm run validate && npx vitest run` -> green (`gs-greetings passes validation` now runs for real).

- [ ] **Step 3: Write the e2e**

`e2e/vocab.spec.ts` (follow the existing e2e files for fixtures and theme handling): visit `/vocab`, open Getting Started, open `Greetings and courtesies`, step through flashcards (Flip, Next), switch to Quiz and answer all 10 questions by clicking the first choice then Continue, confirm "Results" appears and the topic page shows completion on the level page; repeat for Gap fill; repeat one run in dark mode via the existing theme toggle; confirm nav link "Vocab" and the Home card both reach `/vocab`.

- [ ] **Step 4: Run everything**

`npx vitest run && npx tsc --noEmit && npm run validate && npx playwright test` -> green. Regenerate `npm run review`.

- [ ] **Step 5: Screenshots for the owner (design checkpoint)**

With the dev server already running at `http://localhost:5173`, capture screenshots into `.screenshots/` (git-ignored) with Playwright: `/vocab`, the Getting Started level page, the topic page in flashcards (front and flipped), a quiz question, a gap-fill question, and the results screen, each in light and dark. Report the file paths.

- [ ] **Step 6: Commit**

```bash
git add -A src e2e content
git commit -m "content: Greetings topic as the vocab reference topic, with e2e

Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

**CHECKPOINT (controller, not the implementer):** show the owner the screenshots and the reference topic's content, and wait for design approval before Tasks 8 to 12.

---

### Task 8: Author Getting Started topics 2 to 5

**Files:** Modify `src/content/vocab/getting-started.ts`; regenerate `content/REVIEW.md`.

Topics, each following the Task 7 authoring rules exactly:
- `gs-numbers`: numbers 1 to 10 (`pos: "number"`; sentences such as counting a distinct item so no other number fits, for example by naming how many people or things)
- `gs-family`: family (mother, father, child, older sibling, younger sibling, grandmother, grandfather, husband, wife, friend)
- `gs-body`: body (head, eye, ear, mouth, hand, leg, stomach, back, heart, hair)
- `gs-food`: food and drink (water, rice, yam, beans, bread, egg, fish, meat, salt, fruit)

Mind tone-contrast pairs: do not include two words that are the same letters with different tone in one topic unless the sentence makes the meaning unambiguous and the note says so.

- [ ] **Step 1:** Author the four topics. Hand-check each word against its siblings for the distractor rule.
- [ ] **Step 2:** `npm run validate && npx vitest run && npx tsc --noEmit` -> green; `npm run review`.
- [ ] **Step 3:** Commit `content: Getting Started vocab topics`.

---

### Task 9: Author Beginner topics

**Files:** Modify `src/content/vocab/beginner.ts`; regenerate `content/REVIEW.md`.

Topics (ids prefixed `b-`), five topics of ten words each, Task 7 authoring rules:
- `b-animals`: animals
- `b-colors`: colors (red, white, black, green, blue, yellow, and others only if Yoruba has a standard single word; otherwise choose words that can be glossed distinctly, and note any that are descriptive phrases)
- `b-home`: home and household
- `b-clothing`: clothing
- `b-time`: time and days (day, night, morning, today, tomorrow, yesterday, week, year, now, later)

- [ ] **Step 1:** Author. **Step 2:** `npm run validate && npx vitest run && npx tsc --noEmit` -> green; `npm run review`. **Step 3:** Commit `content: Beginner vocab topics`.

---

### Task 10: Author Intermediate topics

**Files:** Modify `src/content/vocab/intermediate.ts`; regenerate `content/REVIEW.md`.

Topics (ids prefixed `i-`): `i-town` town and travel; `i-work` work and school; `i-feelings` feelings; `i-nature` weather and nature; `i-verbs` common verbs (use `pos: "verb"`; gap sentences must keep the verb in the form that appears in the sentence, using `sentence.blank` only if the form changes).

- [ ] **Step 1:** Author. **Step 2:** `npm run validate && npx vitest run && npx tsc --noEmit` -> green; `npm run review`. **Step 3:** Commit `content: Intermediate vocab topics`.

---

### Task 11: Author Advanced topics

**Files:** Modify `src/content/vocab/advanced.ts`; regenerate `content/REVIEW.md`.

Topics (ids prefixed `a-`): `a-market` market and money; `a-health` health; `a-community` community and religion; `a-adjectives` adjectives of quality (`pos: "adjective"`); `a-verbs2` more common verbs (`pos: "verb"`, none repeated from `i-verbs`; the validator does not check across topics, so check by hand).

- [ ] **Step 1:** Author. **Step 2:** `npm run validate && npx vitest run && npx tsc --noEmit` -> green; `npm run review`. **Step 3:** Commit `content: Advanced vocab topics`.

---

### Task 12: Author Mastery topics

**Files:** Modify `src/content/vocab/mastery.ts`; regenerate `content/REVIEW.md`.

Topics (ids prefixed `m-`): `m-abstract` abstract nouns; `m-virtues` character and virtues (the Yoruba concept of ìwà and related words; note cultural nuance in each `note`); `m-custom` law and custom; `m-idioms` idiomatic phrases (`pos: "phrase"`, sentence must show the idiom used literally in context and the note must say the idiom's real meaning); `m-proverbs` vocabulary that appears in the proverbs taught in the grammar Mastery lessons (check `src/content/lessons/m-4.ts` and reuse its words, with new sentences).

- [ ] **Step 1:** Author. **Step 2:** `npm run validate && npx vitest run && npx tsc --noEmit` -> green; `npm run review`. **Step 3:** Commit `content: Mastery vocab topics`.

---

### Task 13: Completeness, docs, and final verification

**Files:**
- Modify: `src/content/vocab/content.test.ts` (complete catalog test), `scripts/validate-content.ts` (pass `{ complete: true }`)
- Modify: `src/pages/About.tsx` (one short paragraph: Vocab section exists, same review status, audio clips are added in batches)
- Modify: `README.md` if it lists commands or sections

- [ ] **Step 1:** In `content.test.ts` add `it("has 5 topics of 10 words in every level (250 words)")` calling `validateVocabCatalog(VOCAB_LEVELS, { complete: true })` and asserting `allVocabWords()` has length 250. In `validate-content.ts` call `validateVocabCatalog(VOCAB_LEVELS, { complete: true })`.
- [ ] **Step 2:** Add the About paragraph (no em dashes, no eyebrow labels).
- [ ] **Step 3:** Full verification: `npx vitest run && npx tsc --noEmit && npm run validate && npm run build && npx playwright test`. Report counts.
- [ ] **Step 4:** `npm run review` and `npm run audio:list`; report the count of grammar and vocab items needing review and the number of vocab audio strings per group (words, sentences) still without clips.
- [ ] **Step 5:** Commit `feat: complete the vocab catalog and document it`.

Report to the controller: totals, and any known risks (sentences the author was least sure of, tone-contrast pairs, and which topics have the thinnest sources).
