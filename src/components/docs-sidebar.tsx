import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, BookOpen, Compass, Download, Rocket, Library, Wrench, Code2, GraduationCap } from "lucide-react";
import { useState } from "react";
import { docCategories } from "@/content/docs";
import { cn } from "@/lib/utils";

type DocsSidebarProps = {
  onNavigate?: () => void;
};

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Getting Started": Compass,
  Guides: Library,
  "API Reference": Code2,
  Tutorials: GraduationCap,
};

const PAGE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  introduction: BookOpen,
  installation: Download,
  "quick-start": Rocket,
};

export function DocsSidebar({ onNavigate }: DocsSidebarProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(docCategories.map((c) => [c.name, true])),
  );

  return (
    <nav aria-label="Documentation" className="flex flex-col gap-1 py-4 text-[13.5px]">
      {docCategories.map((cat) => {
        const Icon = CATEGORY_ICONS[cat.name] ?? Wrench;
        const isOpen = open[cat.name] ?? true;
        return (
          <div key={cat.name} className="flex flex-col">
            <button
              type="button"
              onClick={() => setOpen((s) => ({ ...s, [cat.name]: !isOpen }))}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-foreground transition-colors hover:bg-accent"
              aria-expanded={isOpen}
            >
              <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
              <span className="font-medium">{cat.name}</span>
              <ChevronDown
                className={cn(
                  "ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform",
                  !isOpen && "-rotate-90",
                )}
                aria-hidden
              />
            </button>
            {isOpen && (
              <ul className="mt-0.5 flex flex-col border-l border-border ml-4 pl-2">
                {cat.pages.map((page) => {
                  const isActive = pathname === page.url;
                  const last = page.slug.split("/").pop() ?? "";
                  const PIcon = PAGE_ICONS[last];
                  return (
                    <li key={page.slug}>
                      <Link
                        to="/docs/$"
                        params={{ _splat: page.slug }}
                        onClick={onNavigate}
                        className={cn(
                          "flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors",
                          isActive
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {PIcon ? <PIcon className="h-3.5 w-3.5" aria-hidden /> : null}
                        <span>{page.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}
