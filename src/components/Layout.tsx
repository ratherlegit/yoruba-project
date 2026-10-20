import { Link, Outlet } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

export function Layout() {
  return (
    <div className="shell">
      <header className="site-header">
        <div className="header-bar">
          <Link to="/" className="brand">Yoruba Project</Link>
          <nav className="header-nav">
            <Link to="/grammar">Grammar</Link>
            <Link to="/vocab">Vocab</Link>
            <Link to="/numbers">Numbers</Link>
            <Link to="/sounds">Sound Bank</Link>
            <Link to="/proverbs">Proverbs</Link>
            <Link to="/songs">Songs</Link>
            <Link to="/dialogues">Dialogues</Link>
            <Link to="/transform">Transform</Link>
            <Link to="/stats">Stats</Link>
            <Link to="/about">About</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <div className="shell-main"><Outlet /></div>
      <footer className="site-footer">
        <div className="page">
          <strong>Yoruba Project</strong>
          <p className="muted" style={{ margin: "0.25rem 0 0" }}>Learn Yoruba from zero, with tone marks and audio.</p>
        </div>
      </footer>
    </div>
  );
}
