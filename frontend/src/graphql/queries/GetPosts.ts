import { gql } from '@apollo/client';

export const GET_POSTS = gql`
  query GetPosts($skip: Int!, $take: Int!) {
    getPosts(skip: $skip, take: $take) {
      id
      text
      video
      user {
        id
        fullname
        email
        image
        googleImage
      }
      likes {
        id
        userId
        postId
      }
    }
  }
`;