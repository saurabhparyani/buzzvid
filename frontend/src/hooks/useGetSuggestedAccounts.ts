import { useQuery } from "@apollo/client";
import { GetUsersQuery } from "@/gql/graphql";
import { GET_USERS } from "@/graphql/queries/GetUsers";
import { useUserStore } from "@/stores/userStore";

export const useGetSuggestedAccounts = () => {
  const { data, loading, error } = useQuery<GetUsersQuery>(GET_USERS);
  const currentUser = useUserStore((state) => state);

  const filteredAccounts = data?.getUsers.filter(user => user.id !== Number(currentUser.id)) || [];

  return {
    suggestedAccounts: filteredAccounts,
    loading,
    error,
  };
};