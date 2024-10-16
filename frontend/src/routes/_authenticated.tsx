import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useUserStore } from "../stores/userStore";
import { useEffect } from "react";
import useGeneralStore from "@/stores/generalStore";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  beforeLoad: () => {
    const user = useUserStore.getState();
    if (!user.id) {
      throw redirect({
        to: "/",
      });
    }
  },
});

function AuthenticatedLayout() {
  const user = useUserStore((state) => state);
  const setLoginIsOpen = useGeneralStore((state) => state.setLoginIsOpen);

  useEffect(() => {
    if (!user.id) {
      // Optionally, you can show a login modal here instead of redirecting
      setLoginIsOpen(true);
    }
  }, [user.id, setLoginIsOpen]);

  return <Outlet />;
}
