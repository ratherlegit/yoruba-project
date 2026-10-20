import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { recordProverbAnswer, recordToneAnswer } from "@/lib/stats";
import { __resetStatsStoreForTests, useStats } from "./useStats";

describe("useStats", () => {
  beforeEach(() => {
    localStorage.clear();
    __resetStatsStoreForTests();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("starts empty and reports loaded", () => {
    const { result } = renderHook(() => useStats());
    expect(result.current.loaded).toBe(true);
    expect(result.current.stats.days).toEqual([]);
  });

  it("loads saved stats", () => {
    localStorage.setItem("yp:stats:v1", JSON.stringify({ proverbs: { p1: { correct: true } } }));
    const { result } = renderHook(() => useStats());
    expect(result.current.stats.proverbs.p1).toEqual({ correct: true });
  });

  it("shares state between two consumers", () => {
    let update!: ReturnType<typeof useStats>["update"];
    function A() {
      update = useStats().update;
      return null;
    }
    function B() {
      return <p>proverbs: {Object.keys(useStats().stats.proverbs).length}</p>;
    }
    render(<><A /><B /></>);
    expect(screen.getByText("proverbs: 0")).toBeInTheDocument();
    act(() => update((s) => recordProverbAnswer(s, "p1", true)));
    expect(screen.getByText("proverbs: 1")).toBeInTheDocument();
  });

  it("persists under the stats key only", () => {
    const { result } = renderHook(() => useStats());
    act(() => result.current.update((s) => recordToneAnswer(s, "words", true)));
    expect(localStorage.getItem("yp:stats:v1")).toContain("\"answered\":1");
    expect(localStorage.getItem("yp:progress:v1")).toBeNull();
    expect(localStorage.getItem("yp:vocab-progress:v1")).toBeNull();
  });

  it("keeps working in memory when setItem throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { result } = renderHook(() => useStats());
    act(() => result.current.update((s) => recordToneAnswer(s, "words", true)));
    act(() => result.current.update((s) => recordToneAnswer(s, "words", false)));
    expect(result.current.stats.tone.words.answered).toBe(2);
  });
});
