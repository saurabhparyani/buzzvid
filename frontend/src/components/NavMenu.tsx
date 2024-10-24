import { Link } from "@tanstack/react-router";
import { useUserStore } from "@/stores/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserIcon, Upload, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_USERS } from "@/graphql/queries/SearchUsers";
import { User } from "@/gql/graphql";

const NavMenu = () => {
  const user = useUserStore((state) => state);
  const handleLogout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [searchUsers] = useLazyQuery(SEARCH_USERS, {
    onCompleted: (data) => {
      setSearchResults(data.searchUsers);
    },
  });

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchUsers({ variables: { searchTerm: debouncedSearchTerm } });
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm, searchUsers]);

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false);
      setSearchTerm("");
      setSearchResults([]);
    };

    window.addEventListener("popstate", handleRouteChange);

    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

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
        <div className="relative flex items-center bg-gray-100 dark:bg-[#2A2A2A] p-2 rounded-full max-w-[480px] w-full transition-all duration-300 focus-within:ring-2 focus-within:ring-primary dark:focus-within:ring-primary-dark">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchInputChange}
            placeholder="Search Accounts"
            className="pl-2 pr-1 py-1 bg-transparent placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white text-xs sm:text-sm focus:outline-none w-full lg:w-[400px]"
          />
          <Search className="text-gray-500 dark:text-gray-400 w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:text-primary dark:hover:text-primary-dark transition-colors" />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-950 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto w-full sm:w-auto sm:min-w-[300px]">
              {searchResults.map((user) => (
                <Link
                  key={user.id}
                  to={`/profile/${user.id}`}
                  className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => {
                    setSearchTerm("");
                    setSearchResults([]);
                  }}
                >
                  <Avatar className="w-6 h-6 sm:w-8 sm:h-8 mr-2 flex-shrink-0">
                    <AvatarImage
                      src={user.googleImage || user.image || ""}
                      alt={user.fullname}
                    />
                    <AvatarFallback>{user.fullname.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow min-w-0">
                    <p className="font-semibold text-sm sm:text-base truncate">
                      {user.fullname}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
        {/* Rest of the component remains the same */}
        <div className="items-center space-x-4 hidden lg:flex">
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
        <div className="hidden lg:block">
          {user.id && (
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary dark:hover:ring-primary-dark transition-all duration-300 w-9 h-9 rounded-full">
                  {user.googleImage ? (
                    <AvatarImage
                      className="object-contain"
                      src={user.googleImage}
                      alt={user.fullname}
                    />
                  ) : user.image ? (
                    <AvatarImage
                      src={user.image}
                      alt={user.fullname}
                      className="object-contain"
                    />
                  ) : (
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-900">
                      <UserIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link
                    to={`/profile/${user.id}`}
                    className="flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
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
