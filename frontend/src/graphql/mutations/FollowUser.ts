import { gql } from '@apollo/client';

export const FOLLOW_USER = gql`
  mutation FollowUser($followingId: Float!) {
    followUser(followingId: $followingId) {
      id
      fullname
    }
  }
`;