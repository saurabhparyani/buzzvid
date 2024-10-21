import { Outlet } from "@tanstack/react-router";
import SideNav from "@/components/SideNav";
import NavMenu from "@/components/NavMenu";
import MobileNav from "@/components/MobileNav";

const AuthenticatedLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavMenu />
      <div className="flex flex-1">
        <aside className="lg:block w-64 top-20 bottom-0 left-0 overflow-y-auto hidden">
          <SideNav />
        </aside>
        <main className="flex-1 pb-16 lg:pb-0">
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default AuthenticatedLayout;
