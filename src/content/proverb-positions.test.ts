import { describe, expect, it } from "vitest";
import { shuffledChoices } from "@/components/ChoiceQuestion";
import { proverbChoices } from "@/lib/proverb-choices";
import { PROVERBS } from "./proverbs";

describe("proverb choice order", () => {
  it("spreads the correct meaning across all three positions on the real content", () => {
    const counts = [0, 0, 0];
    for (const p of PROVERBS) {
      const shown = shuffledChoices("What is this proverb about?", proverbChoices(p), p.meaning);
      counts[shown.indexOf(p.meaning)]!++;
    }
    for (const c of counts) expect(c, `positions: ${counts.join("/")}`).toBeGreaterThanOrEqual(3);
  });
});
