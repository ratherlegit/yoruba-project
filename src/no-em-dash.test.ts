import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const EM_DASH = "—";

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}

describe("copy rules", () => {
  it("has no em dashes in src", () => {
    const offenders = files("src")
      .filter((f) => /\.(ts|tsx|css)$/.test(f) && !f.endsWith("no-em-dash.test.ts"))
      .filter((f) => readFileSync(f, "utf8").includes(EM_DASH));
    expect(offenders).toEqual([]);
  });
});
