import { Github, Twitter, Linkedin } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-brand text-brand-foreground">
                <span className="text-xs font-bold">L</span>
              </span>
              <span className="text-[15px] font-semibold tracking-tight">Lumen</span>
            </div>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              A modern documentation framework for developers who care about speed, craft, and clarity.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <Github className="h-4 w-4" aria-hidden />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <Twitter className="h-4 w-4" aria-hidden />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                <Linkedin className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </div>

          <FooterColumn
            title="Documentation"
            links={[
              { label: "Introduction", to: "/docs/$", splat: "getting-started/introduction" },
              { label: "Installation", to: "/docs/$", splat: "getting-started/installation" },
              { label: "Quick Start", to: "/docs/$", splat: "getting-started/quick-start" },
              { label: "API Reference", to: "/docs/$", splat: "api/client" },
            ]}
          />

          <FooterColumn
            title="Resources"
            links={[
              { label: "Tutorials", to: "/docs/$", splat: "tutorials/first-app" },
              { label: "Configuration", to: "/docs/$", splat: "guides/configuration" },
              { label: "Theming", to: "/docs/$", splat: "guides/theming" },
              { label: "Deployment", to: "/docs/$", splat: "guides/deployment" },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Lumen Labs. All rights reserved.</p>
          <p>Built with care. Open source under the MIT license.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string; splat: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              params={{ _splat: link.splat }}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
