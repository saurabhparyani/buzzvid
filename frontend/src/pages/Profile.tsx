/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@apollo/client";
import { GET_POSTS_BY_USER_ID } from "@/graphql/queries/GetPostsByUserId";
import { GET_USERS } from "@/graphql/queries/GetUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/stores/userStore";
import PostProfile from "@/components/PostProfile";
import EditProfileModal from "@/components/EditProfileModal";
import FollowButton from "@/components/FollowButton";
import { GET_FOLLOWERS } from "@/graphql/queries/GetFollowers";
import { GET_LIKED_POSTS_BY_USER_ID } from "@/graphql/queries/GetLikedPostsByUserId";

interface User {
  id: number;
  fullname: string;
  email: string;
  googleImage?: string;
  image?: string;
  bio?: string;
}

interface Post {
  id: number;
  video: string;
  likesCount: number;
}

interface Follower {
  id: number;
  fullname: string;
  email: string;
  image?: string;
  googleImage?: string;
}

const Profile = () => {
  const { id } = useParams({ from: "/_authenticated/profile/$id" });
  const [activeTab, setActiveTab] = useState("videos");
  const loggedInUserId = useUserStore((state) => state.id);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const { data: userData, loading: userLoading } = useQuery(GET_USERS, {
    variables: { userId: parseInt(id as string) },
  });
  const { data: postsData, loading: postsLoading } = useQuery(
    GET_POSTS_BY_USER_ID,
    {
      variables: { userId: Number(id) },
    }
  );

  const { data: likedPostsData, loading: likedPostsLoading } = useQuery(
    GET_LIKED_POSTS_BY_USER_ID,
    {
      variables: { userId: Number(id) },
    }
  );

  const {
    data: followersData,
    loading: followersLoading,
    error: followersError,
  } = useQuery(GET_FOLLOWERS, {
    variables: { userId: Number(id) },
  });

  if (userLoading || postsLoading || followersLoading || likedPostsLoading)
    return <Spinner />;

  if (followersError) {
    console.error("GetFollowers query error:", followersError);
    return <div>Error loading followers</div>;
  }

  const user = userData?.getUsers.find((user: User) => user.id == Number(id));
  const posts = postsData?.getPostsByUserId || [];
  const followers: Follower[] = followersData?.getFollowers || [];

  const totalLikes = posts.reduce(
    (sum: number, post: Post) => sum + post.likesCount,
    0
  );

  console.log(user);
  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
        <Avatar className="w-24 h-24 md:w-32 md:h-32">
          <AvatarImage
            src={user.googleImage || user.image}
            alt={user.fullname}
            className="object-contain"
          />
          <AvatarFallback>{user.fullname[0]}</AvatarFallback>
        </Avatar>
        <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
          <h1 className="text-2xl font-bold">{user.fullname}</h1>
          <p className="text-muted-foreground mt-1 mb-4">{user.email}</p>
          {id !== undefined && id != loggedInUserId && (
            <div className="mt-2">
              <FollowButton userId={Number(id)} />
            </div>
          )}
          {id !== undefined && id == loggedInUserId && (
            <>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => setIsEditProfileOpen(true)}
              >
                Edit Profile
              </Button>
              <EditProfileModal
                isOpen={isEditProfileOpen}
                onClose={() => setIsEditProfileOpen(false)}
                user={user}
              />
            </>
          )}
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <div className="flex items-center gap-1">
              <span className="font-bold">{followers.length}</span> Followers
            </div>
            <div className="flex items-center gap-1">
              <span className="font-bold">{totalLikes}</span> Likes
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Bio</h2>
        <p>{user.bio || "No bio available"}</p>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="videos" onClick={() => setActiveTab("videos")}>
            Videos
          </TabsTrigger>
          <TabsTrigger value="liked" onClick={() => setActiveTab("liked")}>
            Liked
          </TabsTrigger>
        </TabsList>
        <TabsContent value="videos">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-5">
            {posts.map((post: Post) => (
              <PostProfile key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="liked">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {likedPostsData?.getLikedPostsByUserId.map((post: Post) => (
              <PostProfile key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
