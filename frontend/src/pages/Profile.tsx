/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { useQuery } from "@apollo/client";
import { GET_POSTS_BY_USER_ID } from "@/graphql/queries/GetPostsByUserId";
import { GET_USERS } from "@/graphql/queries/GetUsers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { useUserStore } from "@/stores/userStore";
import PostProfile from "@/components/PostProfile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
}

const Profile = () => {
  const { id } = useParams({ from: "/_authenticated/profile/$id" });
  const [activeTab, setActiveTab] = useState("videos");
  const loggedInUserId = useUserStore((state) => state.id);
  console.log("loggedInUserId", loggedInUserId);
  console.log("id", id);

  const { data: userData, loading: userLoading } = useQuery(GET_USERS);
  const { data: postsData, loading: postsLoading } = useQuery(
    GET_POSTS_BY_USER_ID,
    {
      variables: { userId: Number(id) },
    }
  );

  if (userLoading || postsLoading) return <Spinner />;

  const user = userData?.getUsers.find((user: User) => user.id == Number(id));
  const posts = postsData?.getPostsByUserId || [];

  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center md:items-start mb-8">
        <Avatar className="w-24 h-24 md:w-32 md:h-32">
          <AvatarImage
            src={user.googleImage || user.image}
            alt={user.fullname}
          />
          <AvatarFallback>{user.fullname[0]}</AvatarFallback>
        </Avatar>
        <div className="md:ml-8 mt-4 md:mt-0 text-center md:text-left">
          <h1 className="text-2xl font-bold">{user.fullname}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {id !== undefined && id != loggedInUserId && (
            <Button className="mt-2">Follow</Button>
          )}
          {id !== undefined && id == loggedInUserId && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="mt-2">
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={user.fullname}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={user.email}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <div className="flex justify-center md:justify-start space-x-4 mt-4">
            <div>
              <span className="font-bold">0</span> Following
            </div>
            <div>
              <span className="font-bold">0</span> Likes
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
            {/* Add liked posts here when implemented */}
            <p>Liked videos will be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
