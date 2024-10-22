import React, { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Heart, MessageCircle, UserPlus, Volume2, VolumeX } from "lucide-react";
import { useUserStore } from "@/stores/userStore";

interface PostFeedProps {
  id: number;
  user: {
    id: number;
    fullname: string;
    image?: string;
    googleImage?: string;
  };
  text: string;
  video: string;
  likes: number;
  comments: number;
}

const PostFeed: React.FC<PostFeedProps> = ({
  id,
  user,
  text,
  video,
  likes,
  comments,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentUser = useUserStore((state) => state);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically call an API to update the like status
  };

  return (
    <div className="bg-background border border-border rounded-lg shadow-md mb-6">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Link
            to={`/profile/${user.id}`}
            className="flex items-center space-x-3 hover:underline hover:underline-offset-2"
          >
            <Avatar>
              <AvatarImage
                src={user.googleImage || user.image}
                alt={user.fullname}
              />
              <AvatarFallback>{user.fullname[0]}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{user.fullname}</span>
          </Link>
          {user.id !== currentUser.id && (
            <Button variant="outline" size="sm">
              <UserPlus className="mr-2 -mt-1 h-4 w-4" /> Follow
            </Button>
          )}
        </div>
        <p className="mb-4">{text}</p>
      </div>
      <div className="relative">
        <video
          ref={videoRef}
          src={`${import.meta.env.VITE_API_URL}${video}`}
          className="w-full h-96"
          loop
          muted={isMuted}
          autoPlay
          playsInline
        />
        <button
          onClick={toggleMute}
          className="absolute bottom-4 right-4 bg-black bg-opacity-50 p-2 rounded-full"
        >
          {isMuted ? (
            <VolumeX className="h-6 w-6 text-white" />
          ) : (
            <Volume2 className="h-6 w-6 text-white" />
          )}
        </button>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={toggleLike} className="flex items-center space-x-2">
            <Heart
              className={`h-6 w-6 ${isLiked ? "text-red-500 fill-red-500" : "text-gray-500"}`}
            />
            <span className="pt-1">{likes + (isLiked ? 1 : 0)}</span>
          </button>
          <Link to={`/post/${id}`} className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6 text-gray-500" />
            <span className="pt-1">{comments}</span>
          </Link>
        </div>
        <Link to={`/post/${id}`} className="text-sm text-muted-foreground">
          View all comments
        </Link>
      </div>
    </div>
  );
};

export default PostFeed;
