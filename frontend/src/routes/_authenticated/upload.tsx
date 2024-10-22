import { Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Spinner } from "@/components/ui/spinner";
import Upload from "@/pages/Upload";

export const Route = createFileRoute("/_authenticated/upload")({
  component: () => (
    <Suspense fallback={<Spinner />}>
      <Upload />
    </Suspense>
  ),
});
