import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useRef } from "react";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { MobileToc } from "@/components/mobile-toc";
import { TableOfContents } from "@/components/table-of-contents";
import { useCodeCopyButtons } from "@/components/code-copy";
import { CodeTabs, Tab } from "@/components/code-tabs";
import { findDocBySlug, getAdjacentDocs } from "@/content/docs";

const mdxComponents = { CodeTabs, Tab };

export const Route = createFileRoute("/docs/$")({
  loader: ({ params }) => {
    const slug = params._splat ?? "";
    const page = findDocBySlug(slug);
    if (!page) throw notFound();
    return {
      slug: page.slug,
      title: page.title,
      description: page.description,
      category: page.category,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = `/docs/${loaderData.slug}`;
    return {
      meta: [
        { title: `${loaderData.title} — Lumen Docs` },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: `${loaderData.title} — Lumen Docs` },
        { property: "og:description", content: loaderData.description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: loaderData.title,
            description: loaderData.description,
            articleSection: loaderData.category,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="py-24 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">This documentation page doesn't exist.</p>
    </div>
  ),
  component: DocPage,
});

function DocPage() {
  const data = Route.useLoaderData();
  const page = findDocBySlug(data.slug);
  const articleRef = useRef<HTMLElement>(null);
  useCodeCopyButtons(articleRef);
  if (!page) return null;
  const Content = page.Component;
  const { prev, next } = getAdjacentDocs(page.slug);

  return (
    <div className="grid min-w-0 gap-6 px-4 py-4 xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-12 xl:px-2 xl:py-4">
      <MobileToc contentRef={articleRef} slug={page.slug} />
      <article
        ref={articleRef}
        className="min-w-0 max-w-6xl sm:rounded-md sm:border sm:border-border sm:bg-card/40 sm:px-8 sm:py-10"
      >
        <div className="hidden sm:block">
          <Breadcrumbs
            items={[
              { label: "Docs", href: "/docs" },
              { label: page.category },
              { label: page.title },
            ]}
          />
        </div>

        <header className="sm:mt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">
            {page.category}
          </p>
          {page.description && (
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">{page.description}</p>
          )}
        </header>

        <div className="docs-prose mt-6">
          <Content components={mdxComponents} />
        </div>

        <hr className="my-10 border-border" />

        <nav className="grid gap-3 sm:grid-cols-2" aria-label="Pagination">
          {prev ? (
            <Link
              to="/docs/$"
              params={{ _splat: prev.slug }}
              className="group flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
            >
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <ArrowLeft className="h-3 w-3" aria-hidden /> Previous
              </span>
              <span className="font-medium text-foreground group-hover:text-brand">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              to="/docs/$"
              params={{ _splat: next.slug }}
              className="group flex flex-col items-end gap-1 rounded-lg border border-border p-4 text-right transition-colors hover:bg-accent"
            >
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                Next <ArrowRight className="h-3 w-3" aria-hidden />
              </span>
              <span className="font-medium text-foreground group-hover:text-brand">
                {next.title}
              </span>
            </Link>
          ) : null}
        </nav>

        <p className="mt-8 text-xs text-muted-foreground">
          <a
            href={`https://github.com/lumen-docs/lumen/edit/main/src/content/docs/${page.slug}.mdx`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            Edit this page on GitHub
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        </p>
      </article>

      <aside className="hidden xl:block">
        <div className="sticky top-20">
          <TableOfContents contentRef={articleRef} slug={page.slug} />
        </div>
      </aside>
    </div>
  );
}
