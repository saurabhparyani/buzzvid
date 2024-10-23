import React from "react";
import { Link } from "@tanstack/react-router";

interface PostProfileProps {
  post: {
    id: number;
    video: string;
  };
}

const PostProfile: React.FC<PostProfileProps> = ({ post }) => {
  return (
    <Link to={`/post/${post.id}`} className="block">
      <div className="aspect-w-9 aspect-h-16 bg-gray-200 rounded-lg overflow-hidden">
        <video
          src={`${import.meta.env.VITE_API_URL}${post.video}`}
          className="object-cover w-full h-full"
        />
      </div>
    </Link>
  );
};

export default PostProfile;
