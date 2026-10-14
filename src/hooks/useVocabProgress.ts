import { useCallback, useEffect, useSyncExternalStore } from "react";
import { emptyVocabProgress, loadVocabProgress, saveVocabProgress, type VocabProgress } from "@/lib/vocab-progress";

type Snapshot = { progress: VocabProgress; loaded: boolean };

// One shared in-memory store. Storage is read once on first client use and written
// through best-effort, so blocked storage still behaves correctly within a session.
const initial: Snapshot = { progress: emptyVocabProgress, loaded: false };
let snapshot: Snapshot = initial;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function ensureLoaded() {
  if (snapshot.loaded) return;
  snapshot = { progress: loadVocabProgress(), loaded: true };
  emit();
}

function updateProgress(fn: (p: VocabProgress) => VocabProgress) {
  ensureLoaded();
  const next = fn(snapshot.progress);
  snapshot = { progress: next, loaded: true };
  saveVocabProgress(next);
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

export function __resetVocabProgressStoreForTests() {
  snapshot = initial;
  listeners.clear();
}

export function useVocabProgress() {
  // Starts empty and loads in an effect so server and client first renders match.
  const { progress, loaded } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    ensureLoaded();
  }, []);
  const update = useCallback((fn: (p: VocabProgress) => VocabProgress) => updateProgress(fn), []);
  return { progress, update, loaded };
}
