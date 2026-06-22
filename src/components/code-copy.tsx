import { useEffect } from "react";

/**
 * Decorates each <pre> within the container by injecting a header bar
 * (language label + copy button) AS A CHILD of the pre. We never re-parent
 * React-rendered nodes — that would break reconciliation on route changes.
 * Idempotent.
 */
export function useCodeCopyButtons(containerRef: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const decorated = new WeakSet<HTMLElement>();

    const detectLang = (pre: HTMLPreElement): string => {
      const code = pre.querySelector("code");
      const cls = code?.className ?? "";
      const m = cls.match(/language-([\w-]+)/i);
      if (m) return m[1].toLowerCase();
      return "text";
    };

    const decorate = () => {
      const pres = root.querySelectorAll<HTMLPreElement>("pre");
      pres.forEach((pre) => {
        if (decorated.has(pre)) return;
        // Skip pres inside CodeTabs — they have their own header
        if (pre.closest(".code-tabs")) return;
        decorated.add(pre);
        pre.classList.add("code-block");

        const header = document.createElement("div");
        header.className = "code-block-header";
        header.setAttribute("data-decoration", "code-header");

        const langEl = document.createElement("span");
        langEl.className = "code-block-lang";
        langEl.textContent = detectLang(pre);
        header.appendChild(langEl);

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "code-copy-btn";
        btn.setAttribute("aria-label", "Copy code");
        btn.innerHTML = iconCopy();
        btn.addEventListener("click", async () => {
          const code = pre.querySelector("code");
          const text = (code?.textContent ?? pre.textContent ?? "").replace(/\n$/, "");
          try {
            await navigator.clipboard.writeText(text);
            btn.innerHTML = iconCheck();
            btn.classList.add("is-copied");
            window.setTimeout(() => {
              btn.innerHTML = iconCopy();
              btn.classList.remove("is-copied");
            }, 1600);
          } catch {
            /* ignore */
          }
        });
        header.appendChild(btn);

        // Insert header as the FIRST child of <pre>. Never change pre's parent.
        pre.insertBefore(header, pre.firstChild);
      });
    };

    decorate();

    const mo = new MutationObserver(() => decorate());
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
    };
  }, [containerRef]);
}

function iconCopy() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
}

function iconCheck() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
}
