import { Link, Outlet } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

export function Layout() {
  return (
    <>
      <header style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div className="page" style={{ padding: "0.75rem 1rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ fontWeight: 700, textDecoration: "none", color: "var(--text)" }}>Yoruba Project</Link>
          <nav style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <Link to="/about">About</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
}
