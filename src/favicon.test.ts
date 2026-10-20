import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const html = readFileSync("index.html", "utf8");

describe("favicon", () => {
  it("links an SVG icon, a 32px PNG fallback and an Apple touch icon, and the files exist", () => {
    expect(html).toContain('rel="icon" type="image/svg+xml" href="/favicon.svg"');
    expect(html).toContain('rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"');
    expect(html).toContain('rel="apple-touch-icon" href="/apple-touch-icon.png"');
    for (const f of ["favicon.svg", "favicon-32.png", "apple-touch-icon.png"]) expect(existsSync(`public/${f}`), f).toBe(true);
  });
  it("draws the adire cloth (the Grammar icon) on the navy tile with the gold border", () => {
    const svg = readFileSync("public/favicon.svg", "utf8");
    expect(svg).toContain('fill="#14307a"');
    expect(svg).toContain('stroke="#c99a2e"');
    expect(svg).toContain('<path d="M10 10h44v44H10Z"');
    expect(svg).not.toContain('<ellipse cx="32" cy="14"');
  });
  it("has the PNGs at the sizes it names", () => {
    const size = (f: string) => {
      const b = readFileSync(`public/${f}`);
      return [b.readUInt32BE(16), b.readUInt32BE(20)];
    };
    expect(size("favicon-32.png")).toEqual([32, 32]);
    expect(size("apple-touch-icon.png")).toEqual([180, 180]);
  });
});
