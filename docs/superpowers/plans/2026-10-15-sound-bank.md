# Sound Bank Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/sounds` Sound Bank page: vowel, consonant and tone cards with example words, minimal pairs with "Play all", and a listen-and-pick practice.

**Architecture:** A new content file `src/content/sounds.ts` with a sibling validator, wired into `npm run validate`, the audio string lister and `content/REVIEW.md`. Pure helpers (`playSequence`, `buildPractice`) are unit-tested; one page component with small child components renders the content. No progress storage.

**Tech Stack:** Vite, React 19, TypeScript, TanStack Router, Vitest + Testing Library, Playwright, Python audio tools (ElevenLabs paste-and-split, run by the owner).

**Spec:** `docs/superpowers/specs/2026-10-15-sound-bank-design.md`

## Global Constraints

- No em dash (U+2014) anywhere in code, copy or content. Verify with `grep -rnP '\x{2014}' <files>`.
- No eyebrow labels in any copy or design.
- All Yoruba is NFC with full tone marks; every sound and pair is `confidence: "needs-review"` with a `note`.
- Path alias `@/` maps to `src/`. Components use the existing tokens and classes (`.card`, `.btn`, `.with-audio`, `.yo`, `.muted`), no new design language.
- Never read, print or commit `tools/audio/.env`. Do not start a second dev server (one is already running on :5173).
- Commit only when the owner asks; each task ends with a verification run, not a commit. Commit trailer when asked: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.
- After any CSS edit, confirm the dev server output has no "Internal server error" (Vite serves stale CSS on a syntax error).

## Review Focus

- A pair or sound with a word that has no audio yet: the word and gloss still show, no speaker button, no crash.
- "Play all" with some clips missing or while another clip is playing: skips missing, stops cleanly, never plays two clips at once.
- Practice with fewer than 2 playable words in every pair (fresh install before audio is generated): shows a friendly "audio coming soon" message, not an empty quiz or crash.
- Tone cards: `PitchLine` on words with unusual syllables must not throw (it already returns null on parse failure).
- Mark order: NFC vs NFD input for letters like `ọ̀` must not break validation or audio keys.

## File Structure

| File | Responsibility |
|---|---|
| `src/content/sounds.ts` | Types, `SOUNDS`, `MINIMAL_PAIRS`, helpers |
| `src/content/validate-sounds.ts` | `validateSounds(sounds, pairs)` returns error strings |
| `src/lib/clip.ts` | Shared one-clip-at-a-time player (`playClip`, `stopClip`, `isCurrentClip`) |
| `src/lib/play-sequence.ts` | `playSequence(texts, opts)` |
| `src/lib/sound-practice.ts` | `buildPractice(pairs, seed, hasAudio)` |
| `src/lib/audio-strings.ts` | Add `collectSoundAudioStrings` |
| `src/components/{SoundCard,PairCard,SoundPractice}.tsx` | UI pieces |
| `src/pages/SoundBank.tsx` | Page |
| `src/lib/review.ts`, `scripts/*`, `tools/audio/prepare_paste.py`, `e2e/sounds.spec.ts` | Wiring and tests |

---

### Task 1: Sound content, types and validator

**Files:**
- Create: `src/content/sounds.ts`, `src/content/validate-sounds.ts`, `src/content/sounds.test.ts`
- Modify: `scripts/validate-content.ts`

**Interfaces:**
- Produces: `type SoundExample`, `Sound`, `MinimalPair` (shapes below); `SOUNDS: Sound[]`, `MINIMAL_PAIRS: MinimalPair[]`, `soundsBySection(section): Sound[]`; `validateSounds(sounds: Sound[], pairs: MinimalPair[]): string[]`.

- [ ] **Step 1: Write the failing tests** (`src/content/sounds.test.ts`)

```ts
import { describe, expect, it } from "vitest";
import { MINIMAL_PAIRS, SOUNDS, soundsBySection } from "./sounds";
import type { MinimalPair, Sound } from "./sounds";
import { validateSounds } from "./validate-sounds";

const ok: Sound = {
  id: "c-x", section: "consonants", letter: "b", compare: "like 'b' in 'bat'",
  examples: [{ yoruba: "bàbá", english: "father" }, { yoruba: "bàtà", english: "shoe" }],
  confidence: "needs-review", note: "Check.",
};
const pair: MinimalPair = {
  id: "p-x", contrast: "tone", explain: "Only the tone changes.",
  words: [{ yoruba: "ọkọ", english: "husband" }, { yoruba: "ọkọ̀", english: "vehicle" }],
  confidence: "needs-review", note: "Check.",
};

describe("shipped sound content", () => {
  it("passes the validator", () => {
    expect(validateSounds(SOUNDS, MINIMAL_PAIRS)).toEqual([]);
  });
  it("covers vowels plus nasals, consonants, and exactly one card per tone", () => {
    expect(soundsBySection("vowels").length).toBeGreaterThanOrEqual(12);
    expect(soundsBySection("consonants").length).toBeGreaterThanOrEqual(18);
    expect(soundsBySection("tones").map((s) => s.tone).sort()).toEqual(["high", "low", "mid"]);
  });
  it("has 6 to 10 minimal pairs", () => {
    expect(MINIMAL_PAIRS.length).toBeGreaterThanOrEqual(6);
    expect(MINIMAL_PAIRS.length).toBeLessThanOrEqual(10);
  });
});

describe("validateSounds", () => {
  it("accepts a valid sound and pair", () => {
    expect(validateSounds([ok], [pair])).toEqual([]);
  });
  it("rejects NFD strings", () => {
    const bad = { ...ok, examples: [{ yoruba: "ọkọ̀".normalize("NFD"), english: "x" }, ok.examples[1]!] };
    expect(validateSounds([bad], [])).toEqual(expect.arrayContaining([expect.stringContaining("not NFC")]));
  });
  it("rejects em dashes", () => {
    expect(validateSounds([{ ...ok, compare: "like b \u2014 bat" }], [])).toEqual(
      expect.arrayContaining([expect.stringContaining("em dash")]),
    );
  });
  it("rejects needs-review without a note", () => {
    expect(validateSounds([{ ...ok, note: undefined }], [])).toEqual(expect.arrayContaining([expect.stringContaining("note")]));
  });
  it("rejects duplicate ids and wrong example counts", () => {
    const errs = validateSounds([ok, { ...ok, examples: [ok.examples[0]!] }], []);
    expect(errs.join("\n")).toMatch(/duplicate id/);
    expect(errs.join("\n")).toMatch(/2 to 3 examples/);
  });
  it("requires tone only on the tones section", () => {
    expect(validateSounds([{ ...ok, tone: "high" }], []).join("\n")).toMatch(/tone is only for the tones section/);
    expect(validateSounds([{ ...ok, section: "tones" }], []).join("\n")).toMatch(/tones card needs a tone/);
  });
  it("rejects pairs with identical words or the wrong size", () => {
    const same = { ...pair, words: [pair.words[0]!, pair.words[0]!] };
    expect(validateSounds([], [same]).join("\n")).toMatch(/words must be distinct/);
    expect(validateSounds([], [{ ...pair, words: [pair.words[0]!] }]).join("\n")).toMatch(/2 to 3 words/);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/content/sounds.test.ts`
Expected: FAIL (modules not found).

- [ ] **Step 3: Write the validator** (`src/content/validate-sounds.ts`)

```ts
import { strings } from "./validate";
import type { MinimalPair, Sound } from "./sounds";

const EM_DASH = "\u2014";

export function validateSounds(sounds: Sound[], pairs: MinimalPair[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const checkText = (id: string, v: unknown) => {
    for (const s of strings(v)) {
      if (s !== s.normalize("NFC")) errors.push(`${id}: string is not NFC: "${s}"`);
      if (s.includes(EM_DASH)) errors.push(`${id}: string contains an em dash: "${s}"`);
    }
  };
  const checkId = (id: string) => {
    if (ids.has(id)) errors.push(`${id}: duplicate id`);
    ids.add(id);
  };

  for (const s of sounds) {
    checkId(s.id);
    checkText(s.id, s);
    if (s.examples.length < 2 || s.examples.length > 3) errors.push(`${s.id}: needs 2 to 3 examples, found ${s.examples.length}`);
    if (s.confidence === "needs-review" && !s.note) errors.push(`${s.id}: needs-review needs a note`);
    if (s.section === "tones" && !s.tone) errors.push(`${s.id}: tones card needs a tone`);
    if (s.section !== "tones" && s.tone) errors.push(`${s.id}: tone is only for the tones section`);
  }
  for (const p of pairs) {
    checkId(p.id);
    checkText(p.id, p);
    if (p.words.length < 2 || p.words.length > 3) errors.push(`${p.id}: needs 2 to 3 words, found ${p.words.length}`);
    const forms = p.words.map((w) => w.yoruba.normalize("NFC"));
    if (new Set(forms).size !== forms.length) errors.push(`${p.id}: words must be distinct`);
    if (p.confidence === "needs-review" && !p.note) errors.push(`${p.id}: needs-review needs a note`);
  }
  return errors;
}
```

- [ ] **Step 4: Write the content** (`src/content/sounds.ts`). All entries are `needs-review`. Example words are taken from the existing vocab where possible so their audio already exists; the new words are `ìyẹn`, `ẹ̀yẹn`, `ahọ́n`, `ihò`, `àpò`, `ọṣẹ`, `owó`, `apá`, `àpá`, `igba`, `ìgbà`, `ìgbá`, `eyín`, `ọkọ́`, `oko`.

```ts
import type { Confidence, Tone } from "./types";

// Sources consulted: standard Yoruba orthography and phonology references
// (Bamgbose, "A Grammar of Yoruba"; Rowlands, "Yoruba"; Abraham, "Dictionary of Modern Yoruba").
// English comparisons are approximations. Every entry is needs-review until a native speaker checks it.

export type SoundExample = { yoruba: string; english: string };
export type SoundSection = "vowels" | "consonants" | "tones";

export type Sound = {
  id: string;
  section: SoundSection;
  letter: string;
  compare: string;
  examples: SoundExample[];
  tone?: Tone;
  confidence: Confidence;
  note?: string;
};

export type MinimalPair = {
  id: string;
  contrast: "tone" | "sound";
  explain: string;
  words: SoundExample[];
  confidence: Confidence;
  note?: string;
};

const ex = (yoruba: string, english: string): SoundExample => ({ yoruba, english });
const s = (
  id: string, section: SoundSection, letter: string, compare: string, examples: SoundExample[], note: string, tone?: Tone,
): Sound => ({ id, section, letter, compare, examples, ...(tone ? { tone } : {}), confidence: "needs-review", note });

export const SOUNDS: Sound[] = [
  // Oral vowels
  s("v-a", "vowels", "a", "close to 'a' in 'father'", [ex("àga", "chair"), ex("ajá", "dog"), ex("àná", "yesterday")], "English comparison approximate."),
  s("v-e", "vowels", "e", "close to 'e' in 'they', without the glide", [ex("erin", "elephant"), ex("ejò", "snake"), ex("etí", "ear")], "Check the comparison; Yoruba e is a pure vowel."),
  s("v-ee", "vowels", "ẹ", "close to 'e' in 'bed'", [ex("ẹja", "fish"), ex("ẹran", "meat"), ex("ẹyin", "egg")], "English comparison approximate."),
  s("v-i", "vowels", "i", "close to 'ee' in 'see', shorter", [ex("ilé", "house"), ex("irun", "hair"), ex("ikùn", "stomach")], "English comparison approximate."),
  s("v-o", "vowels", "o", "close to 'o' in 'go', without the glide", [ex("omi", "water"), ex("orí", "head"), ex("ojú", "eye")], "Check the comparison; Yoruba o is a pure vowel."),
  s("v-oo", "vowels", "ọ", "close to 'aw' in 'saw'", [ex("ọmọ", "child"), ex("ọkọ", "husband"), ex("ọwọ́", "hand")], "English comparison approximate (varies by accent)."),
  s("v-u", "vowels", "u", "close to 'oo' in 'moon', shorter", [ex("iṣu", "yam"), ex("ẹnu", "mouth"), ex("ọdún", "year")], "English comparison approximate."),
  // Nasal vowels
  s("n-an", "vowels", "an", "a nasal 'a', like the vowel in French 'blanc'", [ex("ọkàn", "heart"), ex("ẹran", "meat")], "Nasal vowel; check example words and the French comparison."),
  s("n-en", "vowels", "ẹn", "a nasal 'ẹ', like the vowel in French 'vin' pronounced with 'e' as in 'bed'", [ex("ìyẹn", "that one"), ex("ẹ̀yẹn", "that")], "Rare and debated nasal vowel; example words are my least certain, a native speaker must confirm or replace them."),
  s("n-in", "vowels", "in", "a nasal 'i', like the vowel in French 'vin' but with 'ee'", [ex("erin", "elephant"), ex("mẹ́rin", "four")], "Check comparison and example words."),
  s("n-un", "vowels", "un", "a nasal 'u', close to the vowel in French 'on' but with 'oo'", [ex("irun", "hair"), ex("ikùn", "stomach")], "Check comparison and example words."),
  s("n-on", "vowels", "ọn", "a nasal 'ọ', like the vowel in French 'bon'", [ex("ẹ̀gbọ́n", "older sibling"), ex("ọ̀kan", "one")], "Check comparison and example words."),
  // Consonants
  s("c-b", "consonants", "b", "like 'b' in 'bat'", [ex("bàbá", "father"), ex("bàtà", "shoe"), ex("ọ̀bọ", "monkey")], "Plain consonant."),
  s("c-d", "consonants", "d", "like 'd' in 'dog'", [ex("dúdú", "black"), ex("adìyẹ", "chicken"), ex("ọdún", "year")], "Plain consonant."),
  s("c-f", "consonants", "f", "like 'f' in 'fun'", [ex("funfun", "white"), ex("fìlà", "cap"), ex("fèrèsé", "window")], "Plain consonant."),
  s("c-g", "consonants", "g", "like 'g' in 'go'", [ex("gèlè", "head wrap"), ex("àga", "chair")], "Plain consonant."),
  s("c-gb", "consonants", "gb", "one sound made by saying 'g' and 'b' together, lips closed", [ex("agbádá", "agbada robe"), ex("ẹ̀gbọ́n", "older sibling"), ex("ológbò", "cat")], "Single sound, not g then b. Check the description and examples."),
  s("c-h", "consonants", "h", "like 'h' in 'hat'", [ex("ahọ́n", "tongue"), ex("ihò", "hole")], "Check example words; h is not common."),
  s("c-j", "consonants", "j", "like 'j' in 'jam'", [ex("ejò", "snake"), ex("ọjọ́", "day")], "Plain consonant."),
  s("c-k", "consonants", "k", "like 'k' in 'kit'", [ex("kọ́kọ́rọ́", "key"), ex("ikùn", "stomach"), ex("ọkọ", "husband")], "Plain consonant."),
  s("c-l", "consonants", "l", "like 'l' in 'lamp'", [ex("ilé", "house"), ex("ọ̀la", "tomorrow"), ex("alẹ́", "night")], "Plain consonant."),
  s("c-m", "consonants", "m", "like 'm' in 'man'", [ex("omi", "water"), ex("méjì", "two"), ex("ọmọ", "child")], "Plain consonant."),
  s("c-n", "consonants", "n", "like 'n' in 'net'", [ex("ẹnu", "mouth"), ex("òní", "today"), ex("àná", "yesterday")], "Plain consonant."),
  s("c-p", "consonants", "p", "written p but said like 'kp': 'k' and 'p' together, lips closed", [ex("pupa", "red"), ex("àpò", "bag")], "Yoruba p is a kp sound; check description and examples."),
  s("c-r", "consonants", "r", "a quick tap of the tongue, like the 'tt' in American 'butter'", [ex("erin", "elephant"), ex("ọ̀rẹ́", "friend")], "English comparison approximate."),
  s("c-s", "consonants", "s", "like 's' in 'sun'", [ex("sùn", "sleep"), ex("èso", "fruit"), ex("ọ̀sẹ̀", "week")], "Plain consonant."),
  s("c-sh", "consonants", "ṣ", "like 'sh' in 'ship'", [ex("aṣọ", "cloth"), ex("ṣòkòtò", "trousers"), ex("iṣu", "yam")], "Check; do not confuse with s."),
  s("c-t", "consonants", "t", "like 't' in 'top'", [ex("tábìlì", "table"), ex("etí", "ear"), ex("mẹ́ta", "three")], "Plain consonant."),
  s("c-w", "consonants", "w", "like 'w' in 'water'", [ex("ọwọ́", "hand"), ex("ẹ̀wù", "garment"), ex("wàrà", "milk")], "Plain consonant."),
  s("c-y", "consonants", "y", "like 'y' in 'yes'", [ex("ẹyin", "egg"), ex("yàrá", "room"), ex("ìyá", "mother")], "Plain consonant."),
  // Tones
  s("t-high", "tones", "á", "High: a higher pitch, marked with an acute accent", [ex("ọwọ́", "hand"), ex("ọjọ́", "day"), ex("etí", "ear")], "Check example words show the high tone clearly.", "high"),
  s("t-mid", "tones", "a", "Mid: the middle pitch, usually left unmarked", [ex("ọmọ", "child"), ex("omi", "water"), ex("erin", "elephant")], "Mid is unmarked; check examples.", "mid"),
  s("t-low", "tones", "à", "Low: a lower pitch, marked with a grave accent", [ex("ọkọ̀", "vehicle"), ex("àga", "chair"), ex("ẹsẹ̀", "leg")], "Check example words show the low tone clearly.", "low"),
];

const pair = (
  id: string, contrast: "tone" | "sound", explain: string, words: SoundExample[], note: string,
): MinimalPair => ({ id, contrast, explain, words, confidence: "needs-review", note });

export const MINIMAL_PAIRS: MinimalPair[] = [
  pair("p-oko-tone", "tone", "Same letters, three tones, three meanings.", [ex("ọkọ", "husband"), ex("ọkọ̀", "vehicle"), ex("ọkọ́", "spear")], "Check all three meanings and tones."),
  pair("p-igba-tone", "tone", "Same letters, three tones, three meanings.", [ex("igba", "two hundred"), ex("ìgbà", "time"), ex("ìgbá", "calabash")], "Check meanings and tones."),
  pair("p-eyin-tone", "tone", "Same letters, different tones and vowel marks.", [ex("ẹyin", "egg"), ex("eyín", "tooth"), ex("ẹ̀yìn", "back")], "eyín tone is a known doubt."),
  pair("p-apa-tone", "tone", "Only the tone changes.", [ex("apá", "arm"), ex("àpá", "scar")], "Check meanings and tones."),
  pair("p-oko-sound", "sound", "o and ọ are different vowels.", [ex("oko", "farm"), ex("ọkọ", "husband")], "Check meanings."),
  pair("p-owo-sound", "sound", "o and ọ are different vowels.", [ex("owó", "money"), ex("ọwọ́", "hand")], "Check meanings and tones."),
  pair("p-ose-sound", "sound", "s and ṣ are different sounds (tones differ too).", [ex("ọ̀sẹ̀", "week"), ex("ọṣẹ", "soap")], "Tones also differ, so not a pure sound pair; check."),
];

export const soundsBySection = (section: SoundSection): Sound[] => SOUNDS.filter((x) => x.section === section);
```

- [ ] **Step 5: Wire into `npm run validate`.** In `scripts/validate-content.ts` add imports `import { MINIMAL_PAIRS, SOUNDS } from "../src/content/sounds";` and `import { validateSounds } from "../src/content/validate-sounds";`, and before the `if (failed)` block:

```ts
for (const e of validateSounds(SOUNDS, MINIMAL_PAIRS)) {
  console.error(e);
  failed++;
}
```
Change the success line to `` `OK: ${count} lesson(s), ${vocabCount} vocab topic(s) and ${SOUNDS.length} sound(s) valid.` ``.

- [ ] **Step 6: Verify**

Run: `npx vitest run src/content/sounds.test.ts && npm run validate && grep -nP '\x{2014}' src/content/sounds.ts src/content/validate-sounds.ts docs/superpowers/plans/2026-10-15-sound-bank.md; npx tsc --noEmit`
Expected: tests PASS, `OK: ...`, no em dashes, tsc clean.

---

### Task 2: Shared clip player and `playSequence`

**Files:**
- Create: `src/lib/clip.ts`, `src/lib/play-sequence.ts`, `src/lib/play-sequence.test.ts`
- Modify: `src/components/AudioButton.tsx`

**Interfaces:**
- Produces: `playClip(url): HTMLAudioElement | null`, `stopClip()`, `isCurrentClip(c): boolean`; `playSequence(texts: string[], opts?: { lookup?: (t: string) => string | null; play?: (url: string) => Promise<boolean> }): Promise<void>`.

- [ ] **Step 1: Write the failing tests** (`src/lib/play-sequence.test.ts`)

```ts
import { describe, expect, it } from "vitest";
import { playSequence } from "./play-sequence";

const lookup = (t: string) => (t === "missing" ? null : `/audio/${t}.mp3`);

describe("playSequence", () => {
  it("plays clips in order and skips words without audio", async () => {
    const played: string[] = [];
    await playSequence(["a", "missing", "b"], { lookup, play: async (u) => (played.push(u), true) });
    expect(played).toEqual(["/audio/a.mp3", "/audio/b.mp3"]);
  });
  it("stops when a clip is interrupted", async () => {
    const played: string[] = [];
    await playSequence(["a", "b", "c"], { lookup, play: async (u) => (played.push(u), u !== "/audio/a.mp3") });
    expect(played).toEqual(["/audio/a.mp3"]);
  });
  it("a newer sequence cancels the older one", async () => {
    const played: string[] = [];
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    const first = playSequence(["a", "b"], {
      lookup,
      play: async (u) => {
        played.push(`1:${u}`);
        await gate;
        return true;
      },
    });
    const second = playSequence(["c"], { lookup, play: async (u) => (played.push(`2:${u}`), true) });
    release();
    await Promise.all([first, second]);
    expect(played).toEqual(["1:/audio/a.mp3", "2:/audio/c.mp3"]);
  });
  it("does nothing for an empty list", async () => {
    await expect(playSequence([], { lookup, play: async () => true })).resolves.toBeUndefined();
  });
});
```

- [ ] **Step 2: Run to verify failure:** `npx vitest run src/lib/play-sequence.test.ts` → FAIL.

- [ ] **Step 3: Implement.** `src/lib/clip.ts` (moves the module-level "one clip at a time" out of `AudioButton`):

```ts
// One clip at a time across the whole app: starting a new one stops the previous.
let current: HTMLAudioElement | null = null;

export function stopClip(): void {
  try {
    current?.pause();
  } catch {
    // Some environments throw on pause. Stay quiet.
  }
  current = null;
}

export function isCurrentClip(clip: HTMLAudioElement): boolean {
  return current === clip;
}

export function playClip(url: string): HTMLAudioElement | null {
  stopClip();
  try {
    const clip = new Audio(url);
    current = clip;
    const started = clip.play();
    // Autoplay rules or a missing file reject the promise. Audio is optional, so stay quiet.
    if (started && typeof started.catch === "function") started.catch(() => {});
    return clip;
  } catch {
    current = null;
    return null;
  }
}
```

`src/lib/play-sequence.ts`:

```ts
import { audioUrlFor } from "./audio";
import { isCurrentClip, playClip } from "./clip";

let run = 0;

// Resolves true when the clip ended on its own, false when something else took over the player.
function playUntilEnded(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const clip = playClip(url);
    if (!clip) return resolve(true); // could not play: skip it and carry on
    const done = () => resolve(isCurrentClip(clip));
    clip.addEventListener("ended", done, { once: true });
    clip.addEventListener("error", done, { once: true });
    clip.addEventListener("pause", done, { once: true });
  });
}

export async function playSequence(
  texts: string[],
  opts: { lookup?: (text: string) => string | null; play?: (url: string) => Promise<boolean> } = {},
): Promise<void> {
  const id = ++run;
  const lookup = opts.lookup ?? audioUrlFor;
  const play = opts.play ?? playUntilEnded;
  for (const text of texts) {
    if (id !== run) return;
    const url = lookup(text);
    if (!url) continue;
    if (!(await play(url))) return;
  }
}
```

- [ ] **Step 4: Refactor `AudioButton.tsx`** to use `clip.ts`: delete the module-level `let current`, add `import { playClip } from "@/lib/clip";`, and replace the body of `play()` after the animation lines with `playClip(url!);`. Keep everything else (including the `playing` state and aria-label) unchanged.

- [ ] **Step 5: Verify**

Run: `npx vitest run src/lib/play-sequence.test.ts src/components/AudioButton.test.tsx && npx tsc --noEmit`
Expected: all PASS (the existing AudioButton tests stub the global `Audio` and keep passing).

---

### Task 3: Practice question builder

**Files:**
- Create: `src/lib/sound-practice.ts`, `src/lib/sound-practice.test.ts`

**Interfaces:**
- Consumes: `MinimalPair` (Task 1), `seededShuffle` from `@/lib/shuffle`, `audioUrlFor` from `@/lib/audio`.
- Produces: `type PracticeQuestion = { id: string; audioText: string; choices: string[]; answer: string }`; `buildPractice(pairs: MinimalPair[], seed: string, hasAudio?: (text: string) => boolean, max?: number): PracticeQuestion[]`.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, expect, it } from "vitest";
import type { MinimalPair } from "@/content/sounds";
import { buildPractice } from "./sound-practice";

const w = (yoruba: string) => ({ yoruba, english: "x" });
const pairs: MinimalPair[] = [
  { id: "p1", contrast: "tone", explain: "e", words: [w("ọkọ"), w("ọkọ̀"), w("ọkọ́")], confidence: "needs-review", note: "n" },
  { id: "p2", contrast: "sound", explain: "e", words: [w("oko"), w("ọkọ")], confidence: "needs-review", note: "n" },
];
const all = () => true;

describe("buildPractice", () => {
  it("makes one question per playable word, answer included in choices", () => {
    const qs = buildPractice(pairs, "s", all, 99);
    expect(qs).toHaveLength(5);
    for (const q of qs) {
      expect(q.choices).toContain(q.answer);
      expect(q.audioText).toBe(q.answer);
      expect(new Set(q.choices).size).toBe(q.choices.length);
    }
  });
  it("draws choices only from the same pair", () => {
    const qs = buildPractice([pairs[1]!], "s", all, 99);
    for (const q of qs) expect(q.choices.sort()).toEqual(["oko", "ọkọ"].sort());
  });
  it("is deterministic per seed and differs across seeds", () => {
    expect(buildPractice(pairs, "a", all, 99)).toEqual(buildPractice(pairs, "a", all, 99));
    expect(buildPractice(pairs, "a", all, 99).map((q) => q.id)).not.toEqual(buildPractice(pairs, "b", all, 99).map((q) => q.id));
  });
  it("skips pairs with fewer than 2 words that have audio", () => {
    const only = (t: string) => t === "oko";
    expect(buildPractice(pairs, "s", only, 99)).toEqual([]);
  });
  it("only asks about words that have audio", () => {
    const has = (t: string) => t !== "ọkọ́";
    const qs = buildPractice([pairs[0]!], "s", has, 99);
    expect(qs.map((q) => q.answer).sort()).toEqual(["ọkọ", "ọkọ̀"].sort());
  });
  it("caps the number of questions", () => {
    expect(buildPractice(pairs, "s", all, 3)).toHaveLength(3);
  });
});
```

- [ ] **Step 2: Run to verify failure:** `npx vitest run src/lib/sound-practice.test.ts` → FAIL.

- [ ] **Step 3: Implement**

```ts
import type { MinimalPair } from "@/content/sounds";
import { audioUrlFor } from "./audio";
import { seededShuffle } from "./shuffle";

export type PracticeQuestion = { id: string; audioText: string; choices: string[]; answer: string };

const defaultHasAudio = (text: string) => audioUrlFor(text) !== null;

// One question per word that has a clip, in a pair that has at least two such words.
// Choices are every spelling in the pair, so only the ear can tell them apart.
export function buildPractice(
  pairs: MinimalPair[],
  seed: string,
  hasAudio: (text: string) => boolean = defaultHasAudio,
  max = 10,
): PracticeQuestion[] {
  const out: PracticeQuestion[] = [];
  for (const p of pairs) {
    const playable = p.words.filter((x) => hasAudio(x.yoruba));
    if (playable.length < 2) continue;
    const choices = p.words.map((x) => x.yoruba);
    for (const word of playable) out.push({ id: `${p.id}:${word.yoruba}`, audioText: word.yoruba, choices, answer: word.yoruba });
  }
  return seededShuffle(out, seed).slice(0, max);
}
```

- [ ] **Step 4: Verify:** `npx vitest run src/lib/sound-practice.test.ts && npx tsc --noEmit` → PASS, clean.

---

### Task 4: Audio string lister and paste group

**Files:**
- Modify: `src/lib/audio-strings.ts`, `scripts/list-audio-strings.ts`, `tools/audio/prepare_paste.py`, `src/lib/audio-strings.test.ts`

**Interfaces:**
- Consumes: `SOUNDS`, `MINIMAL_PAIRS` (Task 1).
- Produces: `collectSoundAudioStrings(sounds: Sound[], pairs: MinimalPair[]): { key: string; text: string; group: "sound-word" }[]`; `strings.json` entries with `group: "sound-word"`; `prepare_paste.py --group sound-word`.

- [ ] **Step 1: Failing test.** Append to `src/lib/audio-strings.test.ts` (add `import { collectSoundAudioStrings } from "./audio-strings"; import type { MinimalPair, Sound } from "@/content/sounds";` to the imports):

```ts
describe("collectSoundAudioStrings", () => {
  const sounds = [{
    id: "s", section: "consonants", letter: "b", compare: "c", confidence: "needs-review", note: "n",
    examples: [{ yoruba: "bàbá", english: "father" }, { yoruba: "Bàtà", english: "shoe" }],
  }] as Sound[];
  const pairs = [{
    id: "p", contrast: "tone", explain: "e", confidence: "needs-review", note: "n",
    words: [{ yoruba: "ọkọ", english: "a" }, { yoruba: "bàbá", english: "dup" }],
  }] as MinimalPair[];
  it("collects example and pair words, deduped by key, group sound-word", () => {
    const out = collectSoundAudioStrings(sounds, pairs);
    expect(out.map((x) => x.key)).toEqual(["bàbá", "bàtà", "ọkọ"]);
    expect(out.every((x) => x.group === "sound-word")).toBe(true);
  });
});
```

- [ ] **Step 2: Run:** `npx vitest run src/lib/audio-strings.test.ts` → FAIL.

- [ ] **Step 3: Implement.** In `src/lib/audio-strings.ts` add `import type { MinimalPair, Sound } from "@/content/sounds";` and:

```ts
// Sound Bank example and minimal-pair words. Words already listed by grammar or vocab are filtered by the lister.
export function collectSoundAudioStrings(
  sounds: Sound[],
  pairs: MinimalPair[],
): { key: string; text: string; group: "sound-word" }[] {
  const seen = new Map<string, string>();
  const add = (text: string) => {
    const key = audioKey(text);
    if ([...key].length > 1 && !seen.has(key)) seen.set(key, text);
  };
  for (const s of sounds) for (const e of s.examples) add(e.yoruba);
  for (const p of pairs) for (const w of p.words) add(w.yoruba);
  return [...seen].map(([key, text]) => ({ key, text, group: "sound-word" as const }));
}
```

In `scripts/list-audio-strings.ts`: import `SOUNDS, MINIMAL_PAIRS` and `collectSoundAudioStrings`; extend `Item["group"]` with `"sound-word"`; after `vocab`:

```ts
const seenAfterVocab = new Set([...grammar, ...vocab].map((s) => s.key));
const sound: Item[] = collectSoundAudioStrings(SOUNDS, MINIMAL_PAIRS).filter((s) => !seenAfterVocab.has(s.key));
const strings = [...grammar, ...vocab, ...sound];
```
and add `${count("sound-word")} sound-word` to the log line.

In `tools/audio/prepare_paste.py` change `GROUPS = ["grammar", "vocab-word", "vocab-sentence", "sound-word"]` and the docstring group list to include `sound-word`.

- [ ] **Step 4: Verify**

Run: `npx vitest run src/lib/audio-strings.test.ts && npm run audio:list && tools/audio/.venv/bin/python tools/audio/prepare_paste.py --group sound-word --no-test`
Expected: tests PASS; lister prints a `sound-word` count; paste script writes paste files (or says nothing to paste if all exist) and reports a per-group character total for `sound-word`. Then run `npm run audio:list` again after to restore nothing else (the paste dir is git-ignored scratch; do not commit it).

---

### Task 5: Sound Bank page, components, route, nav, Home link

**Files:**
- Create: `src/components/SoundCard.tsx`, `src/components/PairCard.tsx`, `src/components/SoundPractice.tsx`, `src/pages/SoundBank.tsx`, `src/pages/SoundBank.test.tsx`
- Modify: `src/router.tsx`, `src/components/Layout.tsx`, `src/pages/Home.tsx`, `src/styles.css`

**Interfaces:**
- Consumes: `SOUNDS`, `MINIMAL_PAIRS`, `soundsBySection`, `Sound`, `MinimalPair` (Task 1); `playSequence` (Task 2); `buildPractice`, `PracticeQuestion` (Task 3); existing `AudioButton`, `ToneChip`, `PitchLine`, `ChoiceQuestion` (`{prompt, choices, chosen, correct, onChoose}`), `Hero` (`first`, `second`).

- [ ] **Step 1: Write the failing tests** (`src/pages/SoundBank.test.tsx`)

```tsx
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const audio = new Map<string, string>([
  ["ọkọ", "/audio/a.mp3"], ["ọkọ̀", "/audio/b.mp3"], ["ọkọ́", "/audio/c.mp3"], ["ọmọ", "/audio/d.mp3"],
]);
vi.mock("@/lib/audio", async (orig) => ({
  ...(await orig<typeof import("@/lib/audio")>()),
  audioUrlFor: (t: string) => audio.get(t.normalize("NFC")) ?? null,
}));
const sequence = vi.fn(async () => {});
vi.mock("@/lib/play-sequence", () => ({ playSequence: (...a: unknown[]) => sequence(...a) }));

import { SoundBank } from "./SoundBank";

describe("SoundBank", () => {
  it("renders the page heading and all section headings with a jump bar", () => {
    render(<SoundBank />);
    expect(screen.getByRole("heading", { level: 1, name: /Sound Bank/ })).toBeInTheDocument();
    for (const name of ["Vowels", "Consonants", "Tones", "Minimal pairs", "Practice"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
      expect(within(screen.getByRole("navigation", { name: "Sections" })).getByRole("link", { name })).toHaveAttribute("href", `#${name.toLowerCase().replace(" ", "-")}`);
    }
  });
  it("shows speaker buttons only for words that have audio", () => {
    render(<SoundBank />);
    expect(screen.getAllByRole("button", { name: "Listen to ọmọ" }).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "Listen to ahọ́n" })).toBeNull();
    expect(screen.getAllByText("ahọ́n").length).toBeGreaterThan(0); // word still shown
  });
  it("Play all plays the pair's words in order", async () => {
    sequence.mockClear();
    render(<SoundBank />);
    const card = screen.getByTestId("pair-p-oko-tone");
    await userEvent.click(within(card).getByRole("button", { name: "Play all" }));
    expect(sequence).toHaveBeenCalledWith(["ọkọ", "ọkọ̀", "ọkọ́"]);
  });
  it("practice gives feedback and offers Try again", async () => {
    render(<SoundBank />);
    const practice = screen.getByTestId("practice");
    const choices = within(practice).getAllByTestId("choice");
    await userEvent.click(choices[0]!);
    expect(within(practice).getAllByTestId("choice").some((c) => c.getAttribute("data-state") === "correct")).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify failure:** `npx vitest run src/pages/SoundBank.test.tsx` → FAIL.

- [ ] **Step 3: Components.**

`src/components/SoundCard.tsx`:

```tsx
import type { Sound } from "@/content/sounds";
import { AudioButton } from "./AudioButton";
import { PitchLine } from "./PitchLine";
import { ToneChip } from "./ToneChip";

export function SoundCard({ sound }: { sound: Sound }) {
  return (
    <article className="card sound-card" data-testid={`sound-${sound.id}`}>
      <div className="sound-head">
        <span className="sound-letter yo" aria-hidden="true">{sound.letter}</span>
        <div>
          <h3 style={{ margin: 0 }} className="yo">{sound.letter}</h3>
          <p className="muted" style={{ margin: 0 }}>{sound.compare}</p>
          {sound.tone && <ToneChip tone={sound.tone} />}
        </div>
      </div>
      <ul className="sound-examples">
        {sound.examples.map((e) => (
          <li key={e.yoruba}>
            <div className="with-audio">
              <span className="yo"><strong>{e.yoruba}</strong></span>
              <span className="muted">{e.english}</span>
              <AudioButton text={e.yoruba} />
            </div>
            {sound.section === "tones" && <PitchLine word={e.yoruba} />}
          </li>
        ))}
      </ul>
    </article>
  );
}
```

`src/components/PairCard.tsx`:

```tsx
import type { MinimalPair } from "@/content/sounds";
import { audioUrlFor } from "@/lib/audio";
import { playSequence } from "@/lib/play-sequence";
import { AudioButton } from "./AudioButton";

export function PairCard({ pair }: { pair: MinimalPair }) {
  const anyAudio = pair.words.some((w) => audioUrlFor(w.yoruba));
  return (
    <article className="card" data-testid={`pair-${pair.id}`} style={{ display: "grid", gap: "0.5rem" }}>
      <p style={{ margin: 0 }}>{pair.explain}</p>
      <ul className="sound-examples">
        {pair.words.map((w) => (
          <li key={w.yoruba} className="with-audio">
            <span className="yo"><strong>{w.yoruba}</strong></span>
            <span className="muted">{w.english}</span>
            <AudioButton text={w.yoruba} />
          </li>
        ))}
      </ul>
      {anyAudio && (
        <div>
          <button className="btn" onClick={() => void playSequence(pair.words.map((w) => w.yoruba))}>Play all</button>
        </div>
      )}
    </article>
  );
}
```

`src/components/SoundPractice.tsx`:

```tsx
import { useMemo, useState } from "react";
import type { MinimalPair } from "@/content/sounds";
import { buildPractice } from "@/lib/sound-practice";
import { AudioButton } from "./AudioButton";
import { ChoiceQuestion } from "./ChoiceQuestion";

export function SoundPractice({ pairs }: { pairs: MinimalPair[] }) {
  const [attempt, setAttempt] = useState(0);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const questions = useMemo(() => buildPractice(pairs, `sounds#${attempt}`), [pairs, attempt]);

  if (questions.length === 0) {
    return <p className="muted" data-testid="practice">Listening practice needs audio, which is still being added. Check back soon.</p>;
  }
  const done = index >= questions.length;
  if (done) {
    return (
      <section className="card" data-testid="practice" style={{ display: "grid", gap: "0.75rem" }}>
        <p className="yo" style={{ margin: 0 }}>You got {score} of {questions.length} right.</p>
        <div>
          <button className="btn" onClick={() => { setAttempt((a) => a + 1); setIndex(0); setScore(0); setChosen(null); }}>Try again</button>
        </div>
      </section>
    );
  }
  const q = questions[index]!;
  return (
    <section className="card" data-testid="practice" style={{ display: "grid", gap: "0.75rem" }}>
      <p className="muted" style={{ margin: 0 }}>Question {index + 1} of {questions.length}</p>
      <div className="with-audio">
        <span>Listen, then pick the word you heard.</span>
        <AudioButton text={q.audioText} />
      </div>
      <ChoiceQuestion
        key={q.id}
        prompt="Which word did you hear?"
        choices={q.choices}
        chosen={chosen}
        correct={q.answer}
        onChoose={(c) => { setChosen(c); if (c === q.answer) setScore((s) => s + 1); }}
      />
      {chosen !== null && (
        <div>
          <button className="btn btn-primary" onClick={() => { setIndex((i) => i + 1); setChosen(null); }}>
            {index + 1 === questions.length ? "See score" : "Next"}
          </button>
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Page** (`src/pages/SoundBank.tsx`)

```tsx
import { Hero } from "@/components/Hero";
import { PairCard } from "@/components/PairCard";
import { SoundCard } from "@/components/SoundCard";
import { SoundPractice } from "@/components/SoundPractice";
import { MINIMAL_PAIRS, soundsBySection } from "@/content/sounds";

const SECTIONS = ["Vowels", "Consonants", "Tones", "Minimal pairs", "Practice"] as const;
const anchor = (name: string) => name.toLowerCase().replace(" ", "-");

export function SoundBank() {
  return (
    <>
      <h1 className="sr-only">Sound Bank</h1>
      <Hero first="Sound Bank," second="hear every sound" />
      <main className="page" style={{ display: "grid", gap: "1.5rem" }}>
        <nav aria-label="Sections" className="jump-bar">
          {SECTIONS.map((name) => <a key={name} href={`#${anchor(name)}`}>{name}</a>)}
        </nav>
        {(["vowels", "consonants", "tones"] as const).map((section) => (
          <section key={section} id={section} style={{ display: "grid", gap: "0.75rem" }}>
            <h2 style={{ margin: 0 }}>{section[0]!.toUpperCase() + section.slice(1)}</h2>
            <div className="sound-grid rise-in">
              {soundsBySection(section).map((s) => <SoundCard key={s.id} sound={s} />)}
            </div>
          </section>
        ))}
        <section id="minimal-pairs" style={{ display: "grid", gap: "0.75rem" }}>
          <h2 style={{ margin: 0 }}>Minimal pairs</h2>
          <p className="muted" style={{ margin: 0 }}>Words that differ only in one tone or sound. Listen for the difference.</p>
          <div className="sound-grid">{MINIMAL_PAIRS.map((p) => <PairCard key={p.id} pair={p} />)}</div>
        </section>
        <section id="practice" style={{ display: "grid", gap: "0.75rem" }}>
          <h2 style={{ margin: 0 }}>Practice</h2>
          <SoundPractice pairs={MINIMAL_PAIRS} />
        </section>
      </main>
    </>
  );
}
```

`Hero` renders an `<h1>`; the page-level test asserts `level: 1, name: /Sound Bank/`. Read `src/components/Hero.tsx` first: if it already renders the h1 with accessible name "Sound Bank, hear every sound", delete the extra `<h1 className="sr-only">` line above (one h1 only) and if `.sr-only` does not exist in `styles.css`, do not add it.

- [ ] **Step 5: Route, nav, Home link, CSS.**
  - `src/router.tsx`: `import { SoundBank } from "@/pages/SoundBank";` and add `createRoute({ getParentRoute: () => rootRoute, path: "/sounds", component: SoundBank }),` after the vocab routes.
  - `Layout.tsx`: add `<Link to="/sounds">Sound Bank</Link>` between Vocab and About.
  - `Home.tsx`: after the Vocab card add an identical card: `<Link to="/sounds" className="card" style={{ display: "grid", textDecoration: "none", color: "var(--text)" }}><strong>Sound Bank</strong><span className="muted">Every vowel, consonant and tone, with audio and listening practice.</span></Link>`.
  - `src/styles.css` (append, outside any `@media` block):

```css
.jump-bar { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.jump-bar a { border: 2px solid var(--line); border-radius: 999px; padding: 0.2rem 0.8rem; text-decoration: none; color: var(--text); font-weight: 600; }
.jump-bar a:hover { border-color: var(--gold); }
.sound-grid { display: grid; gap: 0.75rem; grid-template-columns: 1fr; }
@media (min-width: 40rem) { .sound-grid { grid-template-columns: repeat(2, 1fr); } }
.sound-card { display: grid; gap: 0.75rem; }
.sound-head { display: flex; gap: 1rem; align-items: center; }
.sound-letter { font-family: "Fraunces Variable", serif; font-size: 2.5rem; line-height: 1; min-width: 3.5rem; text-align: center; color: var(--gold-text); }
.sound-examples { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
```
  If an `@media (min-width: 40rem)` rule on its own line is not already the repo's style, keep it as shown; after saving, check the dev server output at `/private/tmp/claude-501/-Users-zacharyrosen/5f0ad200-2aca-48ad-8a9c-8de64dcb5a63/tasks/bke1oetd0.output` for "Internal server error".

- [ ] **Step 6: Verify**

Run: `npx vitest run src/pages/SoundBank.test.tsx && npx tsc --noEmit && npm run build`
Expected: PASS, clean, build OK. Then run the full unit suite `npx vitest run` and confirm the only failures, if any, are tests that count nav links or Home cards; update those assertions to include the new link.

---

### Task 6: Review file, e2e and final verification

**Files:**
- Modify: `src/lib/review.ts`, `src/lib/review.test.ts`, `scripts/generate-review.ts`
- Create: `e2e/sounds.spec.ts`

**Interfaces:**
- Consumes: `SOUNDS`, `MINIMAL_PAIRS` (Task 1).
- Produces: `buildReviewMarkdown(levels, vocabLevels = [], sounds?: { sounds: Sound[]; pairs: MinimalPair[] })`.

- [ ] **Step 1: Failing test.** Append to `src/lib/review.test.ts` (import `Sound`, `MinimalPair` types):

```ts
describe("buildReviewMarkdown sound bank", () => {
  const sounds = {
    sounds: [{ id: "c-sh", section: "consonants", letter: "ṣ", compare: "like 'sh' in 'ship'", confidence: "needs-review", note: "Check.",
      examples: [{ yoruba: "aṣọ", english: "cloth" }, { yoruba: "ṣòkòtò", english: "trousers" }] }] as Sound[],
    pairs: [{ id: "p-oko", contrast: "tone", explain: "x", confidence: "needs-review", note: "Tone doubt.",
      words: [{ yoruba: "ọkọ", english: "husband" }, { yoruba: "ọkọ̀", english: "vehicle" }] }] as MinimalPair[],
  };
  it("adds a Sound Bank section and counts its items", () => {
    const md = buildReviewMarkdown(levels, [], sounds);
    expect(md).toContain("## Sound Bank");
    expect(md).toContain("`c-sh`");
    expect(md).toContain("aṣọ (cloth)");
    expect(md).toContain("Doubt: Tone doubt.");
    expect(md).toMatch(/\d+ items? need review/);
  });
  it("omits the section when no sound data is given", () => {
    expect(buildReviewMarkdown(levels, [])).not.toContain("## Sound Bank");
  });
});
```

- [ ] **Step 2: Run:** `npx vitest run src/lib/review.test.ts` → FAIL.

- [ ] **Step 3: Implement.** In `review.ts` add `import type { MinimalPair, Sound } from "@/content/sounds";`, change the signature to `buildReviewMarkdown(levels: Level[], vocabLevels: VocabLevel[] = [], soundData?: { sounds: Sound[]; pairs: MinimalPair[] })`, and after `vocabSection` is built:

```ts
  const soundLines: string[] = [];
  if (soundData) {
    for (const x of soundData.sounds.filter((s) => s.confidence === "needs-review")) {
      total += 1;
      soundLines.push(`- \`${x.id}\`: **${x.letter}** (${x.section}): ${x.compare}`);
      soundLines.push(`  - Examples: ${x.examples.map((e) => `${e.yoruba} (${e.english})`).join(", ")}`);
      soundLines.push(`  - Doubt: ${x.note ?? "(none recorded)"}`);
    }
    for (const p of soundData.pairs.filter((q) => q.confidence === "needs-review")) {
      total += 1;
      soundLines.push(`- \`${p.id}\`: minimal pair (${p.contrast}): ${p.explain}`);
      soundLines.push(`  - Words: ${p.words.map((e) => `${e.yoruba} (${e.english})`).join(", ")}`);
      soundLines.push(`  - Doubt: ${p.note ?? "(none recorded)"}`);
    }
  }
  const soundSection = soundLines.length ? ["## Sound Bank", "", ...soundLines, ""] : [];
```
and return `[...header, ...lines, ...vocabSection, ...soundSection, ...all]`. (`total` is read after this block because `header` is built after the vocab section; place the new block before the `const header` line.) In `scripts/generate-review.ts` pass `{ sounds: SOUNDS, pairs: MINIMAL_PAIRS }` as the third argument (add the import).

- [ ] **Step 4: Playwright** (`e2e/sounds.spec.ts`)

```ts
import { expect, test } from "@playwright/test";

test("Sound Bank is reachable from the nav and shows every section", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Sound Bank" }).first().click();
  await expect(page).toHaveURL(/\/sounds$/);
  for (const name of ["Vowels", "Consonants", "Tones", "Minimal pairs", "Practice"]) {
    await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  await expect(page.getByRole("heading", { name: "ṣ", exact: true })).toBeVisible();
});

test("Sound Bank works in dark mode and jump links move to a section", async ({ page }) => {
  await page.goto("/sounds");
  await page.getByRole("button", { name: /Switch to dark mode/ }).click();
  await page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Tones" }).click();
  await expect(page).toHaveURL(/#tones$/);
  await expect(page.getByRole("heading", { level: 2, name: "Tones" })).toBeInViewport();
});

test("practice shows a friendly message or a working quiz", async ({ page }) => {
  await page.goto("/sounds");
  const practice = page.getByTestId("practice");
  await expect(practice).toBeVisible();
  const choices = practice.getByTestId("choice");
  if (await choices.count()) {
    await choices.first().click();
    await expect(practice.locator('[data-state="correct"]')).toHaveCount(1);
  } else {
    await expect(practice).toContainText("audio");
  }
});
```
If the Hero's default heading text makes `getByRole("heading", { name: "ṣ", exact: true })` ambiguous (card `h3` is `ṣ`; the letter span is `aria-hidden`), keep it; if the test fails on a real ambiguity, scope it to `page.locator("#consonants")`.

- [ ] **Step 5: Full verification**

Run, in order: `npx vitest run`, `npx tsc --noEmit`, `npm run validate`, `npm run review` (confirm `content/REVIEW.md` has a `## Sound Bank` section), `npm run build`, `npx playwright test`, and `grep -rnP '\x{2014}' src e2e scripts content/REVIEW.md docs/superpowers`. Confirm the dev-server output has no "Internal server error". Take real screenshots of `http://localhost:5173/sounds` (light and dark, top of page plus the Minimal pairs and Practice sections, desktop and a 390px-wide phone) with Playwright into the scratchpad directory for the owner to review before any commit.
Expected: everything green, zero em dashes, REVIEW updated, screenshots taken and shown to the owner.

- [ ] **Step 6: Hand off audio generation (owner action, no commit).** Run `npm run audio:list`, then `tools/audio/.venv/bin/python tools/audio/prepare_paste.py --group sound-word --no-test`, and report to the owner the number of parts and total characters (credits). The owner generates the parts in the ElevenLabs web tool and saves them named `line-part-N.mp3`; then follow the existing routine (copy as `part-N.mp3` plus `order.json` into a new work folder, dry-run, `split_clips.py --parts-dir <work> --by-punctuation --min-gap 0.2`, make a listening folder, run tests). Until then the page shows words without speaker buttons and Practice shows its "audio coming soon" message.
