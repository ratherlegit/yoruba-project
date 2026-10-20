import { describe, expect, it } from "vitest";
import { showBuild } from "./show-build";

describe("showBuild", () => {
  it("reads like arithmetic", () => {
    expect(showBuild("20*2")).toBe("20 × 2");
    expect(showBuild("20*3-10")).toBe("20 × 3 − 10");
    expect(showBuild("10+1")).toBe("10 + 1");
    expect(showBuild("200*5-100")).toBe("200 × 5 − 100");
    expect(showBuild("30-5")).toBe("30 − 5");
  });
});
