import { lazy, Suspense } from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/spinner";

const Upload = lazy(() =>
  import("@/pages/Upload").catch((error) => {
    console.error("Error loading Upload component:", error);
    return { default: () => <div>Error loading Upload component</div> };
  })
);

export const Route = createLazyFileRoute("/_authenticated/upload")({
  component: () => (
    <Suspense fallback={<Spinner />}>
      <Upload />
    </Suspense>
  ),
});
