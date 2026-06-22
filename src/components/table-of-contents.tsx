import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string; level: number };

const SCROLL_OFFSET = 100; // px from top to consider a heading "active"

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
  const headingEls = useRef<HTMLHeadingElement[]>([]);
  const [indicator, setIndicator] = useState<{ top: number; height: number; opacity: number }>({
    top: 0,
    height: 0,
    opacity: 0,
  });

  // Scan headings whenever slug changes
  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    const scan = () => {
      const found = Array.from(node.querySelectorAll("h2, h3")).filter(
        (el): el is HTMLHeadingElement => el instanceof HTMLHeadingElement && !!el.id,
      );
      headingEls.current = found;
      setHeadings(
        found.map((el) => ({
          id: el.id,
          text: el.textContent?.replace(/#$/, "").trim() ?? "",
          level: Number(el.tagName.slice(1)),
        })),
      );
      if (found.length > 0) setActiveId(found[0].id);
    };

    scan();

    const mo = new MutationObserver(scan);
    mo.observe(node, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [contentRef, slug]);

  // Scroll listener — pick the last heading that has scrolled past SCROLL_OFFSET
  useEffect(() => {
    const onScroll = () => {
      const els = headingEls.current;
      if (els.length === 0) return;

      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      const atBottom = scrollY + windowH >= docH - 4;

      // If at the very bottom, activate last heading
      if (atBottom) {
        setActiveId(els[els.length - 1].id);
        return;
      }

      // Find the last heading whose top is above SCROLL_OFFSET
      let active = els[0];
      for (const el of els) {
        const top = el.getBoundingClientRect().top;
        if (top <= SCROLL_OFFSET) {
          active = el;
        } else {
          break;
        }
      }
      setActiveId(active.id);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, [headings]); // re-attach when headings list changes

  // Move the indicator bar to the active list item
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
      <p className="mb-3 text-xs font-medium text-muted-foreground">On this page</p>
      <div className="relative">
        {/* Static track */}
        <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-border" />
        {/* Sliding active indicator */}
        <span
          aria-hidden
          className="absolute left-0 w-px bg-foreground will-change-[top,height,opacity]"
          style={{
            top: indicator.top,
            height: indicator.height,
            opacity: indicator.opacity,
            transition:
              "top 280ms cubic-bezier(0.22, 1, 0.36, 1), height 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease",
          }}
        />
        <ul ref={listRef} className="relative flex flex-col">
          {headings.map((h) => (
            <li key={h.id} data-toc-id={h.id}>
              <a
                href={`#${h.id}`}
                onClick={() => setActiveId(h.id)}
                className={cn(
                  "block py-1.5 text-[13px] transition-colors duration-200",
                  h.level === 3 ? "pl-6" : "pl-4",
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
