import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Search,
  Moon,
  Zap,
  Layers,
  ShieldCheck,
  Rocket,
  Github,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SearchDialog, useSearchHotkey } from "@/components/search-dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lumen — Documentation, beautifully done" },
      {
        name: "description",
        content:
          "Lumen is a modern MDX-based documentation framework with built-in search, dark mode, and a refined reading experience.",
      },
      { property: "og:title", content: "Lumen — Documentation, beautifully done" },
      {
        property: "og:description",
        content:
          "MDX-based docs with built-in search, dark mode, and a refined reading experience.",
      },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

function Landing() {
  const [searchOpen, setSearchOpen] = useState(false);
  useSearchHotkey(setSearchOpen);

  return (
    <div className="min-h-dvh bg-background">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <main id="main">
        <Hero />
        <LogoStrip />
        <Features />
        <CodePreview />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Animated background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]">
        <div
          className="hero-grid-anim absolute inset-0 opacity-60"
          style={{ backgroundImage: "var(--gradient-grid)", backgroundSize: "36px 36px" }}
        />
      </div>
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-blob hero-blob-a left-[-10%] top-[-10%] h-[420px] w-[420px] bg-[oklch(0.65_0.2_280)]" />
        <div className="hero-blob hero-blob-b right-[-10%] top-[20%] h-[480px] w-[480px] bg-[oklch(0.7_0.18_200)]" />
        <div className="hero-blob hero-blob-c left-[30%] bottom-[-15%] h-[380px] w-[380px] bg-[oklch(0.7_0.2_330)]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent hero-beam"
      />


      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:grid-cols-2 lg:items-center lg:gap-10 lg:px-8 lg:pb-32 lg:pt-32 [&>*]:min-w-0">
        {/* Left: copy */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            v1.0 — now available
          </span>

          <h1 className="mt-8 break-words font-mono text-5xl font-bold uppercase leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Lumen Docs,
            <br />
            Beautifully Done
          </h1>

          <p className="mt-6 max-w-xl text-sm text-muted-foreground sm:text-base">
            Build documentation once — read it on every device, every theme, every search bar.
          </p>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            MDX-based docs framework with refined typography, instant search, and dark mode out of
            the box — zero config required.
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs text-muted-foreground">
            {["Zero config", "MDX-first", "Edge ready"].map((t) => (
              <li key={t} className="inline-flex items-center gap-2">
                <Check className="h-3.5 w-3.5 text-emerald-500" aria-hidden />
                {t}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/docs/$"
              params={{ _splat: "getting-started/introduction" }}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-foreground px-5 font-mono text-xs font-semibold uppercase tracking-wider text-background transition-transform hover:-translate-y-0.5"
            >
              Get Started
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card/40 px-5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground backdrop-blur transition-colors hover:bg-accent"
            >
              <Github className="h-4 w-4" aria-hidden />
              View Github
            </a>
          </div>
        </div>

        {/* Right: code window */}
        <HeroCodeWindow />
      </div>
    </section>
  );
}

function HeroCodeWindow() {
  return (
        <div className="relative overflow-clip">
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-3xl opacity-60 blur-3xl"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="overflow-hidden rounded-xl border border-white/10 bg-[oklch(0.14_0.01_270)] shadow-[0_30px_80px_-20px_oklch(0_0_0/0.6)] ring-1 ring-white/5">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="ml-2 flex items-center gap-1 text-xs">
            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white">
              introduction.mdx
            </span>
            <span className="px-2.5 py-1 font-mono text-[11px] text-white/40">lumen.config.ts</span>
          </div>
          <button
            type="button"
            className="ml-auto font-mono text-[11px] text-white/60 transition-colors hover:text-white"
          >
            Copy
          </button>
        </div>

        {/* Code */}
        <pre className="overflow-x-auto p-5 font-mono text-[12.5px] leading-relaxed">
          <code className="text-white/90">
            <span className="text-white/40">---</span>
            {"\n"}
            <span className="text-[#fbbf24]">title</span>
            <span className="text-white/70">: </span>
            <span className="text-[#86efac]">Getting Started</span>
            {"\n"}
            <span className="text-[#fbbf24]">description</span>
            <span className="text-white/70">: </span>
            <span className="text-[#86efac]">Ship beautiful docs in minutes.</span>
            {"\n"}
            <span className="text-[#fbbf24]">category</span>
            <span className="text-white/70">: </span>
            <span className="text-[#86efac]">Introduction</span>
            {"\n"}
            <span className="text-white/40">---</span>
            {"\n\n"}
            <span className="text-[#f472b6]"># Welcome to Lumen</span>
            {"\n\n"}
            <span className="text-white/80">Write </span>
            <span className="text-[#fbbf24]">**Markdown**</span>
            <span className="text-white/80"> and embed </span>
            <span className="text-[#fbbf24]">React</span>
            <span className="text-white/80"> components inline.</span>
            {"\n\n"}
            <span className="text-[#c084fc]">import</span>{" "}
            <span className="text-white">{"{ "}</span>
            <span className="text-[#7dd3fc]">Callout</span>
            <span className="text-white">{" }"}</span>{" "}
            <span className="text-[#c084fc]">from</span>{" "}
            <span className="text-[#86efac]">"@/components"</span>
            {"\n\n"}
            <span className="text-[#7dd3fc]">{"<Callout"}</span>{" "}
            <span className="text-[#fbbf24]">type</span>
            <span className="text-white">=</span>
            <span className="text-[#86efac]">"info"</span>
            <span className="text-[#7dd3fc]">{">"}</span>
            {"\n  "}
            <span className="text-white/85">Search, dark mode, and TOC — out of the box.</span>
            {"\n"}
            <span className="text-[#7dd3fc]">{"</Callout>"}</span>
            {"\n\n"}
            <span className="text-white/40">```ts</span>
            {"\n"}
            <span className="text-[#60a5fa]">export</span>{" "}
            <span className="text-[#60a5fa]">const</span>{" "}
            <span className="text-white">greet = (</span>
            <span className="text-[#fbbf24]">name</span>
            <span className="text-white/70">: </span>
            <span className="text-[#7dd3fc]">string</span>
            <span className="text-white">) </span>
            <span className="text-[#c084fc]">{"=>"}</span>
            {"\n  "}
            <span className="text-[#86efac]">{"`Hello, ${name}!`"}</span>
            {"\n"}
            <span className="text-white/40">```</span>
          </code>
        </pre>
      </div>
    </div>
  );
}

function LogoStrip() {
  const logos = ["Acme", "Linear", "Vercel", "Stripe", "Cloudflare", "Plaid"];
  return (
    <section aria-label="Trusted by" className="border-y border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Powering documentation for ambitious teams
        </p>
        <div className="grid grid-cols-2 items-center gap-x-6 gap-y-4 opacity-70 sm:grid-cols-3 md:grid-cols-6">
          {logos.map((name) => (
            <div
              key={name}
              className="text-center font-mono text-sm font-medium tracking-tight text-muted-foreground"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    {
      icon: Zap,
      title: "Fast by default",
      desc: "Pre-rendered, code-split, and aggressively cached for instant page transitions.",
    },
    {
      icon: Search,
      title: "Instant search",
      desc: "Full-text fuzzy search with keyboard navigation. Activate anywhere with ⌘K.",
    },
    {
      icon: Moon,
      title: "Dark & light",
      desc: "A refined dark mode that respects system preferences and persists across visits.",
    },
    {
      icon: Layers,
      title: "MDX-first",
      desc: "Mix Markdown and React components. Frontmatter drives navigation automatically.",
    },
    {
      icon: ShieldCheck,
      title: "Accessible",
      desc: "Semantic landmarks, keyboard navigation, and ARIA where it matters.",
    },
    {
      icon: Rocket,
      title: "Edge ready",
      desc: "Deploy to Vercel, Netlify, or Cloudflare Pages with zero configuration.",
    },
  ];

  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Features</p>
          <h2 className="mt-2 break-words text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything documentation should be.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Lumen takes the boring parts of building docs and makes them disappear, so you can
            focus on the writing.
          </p>
        </div>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <li
              key={it.title}
              className="group flex flex-col gap-3 bg-background p-6 transition-colors hover:bg-card"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-brand-muted text-brand transition-transform group-hover:-translate-y-0.5">
                <it.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-base font-semibold text-foreground">{it.title}</h3>
              <p className="text-sm text-muted-foreground">{it.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CodePreview() {
  return (
    <section className="border-t border-border bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 [&>*]:min-w-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Authoring</p>
          <h2 className="mt-2 break-words text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Write MDX. Ship a polished site.
          </h2>
          <p className="mt-3 max-w-lg text-muted-foreground">
            Frontmatter drives the navigation, search index, and metadata. Drop React components
            inline whenever you need more than text.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            {[
              "Automatic table of contents",
              "Built-in code highlighting",
              "Breadcrumbs and prev / next navigation",
              "SEO-friendly meta tags out of the box",
            ].map((b) => (
              <li key={b} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative overflow-clip">
          <div
            aria-hidden
            className="absolute -inset-4 -z-10 rounded-2xl opacity-50 blur-2xl"
            style={{ background: "var(--gradient-hero)" }}
          />
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              <span className="ml-2 font-mono text-xs text-muted-foreground">
                docs/getting-started.mdx
              </span>
            </div>
            <pre className="overflow-x-auto bg-[oklch(0.16_0.02_270)] p-5 text-xs leading-relaxed text-[oklch(0.92_0.01_270)]">
              <code>{`---
title: Getting Started
description: Build your first docs page.
category: Getting Started
order: 1
---

# Welcome to Lumen

Write **Markdown** and embed React components.

import { Callout } from "@/components/callout";

<Callout type="info">
  This renders inside your docs.
</Callout>

\`\`\`ts
const greet = (name: string) => \`Hello, \${name}!\`;
\`\`\``}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden border-t border-border py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="break-words text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Ready to ship beautiful docs?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Get started in minutes. No vendor lock-in, no proprietary build steps — just clean MDX
          and great defaults.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/docs/$"
            params={{ _splat: "getting-started/installation" }}
            className="inline-flex h-11 items-center gap-2 rounded-md bg-foreground px-5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            Start reading
          </Link>
          <Link
            to="/docs/$"
            params={{ _splat: "tutorials/first-app" }}
            className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Build your first app
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
