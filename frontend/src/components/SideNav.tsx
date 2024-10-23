import { Link, useMatchRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { HiHome } from "react-icons/hi";
import { useGetSuggestedAccounts } from "@/hooks/useGetSuggestedAccounts";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const SideNav = () => {
  const matchRoute = useMatchRoute();
  const isFeedActive = matchRoute({ to: "/feed" });
  const isFollowingActive = matchRoute({ to: "/following" });
  const { suggestedAccounts, loading, error } = useGetSuggestedAccounts();

  return (
    <nav className="flex flex-col items-start py-8 px-4 sm:ml-20 sm:space-y-8 h-full overflow-hidden">
      <div className="hidden sm:flex sm:flex-col sm:w-full sm:space-y-8">
        <Link
          to="/feed"
          className={`flex items-center space-x-4 hover:underline hover:underline-offset-4 hover:text-red-500 transition-all duration-300 ${isFeedActive ? "text-red-500" : ""}`}
        >
          <div className="flex items-center whitespace-nowrap">
            <HiHome size={24} className="flex-shrink-0" />
            <span className="ml-4 mt-1">For You</span>
          </div>
        </Link>
        <Link
          to="/following"
          className={`flex items-center space-x-4 hover:underline hover:underline-offset-4 hover:text-red-500 transition-all duration-300 ${isFollowingActive ? "text-red-500" : ""}`}
        >
          <div className="flex items-center whitespace-nowrap">
            <Users size={24} className="flex-shrink-0" />
            <span className="ml-4 mt-1">Following</span>
          </div>
        </Link>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 w-full">
          <h3 className="text-sm text-muted-foreground font-base mb-4 whitespace-nowrap">
            Suggested accounts
          </h3>
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
            {!loading &&
              !error &&
              (suggestedAccounts.length > 0 ? (
                suggestedAccounts.slice(0, 3).map((account) => (
                  <div
                    key={account.id}
                    className="flex items-center space-x-4 whitespace-nowrap"
                  >
                    <Avatar className="w-7 h-7 flex justify-center items-center flex-shrink-0 rounded-full dark:bg-[#18181B] bg-gray-200 ">
                      <AvatarImage
                        src={account.image || account.googleImage || ""}
                        alt={account.fullname}
                        className="rounded-full w-7 h-7 object-contain"
                      />
                      <AvatarFallback className="rounded-full flex items-center justify-center font-medium text-center">
                        {account.fullname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/profile/${account.id}`}
                        className="block truncate hover:underline hover:underline-offset-4 hover:text-red-500 transition-all duration-300"
                      >
                        {account.fullname}
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No suggested users
                </p>
              ))}
          </div>

          <div className="pt-4">
            <Link to="/suggested" className="text-sm text-red-400 font-base">
              See more
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default SideNav;
