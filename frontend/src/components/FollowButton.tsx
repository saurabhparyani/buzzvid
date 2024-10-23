/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { FOLLOW_USER } from "@/graphql/mutations/FollowUser";
import { UNFOLLOW_USER } from "@/graphql/mutations/UnfollowUser";
import { IS_FOLLOWING } from "@/graphql/queries/IsFollowing";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { UserPlus, Check } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { GET_FOLLOWERS } from "@/graphql/queries/GetFollowers";

interface FollowButtonProps {
  userId: number;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const { data, loading, error } = useQuery(IS_FOLLOWING, {
    variables: { followingId: userId },
    fetchPolicy: "cache-and-network", // Ensures data stays updated
  });

  const [followUser] = useMutation(FOLLOW_USER, {
    variables: { followingId: userId },
    update: (cache, { data: { followUser } }) => {
      cache.writeQuery({
        query: IS_FOLLOWING,
        variables: { followingId: userId },
        data: { isFollowing: true },
      });
    },
    refetchQueries: [
      {
        query: GET_FOLLOWERS,
        variables: { userId }, // Ensure this matches the Profile page userId
      },
    ],
    onError: (error) => {
      console.error("Follow mutation error:", error);
      toast.error(`Failed to follow user: ${error.message}`);
    },
    onCompleted: () => {
      toast.success("User followed successfully");
    },
  });

  const [unfollowUser] = useMutation(UNFOLLOW_USER, {
    variables: { followingId: userId },
    update: (cache, { data: { unfollowUser } }) => {
      cache.writeQuery({
        query: IS_FOLLOWING,
        variables: { followingId: userId },
        data: { isFollowing: false },
      });
    },
    refetchQueries: [
      {
        query: GET_FOLLOWERS,
        variables: { userId }, // Ensure this matches the Profile page userId
      },
    ],
    onError: (error) => {
      console.error("Unfollow mutation error:", error);
      toast.error(`Failed to unfollow user: ${error.message}`);
    },
    onCompleted: () => {
      toast.success("User unfollowed successfully");
    },
  });

  useEffect(() => {
    if (data) {
      setIsFollowing(data.isFollowing);
    }
  }, [data]);

  const handleFollow = async () => {
    try {
      await followUser();
      setIsFollowing(true);
    } catch (error: any) {
      console.error("Follow error:", error);
      // Error handling is managed in onError
    }
  };

  const handleUnfollow = async () => {
    try {
      await unfollowUser();
      setIsFollowing(false);
    } catch (error: any) {
      console.error("Unfollow error:", error);
      // Error handling is managed in onError
    }
  };

  if (loading) return <Button disabled>Loading...</Button>;
  if (error) {
    console.error("IsFollowing query error:", error);
    return <Button disabled>Error</Button>;
  }

  return isFollowing ? (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Check className="mr-2 h-4 w-4" /> Following
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will unfollow the user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUnfollow}>
            Unfollow
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <Button size="sm" onClick={handleFollow}>
      Follow <UserPlus className="ml-2 h-4 w-4" />
    </Button>
  );
};

export default FollowButton;
