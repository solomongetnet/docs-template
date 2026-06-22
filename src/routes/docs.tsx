import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Github, Menu, PanelLeft, Search, X } from "lucide-react";
import { DocsSidebar } from "@/components/docs-sidebar";
import { SearchDialog, useSearchHotkey } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";

export const Route = createFileRoute("/docs")({
  component: DocsLayout,
});

function SidebarShell({
  onSearchOpen,
  onNavigate,
  onToggle,
}: {
  onSearchOpen: () => void;
  onNavigate?: () => void;
  onToggle?: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-foreground" aria-label="Home">
          <span className="grid h-6 w-6 place-items-center rounded-md border border-border bg-muted text-[10px] font-bold">
            L
          </span>
          <span className="text-[15px] font-semibold tracking-tight">Lumen</span>
        </Link>
        <button
          type="button"
          onClick={onNavigate ?? onToggle}
          aria-label="Toggle sidebar"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <PanelLeft className="h-4 w-4" aria-hidden />
        </button>
      </div>


      <div className="px-3 pb-2">
        <button
          type="button"
          onClick={onSearchOpen}
          className="flex h-9 w-full items-center gap-2 rounded-md border border-border/50 bg-background/40 px-3 text-left text-[13px] text-muted-foreground backdrop-blur-md transition-colors hover:bg-accent/50"
          aria-label="Open search"
        >
          <Search className="h-3.5 w-3.5" aria-hidden />
          <span>Search</span>
          <kbd className="ml-auto inline-flex items-center gap-0.5 rounded border border-border/50 bg-background/60 px-1 py-0.5 font-mono text-[10px] backdrop-blur-sm">
            Ctrl K
          </kbd>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <DocsSidebar onNavigate={onNavigate} />
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Github className="h-4 w-4" aria-hidden />
        </a>
        <ThemeToggle />
      </div>
    </div>
  );
}

function DocsLayout() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useSearchHotkey(setSearchOpen);

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open navigation"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border"
        >
          <Menu className="h-4 w-4" aria-hidden />
        </button>
        <Link to="/" className="flex items-center gap-2 text-foreground">
          <span className="grid h-6 w-6 place-items-center rounded-md border border-border bg-muted text-[10px] font-bold">L</span>
          <span className="text-[15px] font-semibold">Lumen</span>
        </Link>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="Search"
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground"
        >
          <Search className="h-4 w-4" aria-hidden />
        </button>
      </header>

      <div
        className={
          sidebarOpen
            ? "lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-4"
            : "lg:grid lg:grid-cols-[0_minmax(0,1fr)]"
        }
      >
        <aside
          className={
            "sticky top-0 hidden h-dvh border-r border-border transition-[width,opacity] duration-300 lg:block " +
            (sidebarOpen ? "w-60 opacity-100" : "w-0 overflow-hidden opacity-0")
          }
          aria-label="Documentation navigation"
        >
          <SidebarShell
            onSearchOpen={() => setSearchOpen(true)}
            onToggle={() => setSidebarOpen(false)}
          />
        </aside>

        <main id="main" className="relative min-w-0">
          {!sidebarOpen && (
            <div className="sticky top-0 z-20 hidden h-12 items-center gap-2 border-b border-border/60 bg-background/85 px-3 backdrop-blur-xl lg:flex">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Expand sidebar"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <PanelLeft className="h-4 w-4 rotate-180" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Search className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
          <div className="w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

      </div>


      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close navigation"
            className="glass-scrim absolute inset-0"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="glass-panel absolute inset-y-0 left-0 w-72 max-w-[85%] border-r border-border/60">
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close"
              className="absolute right-2 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent/60"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
            <SidebarShell
              onSearchOpen={() => {
                setMobileNavOpen(false);
                setSearchOpen(true);
              }}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
