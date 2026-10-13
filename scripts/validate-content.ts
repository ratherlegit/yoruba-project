import { LEVELS } from "../src/content/levels";
import { validateLesson } from "../src/content/validate";

let failed = 0;
let count = 0;
for (const level of LEVELS) {
  for (const lesson of level.lessons) {
    count++;
    for (const e of validateLesson(lesson)) {
      console.error(e);
      failed++;
    }
  }
}
if (failed) {
  console.error(`\n${failed} problem(s) in ${count} lesson(s).`);
  process.exit(1);
}
console.log(`OK: ${count} lesson(s) valid.`);
