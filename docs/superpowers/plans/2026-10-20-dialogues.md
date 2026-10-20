# Dialogues Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (the author chose native execution). Steps use checkbox syntax.

**Goal:** A Dialogues section: realistic two-person conversations at the five levels, read with English alongside, heard line by line in two voices (female and male), followed by a few comprehension questions.

**Architecture:** Typed content in `src/content/dialogues.ts` (levels, situations, conversations) with a validator, voice-aware audio lookup (the female voice keeps the existing plain keys, the male voice uses a `male|` key prefix in the same manifest, so the existing clip tools work unchanged), two pages (`/dialogues`, `/dialogues/$dialogueId`), an eighth landing card with a new icon, a nav link. No stats, no database.

**Tech Stack:** TypeScript, React, TanStack Router, Vitest + Testing Library, Playwright, the existing ElevenLabs paste-and-split audio tools.

**Spec:** none written, by the author's choice. The design was agreed in chat on 2026-10-20 and is recorded in the Global Constraints below.

## Global Constraints

- Five levels (`getting-started`, `beginner`, `intermediate`, `advanced`, `mastery`), each with situations, each situation with conversations. The structure takes any number; the first release has one situation per level and three conversations per situation (15 conversations). The author plans to grow to three situations per level later.
- First-release situations: Getting Started "Meeting someone"; Beginner "At the market"; Intermediate "Getting around"; Advanced "Visiting a friend's home"; Mastery "Talking with an elder".
- Each conversation: two named speakers, one with the female voice and one with the male voice; 3 to 12 lines (early levels shorter: Getting Started 4 to 6, Beginner 6 to 8, higher levels 8 to 10); 2 to 5 multiple-choice comprehension questions in English.
- Each line has Yoruba (tone marks and dots included, NFC) and English. Lines reuse words and patterns the learner has met at that level, plus a few new ones.
- All Yoruba is written by the author of this code with no published source, so every conversation is `confidence: "needs-review"` with a `source` saying so and a `note` naming the doubts, and is listed in `content/REVIEW.md` (`npm run review`).
- The page reads and works with no audio at all. A Listen button shows only for a line that has a clip. Play all plays the lines that have clips, in order, each in its speaker's voice.
- Voices: female is the existing ElevenLabs "Olufunmilola"; male is the ElevenLabs voice "Yomi". Clips are made by the author in ElevenLabs with `tools/audio` and `npm run audio:list`. Male clip keys are `male|` plus the audio key of the line.
- No em dashes (`src/no-em-dash.test.ts`), no eyebrow labels, no environmental impact figures. No stray `ɡ` (U+0261).
- The landing icon (two facing stools, àga, from the agreed pool) must be shown to the author as a screenshot before merge. Do not merge or push without the author's go-ahead.

## Review Focus

- A conversation with no clips at all still reads fully and shows no Listen or Play all button.
- Play all with clips for only some lines plays those and skips the rest without stopping.
- A female line and a male line with identical text use different clips.
- An unknown dialogue id shows a not-found card with a way back.
- Hiding the English still leaves the questions usable.

---

### Task 1: Dialogue content, validator and review list

**Files:**
- Create: `src/content/dialogues.ts`, `src/content/validate-dialogues.ts`, `src/content/validate-dialogues.test.ts`, `src/content/dialogues-data.test.ts`
- Modify: `scripts/validate-content.ts`, `scripts/generate-review.ts`, `src/lib/review.ts` (+ `src/lib/review.test.ts`)

**Interfaces:**
- Produces: `type Voice = "female" | "male"`; `type DialogueLine = { speaker: string; voice: Voice; yoruba: string; english: string }`; `type DialogueQuestion = { prompt: string; choices: string[]; answer: string }`; `type Situation = { id: string; level: LevelId; title: string; summary: string }`; `type Dialogue = { id: string; level: LevelId; situationId: string; title: string; setting: string; lines: DialogueLine[]; questions: DialogueQuestion[]; source: string; confidence: Confidence; note: string }`; `SITUATIONS: Situation[]`; `DIALOGUES: Dialogue[]`; `validateDialogues(situations, dialogues): string[]`; `buildReviewMarkdown(..., dialogues: Dialogue[] = [])` gains a trailing parameter and a "Dialogues" section.

- [ ] **Step 1: Write failing validator tests:** a valid dialogue passes; errors for duplicate id, unknown situationId, level not matching the situation's, a dialogue whose speakers do not have exactly one female and one male voice, fewer than 3 or more than 12 lines, empty Yoruba or English, a question with fewer than 2 or more than 4 choices, duplicate choices, an answer not among the choices, 0 or more than 5 questions, non-NFC, em dash, U+0261, missing source, needs-review without a note.
- [ ] **Step 2:** Run it. Expected: FAIL (module missing).
- [ ] **Step 3:** Implement the types and `validateDialogues`.
- [ ] **Step 4:** Run it. Expected: PASS.
- [ ] **Step 5: Write `dialogues-data.test.ts`:** `validateDialogues(SITUATIONS, DIALOGUES)` is empty; there are five situations (one per level) and 15 dialogues, three per situation; line counts within each level's range from the Global Constraints; every dialogue is needs-review. Run it. Expected: FAIL (no data).
- [ ] **Step 6:** Write the five situations and 15 dialogues with questions.
- [ ] **Step 7:** Add the review section, wire the validator into `scripts/validate-content.ts`, run `npm run review`, then `npx vitest run && npm run validate`. Expected: pass. Commit.

### Task 2: Two-voice audio plumbing

**Files:**
- Modify: `src/lib/audio.ts` (+ `audio.test.ts`), `src/lib/audio-strings.ts` (+ `audio-strings.test.ts`), `scripts/list-audio-strings.ts`, `src/components/AudioButton.tsx` (+ `AudioButton.test.tsx`), `src/lib/play-sequence.ts` (+ test), `tools/audio/prepare_paste.py`, `tools/audio/README.md`

**Interfaces:**
- Consumes: `Dialogue`, `Voice` from Task 1.
- Produces: `voiceKey(text: string, voice: Voice = "female"): string` (female is `audioKey(text)`, male is `` `male|${audioKey(text)}` ``); `audioUrlFor(text: string, voice: Voice = "female"): string | null`; `collectDialogueAudioStrings(dialogues): { key: string; text: string; group: "dialogue-female" | "dialogue-male" }[]`; `AudioButton` gains an optional `voice?: Voice`; `playSequence(items: { text: string; voice: Voice }[] | string[], opts)` keeps working with plain strings.

- [ ] **Step 1: Write failing tests:** `voiceKey("Ẹ káàárọ̀", "male")` is `male|ẹ káàárọ̀`; female equals `audioKey`; `audioUrlFor` with a male voice looks up the prefixed key and never falls back to the female clip; `collectDialogueAudioStrings` returns each line once per voice, with the right group, and skips one-letter strings; `AudioButton` with `voice="male"` renders only when the prefixed key exists; `playSequence` plays `{text, voice}` items with a lookup that receives the voice.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement the above. In `scripts/list-audio-strings.ts` add the dialogue strings after the existing groups (a female dialogue line whose key already exists is dropped as a duplicate). In `tools/audio/prepare_paste.py` add `"dialogue-female"` and `"dialogue-male"` to `GROUPS`. Document the male-voice workflow in the README (choose the Yomi voice in the web tool, run `prepare_paste.py --group dialogue-male`, split as usual).
- [ ] **Step 4:** Run `npx vitest run`, `npm run audio:list`, `npx tsc --noEmit -p .`. Expected: pass. Commit.

### Task 3: Dialogue pages, routes and nav

**Files:**
- Create: `src/pages/Dialogues.tsx`, `src/pages/Dialogue.tsx`, `src/pages/Dialogues.test.tsx`
- Modify: `src/router.tsx`, `src/components/Layout.tsx`, `src/styles.css`

**Interfaces:**
- Consumes: `SITUATIONS`, `DIALOGUES`, `AudioButton` with `voice`, `playSequence`, `ChoiceQuestion`, `LEVELS` titles from Task 1 and 2.
- Produces: routes `/dialogues` and `/dialogues/$dialogueId`.

- [ ] **Step 1: Write failing tests** (router-based like `Songs.test.tsx`): `/dialogues` lists the five levels in order with their situation and its three conversations, each linking to `/dialogues/<id>`; a dialogue page shows the title, the setting, every line with its speaker name, Yoruba and English; a "Hide English" toggle hides the English lines and shows "Show English"; with no clips there is no Listen or Play all button; with a mocked manifest containing clips for some lines, Listen shows only on those lines (and for the male lines only with the `male|` key), and Play all is shown; the questions render with choices, choosing one marks it right or wrong and shows the answer; an unknown id shows "We couldn't find that conversation" with a link "Back to Dialogues"; the nav has "Dialogues".
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement the pages, routes, nav link and styles (reuse `card`, `yo`, `muted`, `row-card`; a speaker label in bold; the male and female lines distinguished by alignment or tint, not by colour alone).
- [ ] **Step 4:** Run `npx vitest run`. Expected: PASS. Commit.

### Task 4: Landing card, icon, e2e and screenshots

**Files:**
- Modify: `src/components/ActivityIcon.tsx` (+ test), `src/pages/Home.tsx` (+ `Home.test.tsx`), `e2e/landing-stats.spec.ts`
- Create: `e2e/dialogues.spec.ts`

**Interfaces:**
- Consumes: routes from Task 3. Produces: `ActivityId` gains `"dialogues"`.

- [ ] **Step 1: Write failing tests:** `ActivityIcon` renders a distinct drawing for `dialogues`; Home shows eight cards with "Dialogues" last, linking to `/dialogues`, with no progress line; e2e: landing card to a dialogue page, read a line, hide the English, answer a question, no horizontal scroll at phone width on the index and a dialogue page.
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Draw the two-stools icon in the existing line style, add the card and the e2e spec. Update the icon file's header comment.
- [ ] **Step 4:** Run `npx vitest run`, `npx tsc --noEmit -p .`, `npm run validate`, `npx playwright test`. Expected: all pass. Commit.
- [ ] **Step 5:** Take screenshots (landing light and dark, index, a conversation, phone width) to `.screenshots/` for the author.
