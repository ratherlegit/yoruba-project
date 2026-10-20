import { useCallback, useEffect, useSyncExternalStore } from "react";
import { emptyStats, loadStats, saveStats, type Stats } from "@/lib/stats";

type Snapshot = { stats: Stats; loaded: boolean };

// One shared in-memory store. Storage is read once on first client use and written
// through best-effort, so blocked storage still behaves correctly within a session.
const initial: Snapshot = { stats: emptyStats, loaded: false };
let snapshot: Snapshot = initial;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function ensureLoaded() {
  if (snapshot.loaded) return;
  snapshot = { stats: loadStats(), loaded: true };
  emit();
}

function updateStats(fn: (s: Stats) => Stats) {
  ensureLoaded();
  const next = fn(snapshot.stats);
  snapshot = { stats: next, loaded: true };
  saveStats(next);
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

export function __resetStatsStoreForTests() {
  snapshot = initial;
  listeners.clear();
}

export function useStats() {
  // Starts empty and loads in an effect so server and client first renders match.
  const { stats, loaded } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  useEffect(() => {
    ensureLoaded();
  }, []);
  const update = useCallback((fn: (s: Stats) => Stats) => updateStats(fn), []);
  return { stats, update, loaded };
}
