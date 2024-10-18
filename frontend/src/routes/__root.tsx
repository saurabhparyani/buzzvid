import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ThemeToggle } from "../components/ThemeToggle";
// import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const RootComponent = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-5 right-5 z-50">
        <ThemeToggle />
      </div>
      <Outlet />
      {/* <TanStackRouterDevtools position="bottom-left" /> */}
    </div>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
