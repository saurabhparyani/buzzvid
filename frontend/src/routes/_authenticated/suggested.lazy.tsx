import Suggested from "@/pages/Suggested";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/_authenticated/suggested")({
  component: Suggested,
});
