import { gql } from '@apollo/client';

export const GET_FOLLOWING = gql`
  query GetFollowing($userId: Int!) {
    getFollowing(userId: $userId) {
      id
      fullname
      email
      image
      googleImage
    }
  }
`;