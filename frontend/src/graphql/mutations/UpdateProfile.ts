import { gql } from "@apollo/client";

export const UPDATE_PROFILE = gql`
    mutation UpdateProfile($fullname: String!, $bio: String!, $image: Upload) {
        updateProfile(fullname: $fullname, bio: $bio, image: $image) {
            id
            fullname
            bio
            image
        }
    }
`