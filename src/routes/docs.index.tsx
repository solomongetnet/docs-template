import { createFileRoute, redirect } from "@tanstack/react-router";
import { firstDocSlug } from "@/content/docs";

export const Route = createFileRoute("/docs/")({
  beforeLoad: () => {
    throw redirect({ to: "/docs/$", params: { _splat: firstDocSlug } });
  },
});
