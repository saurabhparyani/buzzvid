import { gql } from "@apollo/client";

export const SEARCH_USERS = gql`
  query SearchUsers($searchTerm: String!) {
    searchUsers(searchTerm: $searchTerm) {
      id
      fullname
      email
      image
      googleImage
    }
  }
`;