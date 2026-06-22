import { Link } from "@tanstack/react-router";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <Link
        to="/"
        className="transition-colors hover:text-foreground"
      >
        Home
      </Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            <span className="select-none opacity-40">/</span>
            {isLast ? (
              <span className="rounded-md bg-muted px-1.5 py-0.5 font-medium text-foreground">
                {item.label}
              </span>
            ) : item.href ? (
              <Link to={item.href} className="transition-colors hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
