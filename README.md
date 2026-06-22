# Lumen Docs — Documentation Starter

A clean, ready-to-use starter for building documentation websites. Clone it, drop in your MDX content, and ship.

> This is a **starter template**, not a real product. All content inside `src/content/docs/` is placeholder copy.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) |
| UI | [React 19](https://react.dev) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Components | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) |
| Content | [MDX](https://mdxjs.com) via `@mdx-js/rollup` |
| Syntax highlighting | [highlight.js](https://highlightjs.org) + custom rehype plugins |
| Icons | [Lucide React](https://lucide.dev) |
| Fonts | Inter + JetBrains Mono via `@fontsource` |
| Build tool | [Vite 8](https://vite.dev) |
| Language | TypeScript |

---

## Features

- File-based MDX docs with frontmatter support
- Auto-generated sidebar from content structure
- Sticky table of contents with scroll-synced active indicator
- Full-text search dialog (`Ctrl K`)
- Collapsible sidebar with mini-strip mode
- Colorful blockquote alerts (`[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!CAUTION]`, `[!IMPORTANT]`)
- Numbered section headings with `h2` counters
- Code blocks with language labels, copy button, and custom bash syntax theme
- Code tabs component for multi-language examples
- Light / dark theme toggle
- Mobile-responsive layout with drawer navigation
- Breadcrumb navigation
- Prev / next page pagination
- Sitemap generation

---

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build for production
bun build
```

---

## Adding Content

Drop `.mdx` files into `src/content/docs/<category>/` and register them in `src/content/docs.ts`.

```ts
// src/content/docs.ts
export const docs = [
  {
    slug: "getting-started/introduction",
    title: "Introduction",
    category: "Getting Started",
    description: "...",
    component: lazy(() => import("./docs/getting-started/introduction.mdx")),
  },
  // ...
]
```

---

## Project Structure

```
src/
├── components/        # UI components (sidebar, TOC, breadcrumbs, search, …)
├── content/
│   ├── docs/          # MDX content files
│   └── docs.ts        # Doc registry
├── lib/               # Rehype/remark plugins, utilities
├── routes/            # TanStack Router file-based routes
└── styles.css         # Global styles + prose theme
```

---

## License

MIT
