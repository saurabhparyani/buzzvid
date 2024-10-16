import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useUserStore } from "../stores/userStore";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  beforeLoad: () => {
    const user = useUserStore.getState();
    if (!user._id) {
      throw redirect({
        to: "/register",
      });
    }
  },
});

function AuthenticatedLayout() {
  return <Outlet />;
}
