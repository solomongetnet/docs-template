import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: number };

export function TableOfContents({
  contentRef,
  slug,
}: {
  contentRef: React.RefObject<HTMLElement | null>;
  slug?: string;
}) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const listRef = useRef<HTMLUListElement>(null);
  const [indicator, setIndicator] = useState<{ top: number; height: number; opacity: number }>({
    top: 0,
    height: 0,
    opacity: 0,
  });

  // Re-scan headings whenever the page (slug) changes.
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
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );

    const scan = () => {
      const found = Array.from(node.querySelectorAll("h2, h3")).filter(
        (el): el is HTMLHeadingElement => el instanceof HTMLHeadingElement && !!el.id,
      );
      const ids = found.map((f) => f.id).join("|");
      const prevIds = observed.map((f) => f.id).join("|");
      if (ids === prevIds) return;
      setHeadings(
        found.map((el) => ({
          id: el.id,
          text: el.textContent?.replace(/#$/, "").trim() ?? "",
          level: Number(el.tagName.slice(1)),
        })),
      );
      if (found.length > 0) setActiveId(found[0].id);
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
  }, [contentRef, slug]);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || !activeId) {
      setIndicator((p) => ({ ...p, opacity: 0 }));
      return;
    }
    const item = list.querySelector<HTMLElement>(`[data-toc-id="${CSS.escape(activeId)}"]`);
    if (!item) return;
    setIndicator({ top: item.offsetTop, height: item.offsetHeight, opacity: 1 });
  }, [activeId, headings]);

  if (headings.length === 0) return null;

  return (
    <div className="text-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">On this page</p>
      <div className="relative">
        <span aria-hidden className="absolute left-[7px] top-0 h-full w-px bg-border/40" />
        <span
          aria-hidden
          className="absolute left-[5px] top-0 w-[5px] rounded-full bg-foreground will-change-[top,opacity]"
          style={{
            top: indicator.top + indicator.height / 2 - 10,
            height: 20,
            opacity: indicator.opacity,
            boxShadow: "0 0 10px var(--foreground), 0 0 18px var(--foreground)",
            transition:
              "top 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 240ms ease-out",
          }}
        />
        <ul ref={listRef} className="relative flex flex-col">
          {headings.map((h) => (
            <li
              key={h.id}
              data-toc-id={h.id}
              style={{ paddingLeft: h.level === 3 ? "1.75rem" : "1rem" }}
              className={cn(
                "rounded-lg transition-colors duration-200",
                activeId === h.id ? "bg-accent/60" : "bg-transparent",
              )}
            >
              <a
                href={`#${h.id}`}
                onClick={() => setActiveId(h.id)}
                className={cn(
                  "block py-1.5 text-[13px] transition-colors duration-200",
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
