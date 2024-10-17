import { gql } from "@apollo/client"

export const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($token: String!) {
    googleLogin(token: $token) {
      user {
        _id
        email
        fullname
      }
    }
  }
`