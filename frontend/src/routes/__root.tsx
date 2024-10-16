import { Outlet, createRootRoute } from "@tanstack/react-router";
import { ThemeToggle } from "../components/ThemeToggle";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// import { NavMenu } from "../components/NavMenu";

const RootComponent = () => {
  // const hideNavRoutes = ["/signup", "/"];

  // const matchRoute = useMatchRoute();

  // const matchedHideNavRoutes = hideNavRoutes.some((route) =>
  //   matchRoute({ to: route })
  // );

  return (
    <div className="min-h-screen flex flex-col">
      {/* {!matchedHideNavRoutes && <NavMenu />} */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Outlet />
      <TanStackRouterDevtools position="bottom-left" />
    </div>
  );
};

export const Route = createRootRoute({
  component: RootComponent,
});
