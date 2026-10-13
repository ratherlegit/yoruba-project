import { useCallback, useEffect, useState } from "react";
import { emptyProgress, loadProgress, saveProgress, type Progress } from "@/lib/progress";
import { applyTheme } from "@/lib/theme";

// Starts empty and loads in an effect so server and client first renders match.
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(emptyProgress);

  useEffect(() => {
    const p = loadProgress();
    setProgress(p);
    applyTheme(p.theme);
  }, []);

  const update = useCallback((fn: (p: Progress) => Progress) => {
    // Reload first so a theme change made elsewhere is never overwritten by stale state.
    const next = fn(loadProgress());
    saveProgress(next);
    applyTheme(next.theme);
    setProgress(next);
  }, []);

  return { progress, update };
}
