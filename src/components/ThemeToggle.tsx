import { useState } from "react";
import { useProgress } from "@/hooks/useProgress";

function systemPrefersDark(): boolean {
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

// One bulb: lit in light mode, unlit in dark mode. A click switches to the other mode.
export function ThemeToggle() {
  const { progress, update } = useProgress();
  const [fx, setFx] = useState(0);
  const dark = progress.theme === "dark" || (progress.theme === "system" && systemPrefersDark());
  const next = dark ? "light" : "dark";
  return (
    <button
      key={fx}
      className={`bulb${fx ? " fx" : ""}`}
      onClick={() => { setFx((n) => n + 1); update((p) => ({ ...p, theme: next })); }}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      <svg viewBox="0 0 24 24" width="22" height="22" fill={dark ? "none" : "currentColor"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </svg>
    </button>
  );
}
