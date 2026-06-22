/// <reference types="vite/client" />

declare module "*.mdx" {
  import type { ComponentType } from "react";
  export const frontmatter: {
    title?: string;
    description?: string;
    category?: string;
    order?: number;
  };
  const MDXComponent: ComponentType<{ components?: Record<string, ComponentType<any>> }>;
  export default MDXComponent;
}
