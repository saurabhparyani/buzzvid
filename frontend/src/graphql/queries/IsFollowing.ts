import { gql } from '@apollo/client';

export const IS_FOLLOWING = gql`
  query IsFollowing($followingId: Float!) {
    isFollowing(followingId: $followingId)
  }
`;