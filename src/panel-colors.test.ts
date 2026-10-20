import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync("src/styles.css", "utf8");

// The custom properties of one theme block, found by its selector.
function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector);
  expect(start, `block ${selector}`).toBeGreaterThanOrEqual(0);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map((m) => [m[1]!, m[2]!.trim()]));
}
const channel = (hex: string, i: number) => {
  const v = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => 0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 1) + 0.0722 * channel(hex, 2);
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

const THEMES: [string, string][] = [
  ["light", ":root {"],
  ["dark", ':root[data-theme="dark"] {'],
];

describe("status panel colours", () => {
  for (const [name, selector] of THEMES) {
    it(`${name}: the panel text, the Best score, the Incomplete label and the tag are all easy to read`, () => {
      const t = block(selector);
      for (const k of ["cell-bg", "cell-text", "cell-done", "cell-todo", "chip-bg", "chip-text"]) expect(t[k], `--${k}`).toMatch(/^#[0-9a-f]{6}$/i);
      expect(contrast(t["cell-text"]!, t["cell-bg"]!)).toBeGreaterThanOrEqual(7);
      expect(contrast(t["cell-done"]!, t["cell-bg"]!)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t["cell-todo"]!, t["cell-bg"]!)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t["chip-text"]!, t["chip-bg"]!)).toBeGreaterThanOrEqual(7);
    });
  }
  it("the panel and the tag use those colours", () => {
    expect(css).toMatch(/\.status-cell \{[^}]*background: var\(--cell-bg\)/);
    expect(css).toMatch(/\.status-cell \{[^}]*color: var\(--cell-text\)/);
    expect(css).toMatch(/\.status-done \{[^}]*color: var\(--cell-done\)/);
    expect(css).toMatch(/\.status-todo \{[^}]*color: var\(--cell-todo\)/);
    expect(css).toMatch(/\.genre-chip \{[^}]*background: var\(--chip-bg\)/);
    expect(css).toMatch(/\.genre-chip \{[^}]*color: var\(--chip-text\)/);
  });
});
