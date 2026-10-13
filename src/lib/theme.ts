import type { ThemeChoice } from "./progress";

export function applyTheme(theme: ThemeChoice, root: HTMLElement = document.documentElement): void {
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}
