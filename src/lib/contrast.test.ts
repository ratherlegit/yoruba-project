// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";

const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");

function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`Selector not found in styles.css: ${selector}`);
  const end = css.indexOf("}", start);
  const body = css.slice(start, end);
  const out: Record<string, string> = {};
  for (const m of body.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6});/g)) out[m[1]!] = m[2]!;
  return out;
}

const light = block(":root");
const dark = block(':root[data-theme="dark"]');
const darkViaMedia = block(':root:not([data-theme="light"])');

const PAIRS: [string, string][] = [
  ["text", "bg"],
  ["text", "surface"],
  ["text", "surface-2"],
  ["text-muted", "bg"],
  ["text-muted", "surface"],
  ["accent", "bg"],
  ["accent", "surface"],
  ["on-primary", "primary"],
  ["danger", "bg"],
  ["danger", "surface"],
];

describe("theme tokens", () => {
  it("dark tokens under prefers-color-scheme match the manual dark theme", () => {
    expect(darkViaMedia).toEqual(dark);
  });

  for (const [name, tokens] of [["light", light], ["dark", dark]] as const) {
    describe(name, () => {
      for (const [fg, bg] of PAIRS) {
        it(`${fg} on ${bg} is at least 4.5:1`, () => {
          expect(tokens[fg], `missing token ${fg}`).toBeDefined();
          expect(tokens[bg], `missing token ${bg}`).toBeDefined();
          expect(contrastRatio(tokens[fg]!, tokens[bg]!)).toBeGreaterThanOrEqual(4.5);
        });
      }
    });
  }
});
