import { mkdirSync, writeFileSync } from "node:fs";
import { LEVELS } from "../src/content/levels";
import { VOCAB_LEVELS } from "../src/content/vocab";
import { SOUNDS, MINIMAL_PAIRS } from "../src/content/sounds";
import { TONE_TWINS } from "../src/content/tone-twins";
import { buildReviewMarkdown } from "../src/lib/review";

mkdirSync("content", { recursive: true });
writeFileSync("content/REVIEW.md", buildReviewMarkdown(LEVELS, VOCAB_LEVELS, { sounds: SOUNDS, pairs: MINIMAL_PAIRS }, TONE_TWINS));
console.log("Wrote content/REVIEW.md");
