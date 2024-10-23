import { gql } from "@apollo/client"

export const GET_LIKED_POSTS_BY_USER_ID = gql`
  query getLikedPostsByUserId($userId: Float!) {
    getLikedPostsByUserId(userId: $userId) {
      id
      text
      video
      user {
        fullname
        email
        id
        image
        googleImage
      }
      likes {
        id
      }
      likesCount
    }
  }
`