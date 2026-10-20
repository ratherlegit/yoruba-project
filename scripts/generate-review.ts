import { mkdirSync, writeFileSync } from "node:fs";
import { LEVELS } from "../src/content/levels";
import { VOCAB_LEVELS } from "../src/content/vocab";
import { SOUNDS, MINIMAL_PAIRS } from "../src/content/sounds";
import { TONE_TWINS } from "../src/content/tone-twins";
import { CONSONANT_SETS, TONE_COMPARE } from "../src/content/sound-focus";
import { PROVERBS } from "../src/content/proverbs";
import { TRANSFORMS } from "../src/content/transforms";
import { NUMBERS, PHRASES } from "../src/content/numbers";
import { SONGS } from "../src/content/songs";
import { buildReviewMarkdown } from "../src/lib/review";

mkdirSync("content", { recursive: true });
writeFileSync("content/REVIEW.md", buildReviewMarkdown(LEVELS, VOCAB_LEVELS, { sounds: SOUNDS, pairs: MINIMAL_PAIRS, compare: TONE_COMPARE, sets: CONSONANT_SETS }, TONE_TWINS, PROVERBS, TRANSFORMS, NUMBERS, PHRASES, SONGS));
console.log("Wrote content/REVIEW.md");
