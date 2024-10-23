import { gql } from '@apollo/client';

export const GET_FOLLOWERS = gql`
  query GetFollowers($userId: Int!) {
    getFollowers(userId: $userId) {
      id
      fullname
      email
      image
      googleImage
    }
  }
`;