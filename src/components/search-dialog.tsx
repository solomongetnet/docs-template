import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, FileText, ArrowRight } from "lucide-react";
import { docPages, type DocPage } from "@/content/docs";
import { cn } from "@/lib/utils";

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type Hit = { page: DocPage; score: number; matchedSnippet?: string };

function stripMarkdown(src: unknown): string {
  if (typeof src !== "string") return "";
  return src
    .replace(/^---[\s\S]*?---/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function score(page: DocPage, plain: string, q: string): Hit | null {
  if (!q) return null;
  const ql = q.toLowerCase();
  const title = page.title.toLowerCase();
  const desc = page.description.toLowerCase();
  const cat = page.category.toLowerCase();
  let s = 0;
  let snippet: string | undefined;

  if (title === ql) s += 100;
  else if (title.startsWith(ql)) s += 60;
  else if (title.includes(ql)) s += 40;
  if (cat.includes(ql)) s += 15;
  if (desc.includes(ql)) s += 20;

  const idx = plain.toLowerCase().indexOf(ql);
  if (idx !== -1) {
    s += 10;
    const start = Math.max(0, idx - 40);
    const end = Math.min(plain.length, idx + ql.length + 80);
    snippet = (start > 0 ? "…" : "") + plain.slice(start, end).trim() + (end < plain.length ? "…" : "");
  }
  if (s === 0) return null;
  return { page, score: s, matchedSnippet: snippet };
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  const hits = useMemo<Hit[]>(() => {
    const q = query.trim();
    if (!q) {
      return docPages.slice(0, 6).map((page) => ({ page, score: 0 }));
    }
    return docPages
      .map((page) => score(page, "", q))
      .filter((h): h is Hit => h !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [query]);

  useEffect(() => setActiveIdx(0), [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onOpenChange(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, hits.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const hit = hits[activeIdx];
        if (hit) {
          onOpenChange(false);
          navigate({ to: "/docs/$", params: { _splat: hit.page.slug } });
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, hits, activeIdx, navigate, onOpenChange]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh] sm:pt-[15vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search documentation"
    >
      <button
        type="button"
        aria-label="Close search"
        className="glass-scrim absolute inset-0"
        onClick={() => onOpenChange(false)}
      />
      <div className="glass-panel relative w-full max-w-2xl overflow-hidden rounded-xl border border-border/60 text-popover-foreground shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation…"
            className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            aria-label="Search query"
          />
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            ESC
          </kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {hits.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              No results for "{query}"
            </div>
          ) : (
            <ul className="flex flex-col gap-1">
              {hits.map((hit, i) => (
                <li key={hit.page.slug}>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      navigate({ to: "/docs/$", params: { _splat: hit.page.slug } });
                    }}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      i === activeIdx ? "bg-accent" : "hover:bg-accent/60",
                    )}
                  >
                    <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{hit.page.title}</span>
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {hit.page.category}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {hit.matchedSnippet ?? hit.page.description}
                      </p>
                    </div>
                    <ArrowRight className="mt-1 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> open</span>
          </div>
          <span>Lumen search</span>
        </div>
      </div>
    </div>
  );
}

export function useSearchHotkey(setOpen: (open: boolean) => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);
}
