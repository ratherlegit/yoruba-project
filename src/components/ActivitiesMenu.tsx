import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

const ACTIVITIES = [
  { to: "/grammar", text: "Grammar" },
  { to: "/vocab", text: "Vocab" },
  { to: "/numbers", text: "Numbers" },
  { to: "/sounds", text: "Sound Bank" },
  { to: "/proverbs", text: "Proverbs" },
  { to: "/songs", text: "Songs" },
  { to: "/dialogues", text: "Dialogues" },
  { to: "/transform", text: "Transform" },
] as const;

export function ActivitiesMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="activities-menu" ref={ref}>
      <button type="button" className="activities-button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}>
        Activities <span aria-hidden="true">▾</span>
      </button>
      {open && (
        <ul className="activities-list">
          {ACTIVITIES.map((a) => (
            <li key={a.to}><Link to={a.to}>{a.text}</Link></li>
          ))}
        </ul>
      )}
    </div>
  );
}
