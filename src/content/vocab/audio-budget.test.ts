import { describe, expect, it } from "vitest";
import manifest from "@/content/audio-manifest.json";
import { LEVELS } from "@/content/levels";
import { audioCost } from "@/lib/audio-cost";
import { collectAudioStrings, collectVocabAudioStrings } from "@/lib/audio-strings";
import { VOCAB_LEVELS } from "./index";

// The owner's ElevenLabs balance on 2026-10-13 (one credit per character pasted).
// The owner generates vocab words first, then sentences in topic order as credits
// allow; a missing clip simply hides the Listen button. So this file is
// informational only and never fails on size.
const OWNER_CREDITS_REMAINING = 8578;

describe("vocab audio cost (informational)", () => {
  const alreadyVoiced = new Set([
    ...collectAudioStrings(LEVELS).map((s) => s.key),
    ...Object.keys(manifest).map((k) => k.normalize("NFC")),
  ]);
  const pending = collectVocabAudioStrings(VOCAB_LEVELS).filter((s) => !alreadyVoiced.has(s.key));
  const cost = (group: string) =>
    pending.filter((s) => s.group === group).reduce((sum, s) => sum + audioCost(s.text), 0);

  it("reports the credits still needed for vocab clips", () => {
    const words = cost("vocab-word");
    const sentences = cost("vocab-sentence");
    const total = words + sentences;
    console.info(
      `vocab audio: ${total} credits (words ${words}, sentences ${sentences}) ` +
        `against ${OWNER_CREDITS_REMAINING} remaining; ${OWNER_CREDITS_REMAINING - total} left over`,
    );
    expect(Number.isInteger(total)).toBe(true);
  });
});
