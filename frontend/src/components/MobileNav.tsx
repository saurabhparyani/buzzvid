import { Link, useMatchRoute } from "@tanstack/react-router";
import { Users, User, Upload } from "lucide-react";
import { HiHome } from "react-icons/hi";
import { useUserStore } from "@/stores/userStore";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, PersonStanding } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";

const MobileNav = () => {
  const matchRoute = useMatchRoute();
  const isFeedActive = matchRoute({ to: "/feed" });
  const isFollowingActive = matchRoute({ to: "/following" });
  const isUploadActive = matchRoute({ to: "/upload" });
  const isProfileActive = matchRoute({ to: "/profile/$id" });
  const isSuggestedActive = matchRoute({ to: "/suggested" });
  const user = useUserStore((state) => state);

  const handleLogout = useLogout();

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t border-gray-200 dark:border-gray-800 flex justify-around items-center py-4 z-50">
      <Link
        to="/feed"
        className={`flex flex-col items-center w-1/5 ${isFeedActive ? "text-red-500" : ""}`}
      >
        <HiHome size={24} className="min-w-[24px] min-h-[24px]" />
        <span className="text-xs mt-1 text-center">For You</span>
      </Link>
      <Link
        to="/following"
        className={`flex flex-col items-center w-1/5 ${isFollowingActive ? "text-red-500" : ""}`}
      >
        <Users size={24} className="min-w-[24px] min-h-[24px]" />
        <span className="text-xs mt-1 text-center">Following</span>
      </Link>
      <Link
        to="/upload"
        className={`flex flex-col items-center w-1/5 ${isUploadActive ? "text-red-500" : ""}`}
      >
        <Upload size={24} className="min-w-[24px] min-h-[24px]" />
        <span className="text-xs mt-1 text-center">Upload</span>
      </Link>
      <Link
        to="/suggested"
        className={`flex flex-col items-center w-1/5 ${isSuggestedActive ? "text-red-500" : ""}`}
      >
        <PersonStanding size={24} className="min-w-[24px] min-h-[24px]" />
        <span className="text-xs mt-1 text-center">Suggested</span>
      </Link>
      {user._id && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className={`flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity w-1/5 ${isProfileActive ? "text-red-500" : ""}`}
            >
              <User size={24} className="min-w-[24px] min-h-[24px]" />
              <span className="text-xs mt-1 text-center">Profile</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link to={`/profile/${user._id}`} className="flex items-center">
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
  );
};

export default MobileNav;
