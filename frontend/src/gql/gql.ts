/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n  mutation CreateComment($text: String!, $postId: Float!) {\n    createComment(text: $text, postId: $postId) {\n      text\n      id\n      createdAt\n      user {\n        id\n        fullname\n        email\n        image\n        googleImage\n      }\n      post {\n        id\n        text\n        video\n      }\n    }\n  }\n": types.CreateCommentDocument,
    "\n  mutation CreatePost($text: String!, $video: Upload!) {\n    createPost(text: $text, video: $video) {\n      id\n      text\n      video\n    }\n  }\n": types.CreatePostDocument,
    "\n  mutation DeleteComment($id: Float!) {\n    deleteComment(id: $id) {\n      id\n      __typename\n    }\n  }\n": types.DeleteCommentDocument,
    "\n  mutation FollowUser($followingId: Float!) {\n    followUser(followingId: $followingId) {\n      id\n      fullname\n    }\n  }\n": types.FollowUserDocument,
    "\n  mutation GoogleLogin($token: String!) {\n    googleLogin(token: $token) {\n      user {\n        id\n        email\n        fullname\n        googleImage\n      }\n    }\n  }\n": types.GoogleLoginDocument,
    "\n  mutation LikePost($postId: Float!) {\n    likePost(postId: $postId) {\n      id\n      userId\n      postId\n    }\n  }\n": types.LikePostDocument,
    "\n  mutation LoginUser($email: String!, $password: String!) {\n    login(loginInput: { email: $email, password: $password }) {\n      user {\n        email\n        id\n        fullname\n      }\n    }\n  }\n": types.LoginUserDocument,
    "\n  mutation LogoutUser {\n    logout\n  }\n": types.LogoutUserDocument,
    "\n  mutation RegisterUser(\n    $fullname: String!\n    $email: String!\n    $password: String!\n    $confirmPassword: String!\n  ) {\n    register(\n      registerInput: {\n        fullname: $fullname\n        email: $email\n        password: $password\n        confirmPassword: $confirmPassword\n      }\n    ) {\n      user {\n        id\n        fullname\n        email\n      }\n    }\n  }\n": types.RegisterUserDocument,
    "\n  mutation UnfollowUser($followingId: Float!) {\n    unfollowUser(followingId: $followingId) {\n      id\n      fullname\n    }\n  }\n": types.UnfollowUserDocument,
    "\n  mutation UnlikePost($postId: Float!) {\n    unlikePost(postId: $postId) {\n      id\n      userId\n      postId\n    }\n  }\n": types.UnlikePostDocument,
    "\n    mutation UpdateGoogleProfile($fullname: String!, $bio: String!, $googleImage: Upload) {\n        updateGoogleProfile(fullname: $fullname, bio: $bio, googleImage: $googleImage) {\n            id\n            fullname\n            bio\n            googleImage\n        }\n    }\n": types.UpdateGoogleProfileDocument,
    "\n    mutation UpdateProfile($fullname: String!, $bio: String!, $image: Upload) {\n        updateProfile(fullname: $fullname, bio: $bio, image: $image) {\n            id\n            fullname\n            bio\n            image\n        }\n    }\n": types.UpdateProfileDocument,
    "\n  query GetCommentsByPostId($postId: Float!) {\n    getCommentsByPostId(postId: $postId) {\n      id\n      text\n      createdAt\n      user {\n        id\n        fullname\n        email\n        image\n        googleImage\n      }\n      post {\n        id\n        text\n        video\n      }\n    }\n  }\n": types.GetCommentsByPostIdDocument,
    "\n  query GetFollowers($userId: Int!) {\n    getFollowers(userId: $userId) {\n      id\n      fullname\n      email\n      image\n      googleImage\n    }\n  }\n": types.GetFollowersDocument,
    "\n  query GetFollowing($userId: Int!) {\n    getFollowing(userId: $userId) {\n      id\n      fullname\n      email\n      image\n      googleImage\n    }\n  }\n": types.GetFollowingDocument,
    "\n  query getLikedPostsByUserId($userId: Float!) {\n    getLikedPostsByUserId(userId: $userId) {\n      id\n      text\n      video\n      user {\n        fullname\n        email\n        id\n        image\n        googleImage\n      }\n      likes {\n        id\n      }\n      likesCount\n    }\n  }\n": types.GetLikedPostsByUserIdDocument,
    "\n  query GetPostById($id: Float!) {\n    getPostById(id: $id) {\n      id\n      text\n      video\n      createdAt\n      user {\n        id\n        email\n        fullname\n        image\n        googleImage\n      }\n      likes {\n        id\n        userId\n        postId\n      }\n      otherPostIds\n    }\n  }\n": types.GetPostByIdDocument,
    "\n  query GetPosts($skip: Int!, $take: Int!) {\n    getPosts(skip: $skip, take: $take) {\n      id\n      text\n      video\n      user {\n        id\n        fullname\n        email\n        image\n        googleImage\n      }\n      likes {\n        id\n        userId\n        postId\n      }\n    }\n  }\n": types.GetPostsDocument,
    "\n  query getPostsByUserId($userId: Float!) {\n    getPostsByUserId(userId: $userId) {\n      id\n      text\n      video\n      user {\n        fullname\n        email\n        id\n        image\n        googleImage\n      }\n      likes {\n        id\n      }\n      likesCount\n    }\n  }\n": types.GetPostsByUserIdDocument,
    "\n    query GetUsers {\n        getUsers {\n            id\n            bio\n            fullname\n            email\n            image\n            googleImage\n        }\n    }\n\n": types.GetUsersDocument,
    "\n  query IsFollowing($followingId: Float!) {\n    isFollowing(followingId: $followingId)\n  }\n": types.IsFollowingDocument,
    "\n  query SearchUsers($searchTerm: String!) {\n    searchUsers(searchTerm: $searchTerm) {\n      id\n      fullname\n      email\n      image\n      googleImage\n    }\n  }\n": types.SearchUsersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateComment($text: String!, $postId: Float!) {\n    createComment(text: $text, postId: $postId) {\n      text\n      id\n      createdAt\n      user {\n        id\n        fullname\n        email\n        image\n        googleImage\n      }\n      post {\n        id\n        text\n        video\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateComment($text: String!, $postId: Float!) {\n    createComment(text: $text, postId: $postId) {\n      text\n      id\n      createdAt\n      user {\n        id\n        fullname\n        email\n        image\n        googleImage\n      }\n      post {\n        id\n        text\n        video\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreatePost($text: String!, $video: Upload!) {\n    createPost(text: $text, video: $video) {\n      id\n      text\n      video\n    }\n  }\n"): (typeof documents)["\n  mutation CreatePost($text: String!, $video: Upload!) {\n    createPost(text: $text, video: $video) {\n      id\n      text\n      video\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteComment($id: Float!) {\n    deleteComment(id: $id) {\n      id\n      __typename\n    }\n  }\n"): (typeof documents)["\n  mutation DeleteComment($id: Float!) {\n    deleteComment(id: $id) {\n      id\n      __typename\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation FollowUser($followingId: Float!) {\n    followUser(followingId: $followingId) {\n      id\n      fullname\n    }\n  }\n"): (typeof documents)["\n  mutation FollowUser($followingId: Float!) {\n    followUser(followingId: $followingId) {\n      id\n      fullname\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation GoogleLogin($token: String!) {\n    googleLogin(token: $token) {\n      user {\n        id\n        email\n        fullname\n        googleImage\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation GoogleLogin($token: String!) {\n    googleLogin(token: $token) {\n      user {\n        id\n        email\n        fullname\n        googleImage\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LikePost($postId: Float!) {\n    likePost(postId: $postId) {\n      id\n      userId\n      postId\n    }\n  }\n"): (typeof documents)["\n  mutation LikePost($postId: Float!) {\n    likePost(postId: $postId) {\n      id\n      userId\n      postId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LoginUser($email: String!, $password: String!) {\n    login(loginInput: { email: $email, password: $password }) {\n      user {\n        email\n        id\n        fullname\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation LoginUser($email: String!, $password: String!) {\n    login(loginInput: { email: $email, password: $password }) {\n      user {\n        email\n        id\n        fullname\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation LogoutUser {\n    logout\n  }\n"): (typeof documents)["\n  mutation LogoutUser {\n    logout\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation RegisterUser(\n    $fullname: String!\n    $email: String!\n    $password: String!\n    $confirmPassword: String!\n  ) {\n    register(\n      registerInput: {\n        fullname: $fullname\n        email: $email\n        password: $password\n        confirmPassword: $confirmPassword\n      }\n    ) {\n      user {\n        id\n        fullname\n        email\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation RegisterUser(\n    $fullname: String!\n    $email: String!\n    $password: String!\n    $confirmPassword: String!\n  ) {\n    register(\n      registerInput: {\n        fullname: $fullname\n        email: $email\n        password: $password\n        confirmPassword: $confirmPassword\n      }\n    ) {\n      user {\n        id\n        fullname\n        email\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnfollowUser($followingId: Float!) {\n    unfollowUser(followingId: $followingId) {\n      id\n      fullname\n    }\n  }\n"): (typeof documents)["\n  mutation UnfollowUser($followingId: Float!) {\n    unfollowUser(followingId: $followingId) {\n      id\n      fullname\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UnlikePost($postId: Float!) {\n    unlikePost(postId: $postId) {\n      id\n      userId\n      postId\n    }\n  }\n"): (typeof documents)["\n  mutation UnlikePost($postId: Float!) {\n    unlikePost(postId: $postId) {\n      id\n      userId\n      postId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateGoogleProfile($fullname: String!, $bio: String!, $googleImage: Upload) {\n        updateGoogleProfile(fullname: $fullname, bio: $bio, googleImage: $googleImage) {\n            id\n            fullname\n            bio\n            googleImage\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateGoogleProfile($fullname: String!, $bio: String!, $googleImage: Upload) {\n        updateGoogleProfile(fullname: $fullname, bio: $bio, googleImage: $googleImage) {\n            id\n            fullname\n            bio\n            googleImage\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    mutation UpdateProfile($fullname: String!, $bio: String!, $image: Upload) {\n        updateProfile(fullname: $fullname, bio: $bio, image: $image) {\n            id\n            fullname\n            bio\n            image\n        }\n    }\n"): (typeof documents)["\n    mutation UpdateProfile($fullname: String!, $bio: String!, $image: Upload) {\n        updateProfile(fullname: $fullname, bio: $bio, image: $image) {\n            id\n            fullname\n            bio\n            image\n        }\n    }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCommentsByPostId($postId: Float!) {\n    getCommentsByPostId(postId: $postId) {\n      id\n      text\n      createdAt\n      user {\n        id\n        fullname\n        email\n        image\n        googleImage\n      }\n      post {\n        id\n        text\n        video\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCommentsByPostId($postId: Float!) {\n    getCommentsByPostId(postId: $postId) {\n      id\n      text\n      createdAt\n      user {\n        id\n        fullname\n        email\n        image\n        googleImage\n      }\n      post {\n        id\n        text\n        video\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetFollowers($userId: Int!) {\n    getFollowers(userId: $userId) {\n      id\n      fullname\n      email\n      image\n      googleImage\n    }\n  }\n"): (typeof documents)["\n  query GetFollowers($userId: Int!) {\n    getFollowers(userId: $userId) {\n      id\n      fullname\n      email\n      image\n      googleImage\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetFollowing($userId: Int!) {\n    getFollowing(userId: $userId) {\n      id\n      fullname\n      email\n      image\n      googleImage\n    }\n  }\n"): (typeof documents)["\n  query GetFollowing($userId: Int!) {\n    getFollowing(userId: $userId) {\n      id\n      fullname\n      email\n      image\n      googleImage\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getLikedPostsByUserId($userId: Float!) {\n    getLikedPostsByUserId(userId: $userId) {\n      id\n      text\n      video\n      user {\n        fullname\n        email\n        id\n        image\n        googleImage\n      }\n      likes {\n        id\n      }\n      likesCount\n    }\n  }\n"): (typeof documents)["\n  query getLikedPostsByUserId($userId: Float!) {\n    getLikedPostsByUserId(userId: $userId) {\n      id\n      text\n      video\n      user {\n        fullname\n        email\n        id\n        image\n        googleImage\n      }\n      likes {\n        id\n      }\n      likesCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPostById($id: Float!) {\n    getPostById(id: $id) {\n      id\n      text\n      video\n      createdAt\n      user {\n        id\n        email\n        fullname\n        image\n        googleImage\n      }\n      likes {\n        id\n        userId\n        postId\n      }\n      otherPostIds\n    }\n  }\n"): (typeof documents)["\n  query GetPostById($id: Float!) {\n    getPostById(id: $id) {\n      id\n      text\n      video\n      createdAt\n      user {\n        id\n        email\n        fullname\n        image\n        googleImage\n      }\n      likes {\n        id\n        userId\n        postId\n      }\n      otherPostIds\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetPosts($skip: Int!, $take: Int!) {\n    getPosts(skip: $skip, take: $take) {\n      id\n      text\n      video\n      user {\n        id\n        fullname\n        email\n        image\n        googleImage\n      }\n      likes {\n        id\n        userId\n        postId\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPosts($skip: Int!, $take: Int!) {\n    getPosts(skip: $skip, take: $take) {\n      id\n      text\n      video\n      user {\n        id\n        fullname\n        email\n        image\n        googleImage\n      }\n      likes {\n        id\n        userId\n        postId\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query getPostsByUserId($userId: Float!) {\n    getPostsByUserId(userId: $userId) {\n      id\n      text\n      video\n      user {\n        fullname\n        email\n        id\n        image\n        googleImage\n      }\n      likes {\n        id\n      }\n      likesCount\n    }\n  }\n"): (typeof documents)["\n  query getPostsByUserId($userId: Float!) {\n    getPostsByUserId(userId: $userId) {\n      id\n      text\n      video\n      user {\n        fullname\n        email\n        id\n        image\n        googleImage\n      }\n      likes {\n        id\n      }\n      likesCount\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetUsers {\n        getUsers {\n            id\n            bio\n            fullname\n            email\n            image\n            googleImage\n        }\n    }\n\n"): (typeof documents)["\n    query GetUsers {\n        getUsers {\n            id\n            bio\n            fullname\n            email\n            image\n            googleImage\n        }\n    }\n\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query IsFollowing($followingId: Float!) {\n    isFollowing(followingId: $followingId)\n  }\n"): (typeof documents)["\n  query IsFollowing($followingId: Float!) {\n    isFollowing(followingId: $followingId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query SearchUsers($searchTerm: String!) {\n    searchUsers(searchTerm: $searchTerm) {\n      id\n      fullname\n      email\n      image\n      googleImage\n    }\n  }\n"): (typeof documents)["\n  query SearchUsers($searchTerm: String!) {\n    searchUsers(searchTerm: $searchTerm) {\n      id\n      fullname\n      email\n      image\n      googleImage\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;