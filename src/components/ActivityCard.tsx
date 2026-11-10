import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ActivityIcon, type ActivityId } from "./ActivityIcon";

// One colour per activity, drawn from Yoruba cloth. Used for the ring and the icon.
const COLOURS: Record<ActivityId, string> = {
  grammar: "#2f4fb3", vocab: "#b8431f", numbers: "#a8741a", sounds: "#17795f",
  proverbs: "#7b3f98", transform: "#1f7a99", songs: "#a23a5a", dialogues: "#5b6b2b",
};

const R = 36;
const C = 2 * Math.PI * R;

// `ring` is only passed when the activity has a real total to measure against.
export function ActivityCard({ activity, to, title, blurb, progress, ring }: {
  activity: ActivityId;
  to: string;
  title: string;
  blurb: string;
  progress?: string;
  ring?: { done: number; total: number };
}) {
  const frac = ring && ring.total > 0 ? Math.min(ring.done / ring.total, 1) : 0;
  return (
    <Link to={to} className="card activity-card" data-testid="activity-card" style={{ "--k": COLOURS[activity] } as CSSProperties}>
      <span className="act-ring">
        <svg className="act-ring-svg" viewBox="0 0 80 80" aria-hidden="true" focusable="false">
          <circle className="act-track" cx="40" cy="40" r={R} />
          {frac > 0 && <circle className="act-fill" cx="40" cy="40" r={R} strokeDasharray={`${C * frac} ${C}`} />}
        </svg>
        <ActivityIcon activity={activity} size="bare" />
      </span>
      <strong>{title}</strong>
      <span className="muted act-blurb">{blurb}</span>
      <span className="activity-progress" data-testid={progress ? "card-progress" : undefined}>{progress ?? "Start here"}</span>
    </Link>
  );
}
