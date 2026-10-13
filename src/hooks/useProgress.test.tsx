import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { isLevelUnlocked, recordCompletion } from "@/lib/progress";
import { LEVELS } from "@/content/levels";
import { useProgress } from "./useProgress";

const throwingStorage: Storage = {
  length: 0,
  clear() { throw new Error("blocked"); },
  getItem() { throw new Error("blocked"); },
  key() { throw new Error("blocked"); },
  removeItem() { throw new Error("blocked"); },
  setItem() { throw new Error("blocked"); },
};

describe("useProgress with blocked storage", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", throwingStorage);
    document.documentElement.removeAttribute("data-theme");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reports loaded after the first load", () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.loaded).toBe(true);
  });

  it("keeps skipAhead in memory so levels unlock", () => {
    const { result } = renderHook(() => useProgress());
    act(() => result.current.update((p) => ({ ...p, skipAhead: true })));
    expect(result.current.progress.skipAhead).toBe(true);
    expect(isLevelUnlocked(LEVELS, result.current.progress, "advanced")).toBe(true);
  });

  it("accumulates completions across updates", () => {
    const { result } = renderHook(() => useProgress());
    act(() => result.current.update((p) => recordCompletion(p, "gs-1", 1)));
    act(() => result.current.update((p) => recordCompletion(p, "gs-2", 0.5)));
    expect(Object.keys(result.current.progress.completedLessons).sort()).toEqual(["gs-1", "gs-2"]);
  });

  it("keeps a chosen theme after a later completion", () => {
    const { result } = renderHook(() => useProgress());
    act(() => result.current.update((p) => ({ ...p, theme: "dark" })));
    act(() => result.current.update((p) => recordCompletion(p, "gs-1", 1)));
    expect(result.current.progress.theme).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("shares state between two consumers", () => {
    let update!: ReturnType<typeof useProgress>["update"];
    function A() {
      update = useProgress().update;
      return null;
    }
    function B() {
      return <p>{useProgress().progress.skipAhead ? "skip on" : "skip off"}</p>;
    }
    render(<><A /><B /></>);
    expect(screen.getByText("skip off")).toBeInTheDocument();
    act(() => update((p) => ({ ...p, skipAhead: true })));
    expect(screen.getByText("skip on")).toBeInTheDocument();
  });
});
