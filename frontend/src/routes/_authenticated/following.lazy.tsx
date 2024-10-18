import Following from "@/pages/Following";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/following")({
  component: Following,
});
