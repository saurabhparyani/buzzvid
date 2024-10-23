import { useQuery } from "@apollo/client";
import { GET_FOLLOWING } from "@/graphql/queries/GetFollowing";
import { useUserStore } from "@/stores/userStore";

export const useGetFollowingAccounts = () => {
  const userId = useUserStore((state) => state.id);

  const { data, loading, error } = useQuery(GET_FOLLOWING, {
    variables: { userId: Number(userId) },
    skip: !userId, // Skip the query if userId is not available
  });

  const followingAccounts = data?.getFollowing || [];

  return {
    followingAccounts,
    loading,
    error,
  };
};