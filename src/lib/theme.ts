import type { ThemeChoice } from "./progress";

export function applyTheme(theme: ThemeChoice, root: HTMLElement = document.documentElement): void {
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
}

// Off adds data-motion="off", which the stylesheet treats like the system "reduce motion" setting.
export function applyMotion(motion: boolean, root: HTMLElement = document.documentElement): void {
  if (motion) root.removeAttribute("data-motion");
  else root.setAttribute("data-motion", "off");
}
