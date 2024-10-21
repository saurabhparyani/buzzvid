import { lazy } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";

const Upload = lazy(() => import("@/pages/Upload"));

export const Route = createLazyFileRoute("/_authenticated/upload")({
  component: Upload,
});
