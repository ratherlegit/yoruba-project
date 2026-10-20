import { Link } from "@tanstack/react-router";

export function LockedLevel({ levelTitle, prevTitle }: { levelTitle: string; prevTitle: string }) {
  return (
    <main className="page">
      <div className="card" style={{ display: "grid", gap: "0.75rem" }}>
        <h1 style={{ margin: 0 }}>{levelTitle} is locked</h1>
        <p style={{ margin: 0 }}>Finish all of {prevTitle} to open this level, or turn on "Unlock all levels" on the Grammar page.</p>
        <Link className="btn btn-primary" to="/grammar">Back to Grammar</Link>
      </div>
    </main>
  );
}
