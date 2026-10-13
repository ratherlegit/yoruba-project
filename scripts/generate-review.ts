import { mkdirSync, writeFileSync } from "node:fs";
import { LEVELS } from "../src/content/levels";
import { buildReviewMarkdown } from "../src/lib/review";

mkdirSync("content", { recursive: true });
writeFileSync("content/REVIEW.md", buildReviewMarkdown(LEVELS));
console.log("Wrote content/REVIEW.md");
