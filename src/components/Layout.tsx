import { Link, Outlet } from "@tanstack/react-router";
import { ActivitiesMenu } from "./ActivitiesMenu";
import { ThemeToggle } from "./ThemeToggle";

export function Layout() {
  return (
    <div className="shell">
      <header className="site-header">
        <div className="header-bar">
          <Link to="/" className="brand">Ọgbọ́n</Link>
          <nav className="header-nav">
            <ActivitiesMenu />
            <Link to="/stats">Stats</Link>
            <Link to="/about">About</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <div className="shell-main"><Outlet /></div>
      <footer className="site-footer">
        <div className="page">
          <strong>Ọgbọ́n</strong>
          <p className="muted" style={{ margin: "0.25rem 0 0" }}>Learn Yoruba from zero, with tone marks and audio.</p>
        </div>
      </footer>
    </div>
  );
}
