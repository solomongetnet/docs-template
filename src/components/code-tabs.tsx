import { Children, isValidElement, useMemo, useState, type ReactElement, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type TabProps = {
  label: string;
  value?: string;
  children: ReactNode;
};

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) {
    return extractText((node as ReactElement<{ children?: ReactNode }>).props.children);
  }
  return "";
}

type CodeTabsProps = {
  title?: string;
  children: ReactNode;
};

export function CodeTabs({ title = "Terminal", children }: CodeTabsProps) {
  const tabs = useMemo(() => {
    return Children.toArray(children)
      .filter((c): c is ReactElement<TabProps> => isValidElement(c))
      .map((c, i) => ({
        key: c.props.value ?? c.props.label ?? String(i),
        label: c.props.label ?? `Tab ${i + 1}`,
        node: c.props.children,
      }));
  }, [children]);

  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  if (tabs.length === 0) return null;
  const current = tabs[active] ?? tabs[0];

  const onCopy = async () => {
    const text = extractText(current.node).trim();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="code-tabs my-6 overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-card px-2">
        <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto">
          {tabs.map((t, i) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative whitespace-nowrap px-3 py-2 text-[11px] font-semibold uppercase tracking-wider transition-colors",
                i === active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-2 -bottom-px h-px bg-foreground transition-opacity duration-200",
                  i === active ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 pr-2">
          <span className="hidden text-[11px] uppercase tracking-wider text-muted-foreground sm:inline">
            {title}
          </span>
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>
      <div className="code-tabs-body">{current.node}</div>
    </div>
  );
}
