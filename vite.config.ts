import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import { rehypeBashTheme } from "./src/lib/rehype-bash-theme";
import { rehypeBlockquoteAlerts } from "./src/lib/rehype-blockquote-alerts";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  plugins: [
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: "frontmatter" }],
        ],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: "append", properties: { className: ["heading-anchor"], ariaLabel: "Link to section" } }],
          [rehypeHighlight, { detect: true, subset: ["bash", "shell", "javascript", "typescript", "tsx", "jsx", "json", "css", "html", "xml", "yaml", "markdown", "python"] }],
          rehypeBashTheme,
          rehypeBlockquoteAlerts,
        ],
      }),
    },
  ],
});
