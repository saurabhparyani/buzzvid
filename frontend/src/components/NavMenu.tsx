import { Link } from "@tanstack/react-router";
import { useUserStore } from "@/stores/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Upload, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";

const NavMenu = () => {
  const user = useUserStore((state) => state);
  const handleLogout = useLogout();

  return (
    <nav className="bg-background border-b border-gray-200 dark:border-gray-800 p-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center space-x-4">
        <Link
          to="/"
          className="text-2xl font-bold items-center hover:opacity-80 transition-opacity flex"
        >
          <img
            src="/src/assets/logo.png"
            alt="buzz logo"
            className="w-8 h-8 mr-2 flex-shrink-0"
          />
          <span className="text-primary dark:text-primary-dark hidden sm:flex">
            buzz.
          </span>
        </Link>
      </div>
      <div className="flex items-center space-x-6 mr-14">
        <div className="flex items-center bg-gray-100 dark:bg-[#2A2A2A] p-2 rounded-full max-w-[480px] w-full transition-all duration-300 focus-within:ring-2 focus-within:ring-primary dark:focus-within:ring-primary-dark">
          <input
            type="text"
            placeholder="Search Accounts"
            className="pl-2 pr-1 py-1 bg-transparent placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white text-xs sm:text-sm focus:outline-none w-full lg:w-[400px]"
          />
          <Search className="text-gray-500 dark:text-gray-400 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-primary dark:hover:text-primary-dark transition-colors" />
        </div>
        <div className="items-center space-x-4 hidden sm:flex">
          <Link
            to="/upload"
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors duration-200 hover:scale-105"
          >
            <div className="flex items-center space-x-2 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2">
              <Upload className="w-5 h-5" />
              <span className="hidden sm:block text-sm font-medium">
                Upload
              </span>
            </div>
          </Link>
        </div>
        <div className="hidden sm:block">
          {user._id && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary dark:hover:ring-primary-dark transition-all duration-300">
                  {user.googleImage ? (
                    <AvatarImage
                      className="object-cover rounded-full"
                      src={user.googleImage}
                      alt={user.fullname}
                    />
                  ) : user.image ? (
                    <AvatarImage src={user.image} alt={user.fullname} />
                  ) : (
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-900">
                      <User className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link
                    to={`/profile/${user._id}`}
                    className="flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavMenu;
