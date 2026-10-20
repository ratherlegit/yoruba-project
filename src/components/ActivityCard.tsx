import { Link } from "@tanstack/react-router";
import { ActivityIcon, type ActivityId } from "./ActivityIcon";

export function ActivityCard({ activity, to, title, description, progress }: {
  activity: ActivityId;
  to: string;
  title: string;
  description: string;
  progress?: string;
}) {
  return (
    <Link to={to} className="card activity-card" data-testid="activity-card">
      <ActivityIcon activity={activity} size="lg" />
      <span className="activity-text">
        <strong>{title}</strong>
        <span className="muted">{description}</span>
        {progress && <span className="activity-progress" data-testid="card-progress">{progress}</span>}
      </span>
    </Link>
  );
}
