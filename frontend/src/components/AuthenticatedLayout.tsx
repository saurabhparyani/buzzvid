import { Outlet } from "@tanstack/react-router";
import SideNav from "@/components/SideNav";
import NavMenu from "@/components/NavMenu";

const AuthenticatedLayout = () => {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <div className="flex-1 flex flex-col">
        <NavMenu />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
