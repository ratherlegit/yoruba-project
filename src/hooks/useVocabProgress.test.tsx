import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { recordVocabCompletion, topicsDone } from "@/lib/vocab-progress";
import { __resetVocabProgressStoreForTests, useVocabProgress } from "./useVocabProgress";

describe("useVocabProgress", () => {
  beforeEach(() => {
    localStorage.clear();
    __resetVocabProgressStoreForTests();
  });
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("reports loaded after the first load", () => {
    const { result } = renderHook(() => useVocabProgress());
    expect(result.current.loaded).toBe(true);
    expect(result.current.progress).toEqual({ topics: {} });
  });

  it("shares state between two consumers", () => {
    let update!: ReturnType<typeof useVocabProgress>["update"];
    function A() {
      update = useVocabProgress().update;
      return null;
    }
    function B() {
      return <p>done: {topicsDone(useVocabProgress().progress, ["food"])}</p>;
    }
    render(<><A /><B /></>);
    expect(screen.getByText("done: 0")).toBeInTheDocument();
    act(() => update((p) => recordVocabCompletion(p, "food", "quiz", 1)));
    expect(screen.getByText("done: 1")).toBeInTheDocument();
  });

  it("persists to localStorage under the vocab key only", () => {
    const { result } = renderHook(() => useVocabProgress());
    act(() => result.current.update((p) => recordVocabCompletion(p, "food", "gap", 0.5)));
    expect(localStorage.getItem("yp:vocab-progress:v1")).toContain("food");
    expect(localStorage.getItem("yp:progress:v1")).toBeNull();
  });

  it("keeps working in memory when setItem throws", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    const { result } = renderHook(() => useVocabProgress());
    act(() => result.current.update((p) => recordVocabCompletion(p, "food", "quiz", 1)));
    act(() => result.current.update((p) => recordVocabCompletion(p, "family", "gap", 1)));
    expect(spy).toHaveBeenCalled();
    expect(Object.keys(result.current.progress.topics).sort()).toEqual(["family", "food"]);
  });
});
