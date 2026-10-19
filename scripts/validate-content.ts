import { LEVELS } from "../src/content/levels";
import { validateLesson } from "../src/content/validate";
import { VOCAB_LEVELS } from "../src/content/vocab";
import { validateTopic, validateVocabCatalog } from "../src/content/vocab/validate";
import { MINIMAL_PAIRS, SOUNDS } from "../src/content/sounds";
import { validateSounds } from "../src/content/validate-sounds";
import { TONE_TWINS } from "../src/content/tone-twins";
import { validateToneTwins } from "../src/content/validate-tone-twins";

let failed = 0;
let count = 0;
let vocabCount = 0;
for (const level of LEVELS) {
  for (const lesson of level.lessons) {
    count++;
    for (const e of validateLesson(lesson)) {
      console.error(e);
      failed++;
    }
  }
}
for (const level of VOCAB_LEVELS) {
  for (const topic of level.topics) {
    vocabCount++;
    for (const e of validateTopic(topic)) {
      console.error(e);
      failed++;
    }
  }
}
for (const e of validateVocabCatalog(VOCAB_LEVELS, { complete: true })) {
  console.error(e);
  failed++;
}
for (const e of validateSounds(SOUNDS, MINIMAL_PAIRS)) {
  console.error(e);
  failed++;
}
for (const e of validateToneTwins(TONE_TWINS, VOCAB_LEVELS)) {
  console.error(e);
  failed++;
}
if (failed) {
  console.error(`\n${failed} problem(s) in ${count} lesson(s) and ${vocabCount} vocab topic(s).`);
  process.exit(1);
}
console.log(`OK: ${count} lesson(s), ${vocabCount} vocab topic(s) and ${SOUNDS.length} sound(s) valid.`);
