import { Link } from "@tanstack/react-router";
import { Github, Menu, Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

type NavbarProps = {
  onSearchOpen?: () => void;
  onMenuClick?: () => void;
  showMenu?: boolean;
};

export function Navbar({ onSearchOpen, onMenuClick, showMenu }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        {showMenu && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border lg:hidden"
          >
            <Menu className="h-4 w-4" aria-hidden />
          </button>
        )}
        <Link to="/" className="flex items-center gap-2 text-foreground" aria-label="Lumen home">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-brand text-brand-foreground shadow-[var(--shadow-glow)]">
            <span className="text-xs font-bold">L</span>
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Lumen</span>
          <span className="ml-1 hidden rounded-full border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:inline-block">
            v1.0
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 text-sm md:flex" aria-label="Primary">
          <Link
            to="/docs/$"
            params={{ _splat: "getting-started/introduction" }}
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Documentation
          </Link>
          <Link
            to="/docs/$"
            params={{ _splat: "api/client" }}
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            API
          </Link>
          <Link
            to="/docs/$"
            params={{ _splat: "tutorials/first-app" }}
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            Tutorials
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={onSearchOpen}
            className="group inline-flex h-9 w-9 items-center justify-center rounded-md border border-border/50 bg-background/40 text-sm text-muted-foreground backdrop-blur-md transition-colors hover:bg-accent/50 lg:w-56 lg:justify-start lg:px-3 lg:text-left"
            aria-label="Open search"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="hidden lg:inline">Search docs…</span>
            <kbd className="ml-auto hidden items-center gap-1 rounded border border-border/50 bg-background/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground backdrop-blur-sm lg:inline-flex">
              ⌘K
            </kbd>
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub repository"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-accent"
          >
            <Github className="h-4 w-4" aria-hidden />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
