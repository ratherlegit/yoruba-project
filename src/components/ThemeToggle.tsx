import { useProgress } from "@/hooks/useProgress";
import type { ThemeChoice } from "@/lib/progress";

const OPTIONS: ThemeChoice[] = ["system", "light", "dark"];

export function ThemeToggle() {
  const { progress, update } = useProgress();
  return (
    <label className="muted" style={{ display: "inline-flex", gap: "0.4rem", alignItems: "center" }}>
      Theme
      <select
        value={progress.theme}
        onChange={(e) => update((p) => ({ ...p, theme: e.target.value as ThemeChoice }))}
        style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "0.5rem", minHeight: "2.5rem", padding: "0 0.5rem" }}
      >
        {OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
