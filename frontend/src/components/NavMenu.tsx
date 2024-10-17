import { Link } from "@tanstack/react-router";
import { useUserStore } from "@/stores/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const NavMenu = () => {
  const user = useUserStore((state) => state);

  return (
    <nav className="bg-background border-b p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">buzz.</div>
      <div className="flex items-center space-x-4 mr-14">
        <div className="items-center space-x-4 hidden sm:flex">
          <Link to="/feed" className="hover:text-primary">
            Feed
          </Link>
          <Link to="/upload" className="hover:text-primary">
            Upload
          </Link>
        </div>

        {user._id && (
          <Avatar className="-mt-1">
            {user.googleImage ? (
              <div className="scale-75">
                <AvatarImage
                  className="object-cover cursor-pointer rounded-full"
                  src={user.googleImage}
                  alt={user.fullname}
                />
              </div>
            ) : user.image ? (
              <AvatarImage src={user.image} alt={user.fullname} />
            ) : (
              <AvatarFallback>
                <User className="h-5 w-5 cursor-pointer" />
              </AvatarFallback>
            )}
          </Avatar>
        )}
      </div>
    </nav>
  );
};

export default NavMenu;
