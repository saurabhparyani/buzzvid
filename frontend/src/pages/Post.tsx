/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@apollo/client";
import { GET_POST_BY_ID } from "../graphql/queries/GetPostById";
import { GET_COMMENTS_BY_POST_ID } from "../graphql/queries/GetCommentsByPostId";
import { CREATE_COMMENT } from "../graphql/mutations/CreateComment";
import { DELETE_COMMENT } from "../graphql/mutations/DeleteComment";
import { LIKE_POST } from "../graphql/mutations/LikePost";
import { UNLIKE_POST } from "../graphql/mutations/UnlikePost";
import { usePostStore } from "../stores/postStore";
import { useUserStore } from "../stores/userStore";
import { GetCommentsByPostIdQuery } from "../gql/graphql";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  X,
  ChevronUp,
  ChevronDown,
  Heart,
  MessageCircle,
  Trash2,
  Play,
  Pause,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";

const Post = () => {
  const { id } = useParams({ from: "/_authenticated/post/$id" });
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [currentPostIdIndex, setCurrentPostIdIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const video = React.useRef<HTMLVideoElement>(null);
  const loggedInUserId = useUserStore((state) => state.id);
  const likedPosts = usePostStore((state) => state.likedPosts);
  const likePost = usePostStore((state) => state.likePost);
  const removeLike = usePostStore((state) => state.removeLike);

  const { data: dataPost, loading: loadingPost } = useQuery(GET_POST_BY_ID, {
    variables: { id: Number(id) },
  });

  const {
    data: commentsData,
    loading: _,
    refetch: refetchComments,
  } = useQuery<GetCommentsByPostIdQuery>(GET_COMMENTS_BY_POST_ID, {
    variables: { postId: Number(id) },
  });

  const [createCommentMutation] = useMutation(CREATE_COMMENT, {
    refetchQueries: [
      {
        query: GET_COMMENTS_BY_POST_ID,
        variables: { postId: Number(id) },
      },
    ],
  });

  const [deleteCommentMutation] = useMutation(DELETE_COMMENT, {
    update(cache, { data: { deleteComment } }) {
      const existingComments = cache.readQuery<GetCommentsByPostIdQuery>({
        query: GET_COMMENTS_BY_POST_ID,
        variables: { postId: Number(id) },
      });

      const newComments = existingComments?.getCommentsByPostId.filter(
        (comment) => comment.id !== deleteComment.id
      );

      cache.writeQuery({
        query: GET_COMMENTS_BY_POST_ID,
        data: { getCommentsByPostId: newComments },
        variables: { postId: Number(id) },
      });
    },
  });

  const [likePostMutation] = useMutation(LIKE_POST, {
    variables: { postId: Number(id) },
    refetchQueries: [{ query: GET_POST_BY_ID, variables: { id: Number(id) } }],
  });

  const [unlikePostMutation] = useMutation(UNLIKE_POST, {
    variables: { postId: Number(id) },
    refetchQueries: [{ query: GET_POST_BY_ID, variables: { id: Number(id) } }],
  });

  const handleAddComment = async () => {
    if (comment.trim()) {
      try {
        await createCommentMutation({
          variables: { postId: Number(id), text: comment },
        });
        setComment("");
        await refetchComments();
        toast.success("Comment added successfully!");
      } catch (error) {
        toast.error("Failed to add comment. Please try again.");
      }
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentMutation({ variables: { id: commentId } });
      await refetchComments();
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete comment. Please try again.");
    }
  };

  const handleLikePost = async () => {
    if (loggedInUserId == dataPost?.getPostById?.user.id) return;
    await likePostMutation();
    console.log("Liked post");
    likePost({
      id: Number(id),
      userId: Number(loggedInUserId),
      postId: Number(id),
    });
  };

  const handleUnlikePost = async () => {
    if (loggedInUserId == dataPost?.getPostById?.user.id) return;
    await unlikePostMutation();
    console.log("Unliked post");
    removeLike(Number(id));
  };

  const isLiked = likedPosts.some((likedPost) => {
    if (likedPost.postId == Number(id)) {
      if (!likedPost) return false;
      return likedPost?.userId == Number(loggedInUserId);
    }
  });

  const toggleVideoPlay = () => {
    if (video.current) {
      if (isPlaying) {
        video.current.pause();
      } else {
        video.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const loopThroughPosts = (direction: "up" | "down") => {
    const otherPostIds = dataPost?.getPostById?.otherPostIds || [];
    let newIndex =
      direction === "up" ? currentPostIdIndex + 1 : currentPostIdIndex - 1;

    if (newIndex < 0) {
      newIndex = otherPostIds.length - 1;
    } else if (newIndex >= otherPostIds.length) {
      newIndex = 0;
    }

    setCurrentPostIdIndex(newIndex);
    navigate({ to: "/post/$id", params: { id: otherPostIds[newIndex] } });
  };

  useEffect(() => {
    const videoRef = video.current;
    if (videoRef) {
      const handleLoadedData = () => {
        videoRef.play();
        setIsPlaying(true);
      };
      videoRef.addEventListener("loadeddata", handleLoadedData);
      return () => {
        videoRef.removeEventListener("loadeddata", handleLoadedData);
        videoRef.pause();
        videoRef.currentTime = 0;
        videoRef.load();
      };
    }
  }, [id]);

  const handleOpenDrawer = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Opening drawer");
    setIsDrawerOpen(true);
  };

  if (loadingPost) return <Spinner />;

  const post = dataPost?.getPostById;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <style>{`
        @media (max-width: 1024px) {
          .mobile-nav {
            display: none !important;
          }
        }
      `}</style>
      <Card className="w-full h-full lg:h-[90vh] lg:max-w-4xl flex flex-col lg:flex-row">
        {/* Video Section - Full screen on mobile, left side on desktop */}
        <div className="relative flex-1 bg-black">
          {/* Desktop and Mobile: Close button */}
          <Link to="/feed" className="absolute top-4 left-4 z-20">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white/80 dark:bg-black/80 dark:hover:bg-white/10 rounded-full"
            >
              <X className="h-6 w-6" />
            </Button>
          </Link>

          {/* Desktop only: Navigation buttons */}
          <div className="hidden lg:block">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-20"
              onClick={() => loopThroughPosts("up")}
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-20 right-4 z-20"
              onClick={() => loopThroughPosts("down")}
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>

          {/* Video player */}
          <div
            className="absolute inset-0 flex items-center justify-center z-10"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className={`bg-transparent dark:bg-black/80 rounded-full bg-opacity-50 p-2 transition-opacity duration-300 hover:bg-black/75 ${
                isHovering ? "opacity-100" : "opacity-0"
              }`}
              onClick={toggleVideoPlay}
            >
              {isPlaying ? (
                <Pause className="h-12 w-12 text-white" />
              ) : (
                <Play className="h-12 w-12 text-white" />
              )}
            </Button>
          </div>
          <video
            ref={video}
            src={`${import.meta.env.VITE_API_URL}${post?.video}`}
            className="w-full h-full object-contain lg:w-full lg:h-full lg:object-contain max-w-[90vw] max-h-[80vh] mx-auto my-auto mt-12"
            loop
            onClick={toggleVideoPlay}
          />

          {/* Mobile only: User info and interactions */}
          <div className="lg:hidden absolute bottom-4 left-4 right-4 flex justify-between items-end z-20">
            <div>
              <Link
                to={`/profile/${post?.user.id}`}
                className="font-semibold text-white hover:underline"
              >
                {post?.user.fullname}
              </Link>
              <p className="text-sm text-white">{post?.text}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white disabled:text-muted-foreground"
                disabled={dataPost?.getPostById?.user.id == loggedInUserId}
                onClick={isLiked ? handleUnlikePost : handleLikePost}
              >
                <Heart className={`h-6 w-6 ${isLiked ? "fill-red-500" : ""}`} />
                <span className="ml-2">
                  {dataPost?.getPostById?.likes?.length}
                </span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
                onClick={handleOpenDrawer}
              >
                <MessageCircle className="h-6 w-6" />
                <span className="ml-2">
                  {commentsData?.getCommentsByPostId?.length}
                </span>
              </Button>
            </div>
          </div>

          {/* Mobile Comments Drawer */}
          <div
            className={`lg:hidden fixed inset-x-0 bottom-0 bg-background z-50 transition-transform duration-300 ease-in-out transform ${
              isDrawerOpen ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ height: "70vh" }}
          >
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Comments</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex-grow overflow-y-auto">
                {commentsData?.getCommentsByPostId.length == 0 ? (
                  <p className="text-center text-muted-foreground">
                    No comments
                  </p>
                ) : (
                  commentsData?.getCommentsByPostId.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start space-x-2 mb-2"
                    >
                      <Avatar>
                        <AvatarImage
                          src={
                            comment.user.image ||
                            comment.user.googleImage ||
                            undefined
                          }
                          alt={comment.user.fullname}
                        />
                        <AvatarFallback>
                          {comment.user.fullname?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <p className="text-sm font-semibold">
                          {comment.user.fullname}
                        </p>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                      {comment.user.id == Number(loggedInUserId) && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your comment.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-grow"
                />
                <Button onClick={handleAddComment} disabled={!comment.trim()}>
                  Post
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop only: Comments and Interactions Section */}
        <CardContent className="w-96 hidden lg:flex flex-col">
          <div className="flex items-center mt-12 space-x-4 mb-4">
            <Avatar className="w-9 h-9 object-contain">
              <AvatarImage
                src={
                  dataPost.getPostById.user.image ||
                  dataPost.getPostById.user.googleImage
                }
                alt={post?.user.fullname}
                className="object-contain"
              />
              <AvatarFallback>{post?.user.fullname.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <Link
                to={`/profile/${post?.user.id}`}
                className="font-semibold hover:underline"
              >
                {dataPost.getPostById.user.fullname}
              </Link>
              <p className="text-sm text-muted-foreground">
                {new Date(post?.createdAt).toLocaleString()}
              </p>
            </div>
            {post?.user.id !== Number(loggedInUserId) && (
              <Button variant="outline" size="sm">
                Follow
              </Button>
            )}
          </div>
          <p className="mb-4 text-xl font-medium">{post?.text}</p>
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white disabled:text-muted-foreground"
              disabled={dataPost?.getPostById?.user.id == loggedInUserId}
              onClick={isLiked ? handleUnlikePost : handleLikePost}
            >
              <Heart
                className={`h-5 w-5 ${isLiked ? "fill-current text-red-500" : ""}`}
              />
              <span className="ml-2 pt-1">
                {dataPost?.getPostById?.likes?.length}
              </span>
            </Button>
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              <span className="pt-1 text-xs">
                {commentsData?.getCommentsByPostId.length}
              </span>
            </div>
          </div>
          <div className="flex-grow overflow-y-auto">
            {commentsData?.getCommentsByPostId.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-2 mb-2">
                <Avatar>
                  <AvatarImage
                    src={
                      comment.user.image ||
                      comment.user.googleImage ||
                      undefined
                    }
                    alt={comment.user.fullname}
                  />
                  <AvatarFallback>
                    {comment.user.fullname?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <p className="text-sm font-semibold">
                    {comment.user.fullname}
                  </p>
                  <p className="text-sm">{comment.text}</p>
                </div>
                {comment.user.id == Number(loggedInUserId) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your comment.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex space-x-2">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow"
            />
            <Button onClick={handleAddComment} disabled={!comment.trim()}>
              Post
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Post;
