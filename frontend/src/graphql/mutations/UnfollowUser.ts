import { gql } from '@apollo/client';

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followingId: Float!) {
    unfollowUser(followingId: $followingId) {
      id
      fullname
    }
  }
`;