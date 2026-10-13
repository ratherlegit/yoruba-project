import { mkdirSync, writeFileSync } from "node:fs";
import { LEVELS } from "../src/content/levels";
import { collectAudioStrings } from "../src/lib/audio-strings";

const strings = collectAudioStrings(LEVELS);
mkdirSync("tools/audio", { recursive: true });
writeFileSync("tools/audio/strings.json", JSON.stringify(strings, null, 2) + "\n");
console.log(`Wrote tools/audio/strings.json (${strings.length} strings)`);
