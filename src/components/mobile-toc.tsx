import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: number };

export function MobileToc({
  contentRef,
  slug,
}: {
  contentRef: React.RefObject<HTMLElement | null>;
  slug?: string;
}) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Scan headings + observe active
  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    let observed: HTMLHeadingElement[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 },
    );

    const scan = () => {
      const found = Array.from(node.querySelectorAll("h2, h3")).filter(
        (el): el is HTMLHeadingElement => el instanceof HTMLHeadingElement && !!el.id,
      );
      setHeadings(
        found.map((el) => ({
          id: el.id,
          text: el.textContent?.replace(/#$/, "").trim() ?? "",
          level: Number(el.tagName.slice(1)),
        })),
      );
      if (found.length > 0 && !activeId) setActiveId(found[0].id);
      observed.forEach((el) => observer.unobserve(el));
      found.forEach((el) => observer.observe(el));
      observed = found;
    };

    scan();
    const mo = new MutationObserver(() => scan());
    mo.observe(node, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentRef, slug]);

  // Page scroll progress (0..1)
  useEffect(() => {
    const onScroll = () => {
      const node = contentRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      setProgress(total <= 0 ? 1 : scrolled / total);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [contentRef, slug]);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (headings.length === 0) return null;

  const active = headings.find((h) => h.id === activeId) ?? headings[0];

  // Circle math
  const size = 22;
  const stroke = 2;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * progress;

  return (
    <div ref={panelRef} className="sticky top-14 z-20 -mx-4 mb-0 xl:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Table of contents"
        className="flex w-full items-center gap-3 border-y border-border/60 bg-background/85 px-4 py-2 text-left backdrop-blur-xl"
      >
        <svg width={size} height={size} className="shrink-0 -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            className="stroke-border"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            className="stroke-foreground transition-[stroke-dasharray] duration-200"
          />
        </svg>
        <span className="flex min-w-0 flex-col">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            On this page
          </span>
          <span className="truncate text-[13px] font-medium text-foreground">
            {active.text}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "ml-auto h-4 w-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      <div
        className={cn(
          "overflow-hidden border-b border-border/60 bg-background/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-out",
          open ? "max-h-[60vh] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <ul className="max-h-[60vh] overflow-y-auto px-4 py-2">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={() => {
                  setActiveId(h.id);
                  setOpen(false);
                }}
                style={{ paddingLeft: h.level === 3 ? "1.25rem" : "0" }}
                className={cn(
                  "block py-1.5 text-[13px] transition-colors",
                  activeId === h.id
                    ? "font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
