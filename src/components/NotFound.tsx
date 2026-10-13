import { Link } from "@tanstack/react-router";

export function NotFound({ what = "page" }: { what?: string }) {
  return (
    <main className="page">
      <div className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <h1 style={{ margin: 0 }}>We couldn't find that {what}</h1>
        <p className="muted" style={{ margin: 0 }}>The link may be old or mistyped.</p>
        <Link className="btn btn-primary" to="/">Back to home</Link>
      </div>
    </main>
  );
}
