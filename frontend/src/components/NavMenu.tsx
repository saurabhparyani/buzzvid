import { Link } from "@tanstack/react-router";

const NavMenu = () => {
  return (
    <nav className="bg-background border-b p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">buzz.</div>
      <div className="flex items-center space-x-4 mr-14">
        <Link to="/feed" className="hover:text-primary">
          Feed
        </Link>
        <Link to="/upload" className="hover:text-primary">
          Upload
        </Link>
      </div>
    </nav>
  );
};

export default NavMenu;
