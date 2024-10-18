import { useQuery } from "@apollo/client";
import { GetUsersQuery } from "@/gql/graphql";
import { GET_USERS } from "@/graphql/queries/GetUsers";

export const useGetSuggestedAccounts = () => {
  const { data, loading, error } = useQuery<GetUsersQuery>(GET_USERS);

  return {
    suggestedAccounts: data?.getUsers || [],
    loading,
    error,
  };
};