import type { ComponentType } from "react";

type Frontmatter = {
  title?: string;
  description?: string;
  category?: string;
  order?: number;
};

type DocModule = {
  default: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
  frontmatter?: Frontmatter;
};

const modules = import.meta.glob<DocModule>("/src/content/docs/**/*.mdx", { eager: true });

export type DocPage = {
  slug: string;
  url: string;
  title: string;
  description: string;
  category: string;
  order: number;
  Component: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
};

export type DocCategory = {
  name: string;
  pages: DocPage[];
};

const CATEGORY_ORDER = ["Getting Started", "Guides", "API Reference", "Tutorials"];

function pathToSlug(path: string): string {
  return path.replace(/^\/src\/content\/docs\//, "").replace(/\.mdx$/, "");
}

function titleFromSlug(slug: string): string {
  const last = slug.split("/").pop() ?? slug;
  return last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export const docPages: DocPage[] = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = pathToSlug(path);
    const fm = mod.frontmatter ?? {};
    return {
      slug,
      url: `/docs/${slug}`,
      title: fm.title ?? titleFromSlug(slug),
      description: fm.description ?? "",
      category: fm.category ?? "Reference",
      order: fm.order ?? 99,
      Component: mod.default,
      
    };
  })
  .sort((a, b) => a.order - b.order);

export const docCategories: DocCategory[] = (() => {
  const map = new Map<string, DocPage[]>();
  for (const page of docPages) {
    const list = map.get(page.category) ?? [];
    list.push(page);
    map.set(page.category, list);
  }
  for (const list of map.values()) list.sort((a, b) => a.order - b.order);
  const ordered: DocCategory[] = [];
  for (const name of CATEGORY_ORDER) {
    if (map.has(name)) {
      ordered.push({ name, pages: map.get(name)! });
      map.delete(name);
    }
  }
  for (const [name, pages] of map) ordered.push({ name, pages });
  return ordered;
})();

export function findDocBySlug(slug: string): DocPage | undefined {
  return docPages.find((p) => p.slug === slug);
}

export function getAdjacentDocs(slug: string): { prev?: DocPage; next?: DocPage } {
  const flat = docCategories.flatMap((c) => c.pages);
  const idx = flat.findIndex((p) => p.slug === slug);
  if (idx === -1) return {};
  return { prev: flat[idx - 1], next: flat[idx + 1] };
}

export const firstDocSlug = docCategories[0]?.pages[0]?.slug ?? "";
