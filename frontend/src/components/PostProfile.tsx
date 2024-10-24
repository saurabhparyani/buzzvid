import React from "react";
import { Link } from "@tanstack/react-router";
import { getVideoUrl } from "@/utils/getVideoUrl";

interface PostProfileProps {
  post: {
    id: number;
    video: string;
  };
}

const PostProfile: React.FC<PostProfileProps> = ({ post }) => {
  return (
    <Link to={`/post/${post.id}`} className="block">
      <div className="aspect-[9/16] bg-gray-200 rounded-lg overflow-hidden">
        <video
          src={getVideoUrl(post.video)}
          className="object-cover w-full h-full"
        />
      </div>
    </Link>
  );
};

export default PostProfile;
