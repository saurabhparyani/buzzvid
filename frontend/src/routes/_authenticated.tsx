import { createFileRoute, redirect } from "@tanstack/react-router";
import { useUserStore } from "../stores/userStore";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  beforeLoad: () => {
    const user = useUserStore.getState();
    if (!user.id) {
      throw redirect({
        to: "/register",
      });
    }
  },
});
