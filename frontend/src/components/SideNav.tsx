import { Link } from "@tanstack/react-router";
import { Home, Upload } from "lucide-react";

const SideNav = () => {
  return (
    <nav className="bg-background border-r w-16 flex flex-col items-center py-8 space-y-8">
      <Link to="/feed" className="hover:text-primary">
        <Home size={24} />
      </Link>
      <Link to="/upload" className="hover:text-primary">
        <Upload size={24} />
      </Link>
      {/* <Link to="/profile" className="hover:text-primary">
        <User size={24} />
      </Link> */}
    </nav>
  );
};

export default SideNav;
