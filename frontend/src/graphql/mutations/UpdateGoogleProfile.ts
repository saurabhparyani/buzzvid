import { gql } from "@apollo/client";

export const UPDATE_GOOGLE_PROFILE = gql`
    mutation UpdateGoogleProfile($fullname: String!, $bio: String!, $googleImage: Upload) {
        updateGoogleProfile(fullname: $fullname, bio: $bio, googleImage: $googleImage) {
            id
            fullname
            bio
            googleImage
        }
    }
`