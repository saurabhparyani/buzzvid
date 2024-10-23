import { Link } from "@tanstack/react-router";
import { User } from "@/gql/graphql";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import FollowButton from "./FollowButton";

interface SuggestedUserCardProps {
  user: Omit<User, "password">;
  showFollowButton?: boolean;
}

const SuggestedUserCard: React.FC<SuggestedUserCardProps> = ({
  user,
  showFollowButton = true,
}) => {
  return (
    <Card className="h-full flex flex-col relative z-0">
      <CardContent className="p-4 flex flex-col flex-grow">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="flex-shrink-0">
            <AvatarImage
              src={user?.googleImage || user?.image || ""}
              alt={user.fullname}
            />
            <AvatarFallback>{user.fullname.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <Link
              to={`/profile/${user.id}`}
              className="font-semibold hover:underline block truncate"
            >
              {user.fullname}
            </Link>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        {showFollowButton && <FollowButton userId={user.id} />}
      </CardContent>
    </Card>
  );
};

export default SuggestedUserCard;
