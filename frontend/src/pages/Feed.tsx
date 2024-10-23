import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_POSTS } from "@/graphql/queries/GetPosts";
import { Spinner } from "@/components/ui/spinner";
import PostFeed from "@/components/PostFeed";
import { useInView } from "react-intersection-observer";

interface Post {
  id: number;
  user: {
    id: number;
    fullname: string;
    image?: string;
    googleImage?: string;
  };
  text: string;
  video: string;
  likes: { id: number }[];
  comments: { id: number }[];
}

const Feed = () => {
  const { ref, inView } = useInView();
  const { data, loading, error, fetchMore } = useQuery(GET_POSTS, {
    variables: { skip: 0, take: 2 },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (inView && !loading) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const loadMore = () => {
    fetchMore({
      variables: {
        skip: data?.getPosts.length || 0,
        take: 5,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getPosts: [...prev.getPosts, ...fetchMoreResult.getPosts],
        };
      },
    });
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-2xl mx-auto">
      {data?.getPosts.length == 0 ? (
        <p className="text-center text-gray-500 mt-8">No posts</p>
      ) : (
        data?.getPosts.map((post: Post) => (
          <PostFeed
            key={post.id}
            id={post.id}
            user={post.user}
            text={post.text}
            video={post.video}
            likes={post.likes?.length || 0}
            comments={post.comments?.length || 0}
          />
        ))
      )}
      <div ref={ref} className="h-20 flex items-center justify-center">
        {loading && <Spinner />}
      </div>
    </div>
  );
};

export default Feed;
