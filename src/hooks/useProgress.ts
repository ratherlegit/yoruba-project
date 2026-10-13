import { useCallback, useEffect, useSyncExternalStore } from "react";
import { emptyProgress, loadProgress, saveProgress, type Progress } from "@/lib/progress";
import { applyTheme } from "@/lib/theme";

type Snapshot = { progress: Progress; loaded: boolean };

// One shared in-memory store. Storage is read once on first client use and written
// through best-effort, so blocked storage still behaves correctly within a session.
const initial: Snapshot = { progress: emptyProgress, loaded: false };
let snapshot: Snapshot = initial;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function ensureLoaded() {
  if (snapshot.loaded) return;
  const p = loadProgress();
  snapshot = { progress: p, loaded: true };
  applyTheme(p.theme);
  emit();
}

function updateProgress(fn: (p: Progress) => Progress) {
  ensureLoaded();
  const next = fn(snapshot.progress);
  snapshot = { progress: next, loaded: true };
  saveProgress(next);
  applyTheme(next.theme);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => initial;

export function __resetProgressStoreForTests() {
  snapshot = initial;
  listeners.clear();
}

export function useProgress() {
  // Starts empty and loads in an effect so server and client first renders match.
  const { progress, loaded } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    ensureLoaded();
  }, []);
  const update = useCallback((fn: (p: Progress) => Progress) => updateProgress(fn), []);
  return { progress, update, loaded };
}
