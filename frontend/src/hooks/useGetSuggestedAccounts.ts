import { useQuery } from "@apollo/client";
import { GET_USERS } from "@/graphql/queries/GetUsers";
import { GET_FOLLOWING } from "@/graphql/queries/GetFollowing";
import { useUserStore } from "@/stores/userStore";

interface User {
  id: number;
  fullname: string;
  email: string;
  image?: string;
  googleImage?: string;
}

export const useGetSuggestedAccounts = () => {
  const userId = useUserStore((state) => state.id);

  // Fetch all users excluding the current user
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_USERS, {
    variables: { userId: Number(userId) },
    skip: !userId, // Skip if userId is not available
  });

  // Fetch the accounts the current user is following
  const { data: followingData, loading: followingLoading, error: followingError } = useQuery(GET_FOLLOWING, {
    variables: { userId: Number(userId) },
    skip: !userId, // Skip if userId is not available
  });

  if (usersLoading || followingLoading) {
    return {
      suggestedAccounts: [],
      loading: true,
      error: null,
    };
  }

  if (usersError) {
    return {
      suggestedAccounts: [],
      loading: false,
      error: usersError,
    };
  }

  if (followingError) {
    return {
      suggestedAccounts: [],
      loading: false,
      error: followingError,
    };
  }

  const allUsers: User[] = usersData?.getUsers || [];
  const followingUsers: User[] = followingData?.getFollowing || [];

  // Extract the IDs of the users the current user is following
  const followingIds = followingUsers.map(user => user.id);

  // Filter out the users that are already followed and the current user
  const suggestedAccounts = allUsers.filter(user => user.id !== Number(userId) && !followingIds.includes(user.id));

  return {
    suggestedAccounts,
    loading: false,
    error: null,
  };
};